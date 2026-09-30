/**
 * National air quality sources, normalized into {@link AirQuality}.
 *
 * Mirrors providers.ts: each entry declares which locations it `covers` and how
 * to `fetch` a reading; the router tries them in order and gives up quietly.
 * None of these touch the WeatherAPI quota — that's the whole point. Where no
 * national source exists, WeatherAPI's `aqi=yes` already rode along on the
 * forecast call (see weatherApi.ts), so those locations are covered too.
 *
 * The hard part isn't fetching, it's that no two countries publish the same
 * scale. Each client maps its native index onto the shared 1–6 `band`; the
 * mapping tables are spelled out per source below.
 */

import {
  AIRNOW_API_BASE,
  AIRNOW_API_KEY,
  AIR_QUALITY_TTL,
  ATMO_FRANCE_WFS,
  HAS_AIRNOW_KEY,
  METNO_AIRQUALITY_BASE,
  METNO_USER_AGENT,
  UBA_API_BASE,
  UBA_STATIONS_TTL,
} from '@/config';
import { isInFrance, isInGermany, isInRegion, isInUSA } from '@/services/geo';
import { readCache, writeCache } from '@/services/cache';
import { since } from '@/utils/devTrace';
import { dateInTz } from '@/utils/tz';
import type { AirQuality } from '@/services/weatherApi';

export interface AirQualityContext {
  coords: { lat: number; lon: number };
  /** Known country (saved cities carry one); null for a raw GPS fix. */
  country: string | null;
}

interface AirQualitySource {
  id: string;
  covers: (ctx: AirQualityContext) => boolean;
  fetch: (ctx: AirQualityContext) => Promise<AirQuality | null>;
}

const clamp6 = (n: number) => Math.min(6, Math.max(1, Math.round(n)));

/** Great-circle-ish distance, good enough for picking the nearest station. */
function distanceDeg(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = aLat - bLat;
  const dLon = (aLon - bLon) * Math.cos((aLat * Math.PI) / 180);
  return Math.hypot(dLat, dLon);
}

async function getJson<T>(url: string, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(url, headers ? { headers } : undefined);
  if (!res.ok) throw new Error(`${res.status}`);
  return (await res.json()) as T;
}

/** "YYYY-MM-DD" shifted by whole days. */
function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// United States — EPA AirNow
// ---------------------------------------------------------------------------

interface AirNowObservation {
  ParameterName?: string;
  AQI?: number;
  Category?: { Number?: number; Name?: string };
  ReportingArea?: string;
  StateCode?: string;
}

/**
 * AirNow reports one observation per pollutant; the headline AQI is the worst
 * of them, which is also the one whose category is published. Its `Category`
 * is already the six EPA levels, so it *is* our band.
 */
async function fetchAirNow({ coords }: AirQualityContext): Promise<AirQuality | null> {
  const params = new URLSearchParams({
    format: 'application/json',
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    distance: '50',
    API_KEY: AIRNOW_API_KEY,
  });
  const rows = await getJson<AirNowObservation[]>(
    `${AIRNOW_API_BASE}/aq/observation/latLong/current/?${params.toString()}`,
  );
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const worst = rows
    .filter((r) => Number.isFinite(r.AQI) && (r.AQI as number) >= 0)
    .reduce<AirNowObservation | null>((a, b) => (a && (a.AQI ?? -1) >= (b.AQI ?? -1) ? a : b), null);
  if (!worst) return null;

  return {
    band: clamp6(worst.Category?.Number ?? 1),
    index: worst.AQI,
    pollutant: worst.ParameterName,
    source: 'AirNow',
    area: worst.ReportingArea,
  };
}

// ---------------------------------------------------------------------------
// Germany — Umweltbundesamt (UBA)
// ---------------------------------------------------------------------------

/** Row layout of /stations/json — see the `indices` key in its response. */
const UBA_STATION_ID = 0;
const UBA_STATION_CITY = 3;
const UBA_STATION_ACTIVE_TO = 6;
const UBA_STATION_LON = 7;
const UBA_STATION_LAT = 8;

interface UbaStation {
  id: string;
  city: string;
  lat: number;
  lon: number;
}

/** UBA component ids → the symbol we display. */
const UBA_COMPONENTS: Record<number, string> = {
  1: 'PM10',
  2: 'CO',
  3: 'O₃',
  4: 'SO₂',
  5: 'NO₂',
  9: 'PM2.5',
};

