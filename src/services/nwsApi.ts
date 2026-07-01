/**
 * US National Weather Service (api.weather.gov) client, normalized into the
 * same {@link WeatherData} model as WeatherAPI so the UI is provider-agnostic.
 *
 * Flow: /points/{lat,lon} → forecast office + grid + URLs, then the 12-hour
 * /forecast and the /forecast/hourly endpoints. Astronomy (sun/moon) is
 * computed locally (NWS has none); "current" is derived from the first hourly
 * period (station observations are frequently incomplete); feels-like is
 * computed (heat index / wind chill). NWS condition text is English-only, so
 * we localize it ourselves via the icon → condition mapping.
 */

import { NWS_API_BASE, NWS_USER_AGENT } from '@/config';
import { computeAstro } from '@/services/astronomy';
import { conditionFromIcon, conditionText } from '@/i18n/conditions';
import type { LanguageCode } from '@/i18n/translations';
import {
  WeatherApiError,
  type DayForecast,
  type HourForecast,
  type WeatherData,
} from '@/services/weatherApi';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const round4 = (n: number) => Math.round(n * 1e4) / 1e4;
const cToF = (c: number) => (c * 9) / 5 + 32;

async function nws<T = any>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': NWS_USER_AGENT, Accept: 'application/geo+json' },
    });
  } catch {
    throw new WeatherApiError('Network error — check your connection.');
  }
  if (!res.ok) throw new WeatherApiError(`NWS request failed (${res.status}).`);
  return (await res.json()) as T;
}

/** "16 km/h" / "10 to 15 km/h" → 15. (Requested with units=si → km/h.) */
function parseWindKph(s: string | null | undefined): number {
  const nums = String(s ?? '').match(/\d+/g);
  return nums ? Number(nums[nums.length - 1]) : 0;
}

/** Apparent temperature (°C) from NOAA heat-index / wind-chill, else air temp. */
function computeFeelsLike(tempC: number, humidity: number, windKph: number): number {
  if (tempC >= 27 && humidity > 0) {
    const T = cToF(tempC);
    const R = humidity;
    const hi =
      -42.379 +
      2.04901523 * T +
      10.14333127 * R -
      0.22475541 * T * R -
      6.83783e-3 * T * T -
      5.481717e-2 * R * R +
      1.22874e-3 * T * T * R +
      8.5282e-4 * T * R * R -
      1.99e-6 * T * T * R * R;
    return ((hi - 32) * 5) / 9;
  }
  if (tempC <= 10 && windKph >= 4.8) {
    const v = Math.pow(windKph, 0.16);
    return 13.12 + 0.6215 * tempC - 11.37 * v + 0.3965 * tempC * v;
  }
  return tempC;
}

function weekdayIndexOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** ISO 8601 duration ("PT6H", "P1DT6H", "PT30M") → milliseconds. */
function parseDurationMs(iso: string): number {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(iso || '');
  if (!m) return 3600000;
  const [, d, h, min] = m;
  return ((Number(d || 0) * 24 + Number(h || 0)) * 60 + Number(min || 0)) * 60000;
}

/** Local "YYYY-MM-DD" for an epoch, in the given timezone. */
function localDateInTz(ms: number, tz: string): string {
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  try {
    return new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: tz }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat('en-CA', opts).format(new Date(ms));
  }
}

/**
 * Precip amount (mm) from the gridpoints quantitativePrecipitation series:
 * today's total (intervals starting on the local date) and the amount for the
 * interval covering now. Returns zeros when the grid is unavailable.
 */
function precipFromGrid(
  grid: any,
  tz: string,
  todayDate: string,
  nowMs: number,
): { today: number; current: number } {
  const values = grid?.properties?.quantitativePrecipitation?.values;
  if (!Array.isArray(values)) return { today: 0, current: 0 };
  let today = 0;
  let current = 0;
  for (const v of values) {
    if (v?.value == null || !v.validTime) continue;
    const [startIso, dur] = String(v.validTime).split('/');
    const startMs = new Date(startIso).getTime();
    if (!Number.isFinite(startMs)) continue;
    const endMs = startMs + parseDurationMs(dur);
    if (localDateInTz(startMs, tz) === todayDate) today += v.value;
    if (nowMs >= startMs && nowMs < endMs) current = v.value;
  }
  return { today: Math.round(today * 10) / 10, current: Math.round(current * 10) / 10 };
}