/**
 * UBA's index runs 0 (sehr gut) – 4 (sehr schlecht), one level coarser than our
 * six bands, so the two worst levels are spread onto 5 and 6 rather than
 * flattening "sehr schlecht" into a mid-range colour.
 */
const UBA_BAND = [1, 2, 3, 5, 6];

/**
 * The station list is ~110 KB and near-static, so it's cached for a month; the
 * measurements themselves are always fetched live.
 */
async function ubaStations(): Promise<UbaStation[]> {
  const cached = await readCache<UbaStation[]>('aq:uba:stations');
  if (cached && cached.age < UBA_STATIONS_TTL && cached.value.length) return cached.value;

  const raw = await getJson<{ data: Record<string, string[]> }>(
    `${UBA_API_BASE}/stations/json?use=airquality&lang=de`,
  );
  const stations: UbaStation[] = [];
  for (const row of Object.values(raw.data ?? {})) {
    // A non-empty "active to" means the station has been decommissioned.
    if (row[UBA_STATION_ACTIVE_TO]) continue;
    const lat = Number(row[UBA_STATION_LAT]);
    const lon = Number(row[UBA_STATION_LON]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    stations.push({ id: row[UBA_STATION_ID], city: row[UBA_STATION_CITY] ?? '', lat, lon });
  }
  if (stations.length) await writeCache('aq:uba:stations', stations);
  return stations;
}

/** Measurement row: [end, index, incomplete, [componentId, value, index, y]…]. */
type UbaRow = [string, number, number, ...(string | number)[][]];

async function fetchUba({ coords }: AirQualityContext): Promise<AirQuality | null> {
  const stations = await ubaStations();
  if (!stations.length) return null;
  const nearest = stations.reduce((a, b) =>
    distanceDeg(coords.lat, coords.lon, a.lat, a.lon) <=
    distanceDeg(coords.lat, coords.lon, b.lat, b.lon)
      ? a
      : b,
  );

  // Stations publish hourly with a lag, so ask for a two-day window and take
  // the most recent hour that actually carries an index.
  const today = dateInTz(Date.now(), 'Europe/Berlin');
  const params = new URLSearchParams({
    date_from: shiftDate(today, -1),
    time_from: '1',
    date_to: today,
    time_to: '24',
    station: nearest.id,
    lang: 'de',
  });
  const raw = await getJson<{ data?: Record<string, Record<string, UbaRow>> }>(
    `${UBA_API_BASE}/airquality/json?${params.toString()}`,
  );

  const series = raw.data?.[nearest.id];
  if (!series) return null;
  const latest = Object.entries(series)
    .filter(([, row]) => Number(row?.[1]) >= 0)
    .sort(([a], [b]) => (a < b ? 1 : -1))[0];
  if (!latest) return null;

  const [startedAt, row] = latest;
  const ubaIndex = Math.min(UBA_BAND.length - 1, Math.max(0, Number(row[1])));

  // Components start at position 3; the one driving the index is the worst.
  const components = row.slice(3) as (string | number)[][];
  const worst = components.reduce<(string | number)[] | null>(
    (a, b) => (a && Number(a[2]) >= Number(b[2]) ? a : b),
    null,
  );

  return {
    band: UBA_BAND[ubaIndex],
    pollutant: worst ? UBA_COMPONENTS[Number(worst[0])] : undefined,
    source: 'Umweltbundesamt',
    area: nearest.city || undefined,
    // The API reports wall-clock CET/CEST; treat it as UTC+1 rather than
    // pretending to a precision we don't have.
    observedAt: Math.floor(new Date(`${startedAt.replace(' ', 'T')}+01:00`).getTime() / 1000),
  };
}

// ---------------------------------------------------------------------------
// France — Atmo France (national aggregate of the regional AASQA networks)
// ---------------------------------------------------------------------------

interface AtmoProperties {
  code_qual?: number;
  lib_qual?: string;
  lib_zone?: string;
  source?: string;
  date_ech?: string;
  x_wgs84?: number;
  y_wgs84?: number;
  code_no2?: number;
  code_o3?: number;
  code_pm10?: number;
  code_pm25?: number;
  code_so2?: number;
}

/** ATMO sub-index field → pollutant symbol. */
const ATMO_POLLUTANTS: [keyof AtmoProperties, string][] = [
  ['code_o3', 'O₃'],
  ['code_no2', 'NO₂'],
  ['code_pm10', 'PM10'],
  ['code_pm25', 'PM2.5'],
  ['code_so2', 'SO₂'],
];

/**
 * Widening search radii, in degrees. The index is published per zone as a
 * single point (a commune centroid, or an intercommunal one for the AASQAs that
 * publish at EPCI level), and the service returns matches unordered — so a box
 * wide enough for the countryside would, in a dense city, hit the result cap
 * with distant suburbs before the zone we're standing in is ever returned.
 * Starting tight and only widening on an empty result keeps cities exact
 * without losing rural coverage.
 */
const ATMO_BOXES = [0.05, 0.2, 0.6];

/**
 * Filtering on the WGS84 attribute columns sidesteps the layer's projected
 * geometry, which would otherwise need the query point reprojected to Web
 * Mercator to run a spatial filter.
 *
 * ATMO's own scale is 1 (Bon) – 6 (Extrêmement mauvais): the same six levels as
 * our band, in the same order.
 */
async function fetchAtmoFrance({ coords }: AirQualityContext): Promise<AirQuality | null> {
  const { lat, lon } = coords;
  const today = dateInTz(Date.now(), 'Europe/Paris');

  let zones: AtmoProperties[] = [];
  for (const box of ATMO_BOXES) {
    const cql =
      `x_wgs84 BETWEEN ${lon - box} AND ${lon + box} AND ` +
      `y_wgs84 BETWEEN ${lat - box} AND ${lat + box} AND ` +
      `date_ech='${today}'`;
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'ind:ind_atmo',
      outputFormat: 'application/json',
      count: '200',
      CQL_FILTER: cql,
    });

    const raw = await getJson<{ features?: { properties?: AtmoProperties }[] }>(
      `${ATMO_FRANCE_WFS}?${params.toString()}`,
    );
    zones = (raw.features ?? [])
      .map((f) => f.properties)
      .filter((p): p is AtmoProperties => !!p?.code_qual && Number.isFinite(p.x_wgs84));
    if (zones.length) break;
  }
  if (!zones.length) return null;

  const nearest = zones.reduce((a, b) =>
    distanceDeg(lat, lon, a.y_wgs84!, a.x_wgs84!) <= distanceDeg(lat, lon, b.y_wgs84!, b.x_wgs84!)
      ? a
      : b,
  );

  const worst = ATMO_POLLUTANTS.reduce<{ symbol: string; value: number } | null>(
    (best, [field, symbol]) => {
      const value = Number(nearest[field]);
      if (!Number.isFinite(value)) return best;
      return !best || value > best.value ? { symbol, value } : best;
    },
    null,
  );

  return {
    band: clamp6(nearest.code_qual!),
    pollutant: worst?.symbol,
    // Credit the regional association that produced it, not the aggregator.
    source: nearest.source || 'Atmo France',
    area: nearest.lib_zone,
    observedAt: nearest.date_ech
      ? Math.floor(new Date(`${nearest.date_ech}T12:00:00Z`).getTime() / 1000)
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Norway — MET Norway air quality forecast (NILU)
// ---------------------------------------------------------------------------

interface MetNoAqTime {
  from?: string;
  variables?: Record<string, { value?: number }>;
}

const METNO_POLLUTANTS: [string, string][] = [
  ['AQI_o3', 'O₃'],
  ['AQI_no2', 'NO₂'],
  ['AQI_pm10', 'PM10'],
  ['AQI_pm25', 'PM2.5'],
];

/**
 * NILU's AQI is continuous, with its four named levels at the integer marks
 * (1 lite, 2 moderat, 3 høy, 4 svært høy). Rather than collapse it to four of
 * our six bands, the thresholds below spread the continuum across all six so a
 * reading of 1.9 doesn't read the same as 1.1.
 */
function metNoBand(aqi: number): number {
  if (aqi < 1.5) return 1;
  if (aqi < 2) return 2;
  if (aqi < 3) return 3;
  if (aqi < 3.5) return 4;
  if (aqi < 4) return 5;
  return 6;
}

async function fetchMetNoAq({ coords }: AirQualityContext): Promise<AirQuality | null> {
  const raw = await getJson<{ meta?: { location?: { name?: string } }; data?: { time?: MetNoAqTime[] } }>(
    `${METNO_AIRQUALITY_BASE}/?lat=${coords.lat.toFixed(4)}&lon=${coords.lon.toFixed(4)}`,
    { 'User-Agent': METNO_USER_AGENT },
  );

  const times = raw.data?.time ?? [];
  if (!times.length) return null;

  // The series is hourly and starts in the past; take the step covering now.
  const now = Date.now();
  const current = times.reduce((a, b) => {
    const da = Math.abs(new Date(a.from ?? 0).getTime() - now);
    const db = Math.abs(new Date(b.from ?? 0).getTime() - now);
    return da <= db ? a : b;
  });

  const aqi = current.variables?.AQI?.value;
  if (!Number.isFinite(aqi)) return null;

  const worst = METNO_POLLUTANTS.reduce<{ symbol: string; value: number } | null>(
    (best, [key, symbol]) => {
      const value = current.variables?.[key]?.value;
      if (!Number.isFinite(value)) return best;
      return !best || (value as number) > best.value ? { symbol, value: value as number } : best;
    },
    null,
  );

  return {
    band: metNoBand(aqi as number),
    pollutant: worst?.symbol,
    source: 'MET Norway',
    area: raw.meta?.location?.name,
    observedAt: current.from ? Math.floor(new Date(current.from).getTime() / 1000) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const SOURCES: AirQualitySource[] = [
  {
    id: 'AirNow',
    // Without a key there's nothing to call, so the US counts as uncovered —
    // that way no "miss" gets cached, and adding the key later takes effect at
    // the next refresh instead of after the throttle window.
    covers: ({ coords, country }) =>
      HAS_AIRNOW_KEY && (country === 'United States' || isInUSA(coords.lat, coords.lon)),
    fetch: fetchAirNow,
  },
  {
    id: 'UBA',
    covers: ({ coords, country }) => country === 'Germany' || isInGermany(coords.lat, coords.lon),
    fetch: fetchUba,
  },
  {
    id: 'Atmo France',
    covers: ({ coords, country }) => country === 'France' || isInFrance(coords.lat, coords.lon),
    fetch: fetchAtmoFrance,
  },
  {
    id: 'MET Norway AQ',
    covers: ({ coords, country }) => country === 'Norway' || isInRegion('norway', coords.lat, coords.lon),
    fetch: fetchMetNoAq,
  },
];

/**
 * Cache key for a reading. Coordinates are rounded to ~1 km so that GPS jitter
 * (or two saved cities in the same town) reuses one reading rather than each
 * fix counting as a new location.
 */
function readingKey({ lat, lon }: { lat: number; lon: number }): string {
  return `aq:reading:${lat.toFixed(2)},${lon.toFixed(2)}`;
}

/**
 * Best available reading for a location, or null when nothing covers it (or the
 * source is down). Air quality is a garnish — it must never fail a forecast.
 *
 * Readings are throttled to {@link AIR_QUALITY_TTL} independently of the
 * forecast: refreshing the weather does not re-hit a national authority if one
 * answered recently. Failures are cached too — a source that's down shouldn't
 * be retried on every pull-to-refresh either.
 */
export async function fetchAirQuality(ctx: AirQualityContext): Promise<AirQuality | null> {
  const key = readingKey(ctx.coords);
  const cached = await readCache<AirQuality | null>(key);
  if (cached && cached.age < AIR_QUALITY_TTL) {
    if (__DEV__) {
      console.log(`[aq] ${since()} reusing reading from ${Math.round(cached.age / 60000)} min ago`);
    }
    return cached.value;
  }

  let attempted = false;
  for (const source of SOURCES) {
    if (!source.covers(ctx)) continue;
    attempted = true;
    try {
      const started = Date.now();
      const reading = await source.fetch(ctx);
      if (reading) {
        if (__DEV__) console.log(`[aq] ${since()} ${source.id} served band ${reading.band} (${Date.now() - started}ms)`);
        const writeStarted = Date.now();
        await writeCache(key, reading);
        if (__DEV__) console.log(`[aq] ${since()} cache write took ${Date.now() - writeStarted}ms`);
        return reading;
      }
    } catch (e) {
      if (__DEV__) {
        console.log(`[aq] ${since()} ${source.id} failed:`, e instanceof Error ? e.message : e);
      }
    }
  }

  // Only remember an empty result when a source was actually called; locations
  // no source covers cost nothing and needn't occupy a cache entry.
  if (attempted) await writeCache<AirQuality | null>(key, null);
  return null;
}