/** Wall-clock "YYYY-MM-DD HH:MM" in the location's timezone. */
function localNow(tz: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: tz }).formatToParts(new Date());
  } catch {
    parts = new Intl.DateTimeFormat('en-CA', opts).formatToParts(new Date());
  }
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return `${g('year')}-${g('month')}-${g('day')} ${g('hour') === '24' ? '00' : g('hour')}:${g('minute')}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchNwsForecast(
  lat: number,
  lon: number,
  language: LanguageCode,
): Promise<WeatherData> {
  const rlat = round4(lat);
  const rlon = round4(lon);

  const points = await nws(`${NWS_API_BASE}/points/${rlat},${rlon}`);
  const pp = points.properties ?? {};
  const tz: string = pp.timeZone || 'UTC';
  const name: string = pp.relativeLocation?.properties?.city ?? 'Current location';
  const region: string = pp.relativeLocation?.properties?.state ?? '';

  const [hourly, daily, grid] = await Promise.all([
    nws(`${pp.forecastHourly}?units=si`),
    nws(`${pp.forecast}?units=si`),
    // Raw grid gives precip amounts; optional — never fail the forecast for it.
    nws(`${pp.forecastGridData}`).catch(() => null),
  ]);

  const hPeriods: any[] = hourly.properties?.periods ?? [];
  const dPeriods: any[] = daily.properties?.periods ?? [];

  const localtime = localNow(tz);
  const todayDate = localtime.slice(0, 10);
  const now = Date.now();
  const precip = precipFromGrid(grid, tz, todayDate, now);

  // --- Hourly (current hour onward, 24) ---
  const future = hPeriods.filter((p) => new Date(p.endTime ?? p.startTime).getTime() > now);
  const slice = (future.length ? future : hPeriods).slice(0, 24);

  const hours: HourForecast[] = slice.map((p, i) => {
    const isDay = !!p.isDaytime;
    const humidity = p.relativeHumidity?.value ?? 0;
    const windKph = parseWindKph(p.windSpeed);
    const flC = computeFeelsLike(p.temperature, humidity, windKph);
    return {
      timeEpoch: Math.floor(new Date(p.startTime).getTime() / 1000),
      hour24: Number(String(p.startTime).slice(11, 13)),
      isNow: i === 0,
      tempC: Math.round(p.temperature),
      tempF: Math.round(cToF(p.temperature)),
      feelsLikeC: Math.round(flC),
      feelsLikeF: Math.round(cToF(flC)),
      humidity,
      conditionCode: conditionFromIcon(p.icon, isDay).code,
      isDay,
      chanceOfRain: p.probabilityOfPrecipitation?.value ?? 0,
    };
  });

  // --- Daily (group 12-hour periods by date: day = high, night = low) ---
  const byDate = new Map<string, { high?: number; low?: number; code: number | null; pop: number }>();
  for (const p of dPeriods) {
    const date = String(p.startTime).slice(0, 10);
    const e = byDate.get(date) ?? { code: null, pop: 0 };
    const pop = p.probabilityOfPrecipitation?.value ?? 0;
    e.pop = Math.max(e.pop, pop);
    if (p.isDaytime) {
      e.high = p.temperature;
      e.code = conditionFromIcon(p.icon, true).code;
    } else {
      e.low = p.temperature;
      if (e.code == null) e.code = conditionFromIcon(p.icon, true).code;
    }
    byDate.set(date, e);
  }

  const futureDates = [...byDate.keys()].filter((d) => d > todayDate).sort().slice(0, 2);
  const days: DayForecast[] = futureDates.map((d, i) => {
    const e = byDate.get(d)!;
    const hi = e.high ?? e.low ?? 0;
    const lo = e.low ?? e.high ?? 0;
    return {
      dateEpoch: Math.floor(new Date(`${d}T12:00:00Z`).getTime() / 1000),
      weekdayIndex: weekdayIndexOf(d),
      isTomorrow: i === 0,
      maxTempC: Math.round(hi),
      maxTempF: Math.round(cToF(hi)),
      minTempC: Math.round(lo),
      minTempF: Math.round(cToF(lo)),
      chanceOfRain: e.pop,
      conditionCode: e.code ?? 1003,
    };
  });

  // --- Today high/low/precip-chance from today's hourly temps ---
  const todayHours = hPeriods.filter((p) => String(p.startTime).slice(0, 10) === todayDate);
  const todayTemps = todayHours.map((p) => p.temperature as number);
  const todayDaily = byDate.get(todayDate);
  const hiC = todayTemps.length ? Math.max(...todayTemps) : (todayDaily?.high ?? hours[0]?.tempC ?? 0);
  const loC = todayTemps.length ? Math.min(...todayTemps) : (todayDaily?.low ?? hiC);
  const todayPop = todayDaily?.pop ?? Math.max(0, ...todayHours.map((p) => p.probabilityOfPrecipitation?.value ?? 0));

  const astro = computeAstro(rlat, rlon, tz);

  // --- Current (from the first/now hourly period) ---
  const h0 = slice[0] ?? {};
  const curIsDay = !!h0.isDaytime;
  const curHumidity = h0.relativeHumidity?.value ?? 0;
  const curWindKph = parseWindKph(h0.windSpeed);
  const curFlC = computeFeelsLike(h0.temperature ?? 0, curHumidity, curWindKph);
  const curCond = conditionFromIcon(h0.icon, curIsDay);

  return {
    location: {
      name,
      region,
      country: 'United States',
      lat: rlat,
      lon: rlon,
      tzId: tz,
      localtimeEpoch: Math.floor(now / 1000),
      localtime,
    },
    current: {
      tempC: Math.round(h0.temperature ?? 0),
      tempF: Math.round(cToF(h0.temperature ?? 0)),
      conditionText: conditionText(curCond.key, language),
      conditionCode: curCond.code,
      isDay: curIsDay,
      feelsLikeC: Math.round(curFlC),
      feelsLikeF: Math.round(cToF(curFlC)),
      humidity: curHumidity,
      windKph: Math.round(curWindKph),
      windDir: h0.windDirection ?? '',
      precipMm: precip.current,
    },
    today: {
      maxTempC: Math.round(hiC),
      maxTempF: Math.round(cToF(hiC)),
      minTempC: Math.round(loC),
      minTempF: Math.round(cToF(loC)),
      chanceOfRain: todayPop,
      precipMm: precip.today,
      sunrise: astro.sunrise,
      sunset: astro.sunset,
      moonPhase: astro.moonPhase,
      moonIllumination: astro.moonIllumination,
    },
    hours,
    days,
  };
}
