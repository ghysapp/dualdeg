/**
 * Sky events for the briefing: sun times, polar day/night, solstices and
 * equinoxes, moon phase (and supermoons), and the major meteor showers.
 * All computed on-device with suncalc plus a low-precision solar longitude,
 * so no provider needs to supply any of it.
 */

import { getMoonIllumination, getMoonPosition, getPosition, getTimes } from 'suncalc';

import { localClock, type LocalClock } from './timeline';
import type { MeteorKey } from './types';

/** Local noon of a date, approximated from longitude (good to ~1 h). */
function localNoon(date: string, lon: number): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12) - (lon / 15) * 3600_000);
}

export interface SunDay {
  sunrise?: LocalClock;
  sunset?: LocalClock;
  /** Evening golden hour start. */
  golden?: LocalClock;
  sunriseMs?: number;
  sunsetMs?: number;
  daylightMin?: number;
  polar?: 'day' | 'night';
}

const valid = (d: Date | null | undefined): d is Date => !!d && Number.isFinite(d.getTime());

export function sunDay(date: string, lat: number, lon: number, tz: string): SunDay {
  const noon = localNoon(date, lon);
  const t = getTimes(noon, lat, lon);
  if (!valid(t.sunrise) || !valid(t.sunset)) {
    return { polar: getPosition(noon, lat, lon).altitude > 0 ? 'day' : 'night' };
  }
  return {
    sunrise: localClock(t.sunrise.getTime(), tz),
    sunset: localClock(t.sunset.getTime(), tz),
    golden: valid(t.goldenHour) ? localClock(t.goldenHour.getTime(), tz) : undefined,
    sunriseMs: t.sunrise.getTime(),
    sunsetMs: t.sunset.getTime(),
    daylightMin: Math.round((t.sunset.getTime() - t.sunrise.getTime()) / 60000),
  };
}

// ---------------------------------------------------------------------------
// Solstices & equinoxes
// ---------------------------------------------------------------------------

/** Apparent solar ecliptic longitude, degrees (low precision, ~0.01°). */
function solarLongitude(ms: number): number {
  const d = ms / 86400000 + 2440587.5 - 2451545.0;
  const g = ((357.529 + 0.98560028 * d) * Math.PI) / 180;
  const q = 280.459 + 0.98564736 * d;
  const L = q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return ((L % 360) + 360) % 360;
}

export type SeasonEvent = 'marchEquinox' | 'juneSolstice' | 'septemberEquinox' | 'decemberSolstice';

/** The solstice/equinox falling on this local date, if any. */
export function seasonEventOn(date: string, lon: number): SeasonEvent | null {
  const [y, m, d] = date.split('-').map(Number);
  const start = Date.UTC(y, m - 1, d) - (lon / 15) * 3600_000;
  const a = solarLongitude(start);
  const b = solarLongitude(start + 86400000);
  const crosses = (deg: number) => {
    const da = ((a - deg + 540) % 360) - 180;
    const db = ((b - deg + 540) % 360) - 180;
    return da < 0 && db >= 0;
  };
  if (crosses(0)) return 'marchEquinox';
  if (crosses(90)) return 'juneSolstice';
  if (crosses(180)) return 'septemberEquinox';
  if (crosses(270)) return 'decemberSolstice';
  return null;
}

// ---------------------------------------------------------------------------
// Moon
// ---------------------------------------------------------------------------

export interface MoonNight {
  full: boolean;
  supermoon: boolean;
  newMoon: boolean;
  /** Illuminated fraction 0–1. */
  fraction: number;
}

/** Moon for the night that starts on `date` (sampled at ~23:00 local). */
export function moonNight(date: string, lat: number, lon: number): MoonNight {
  const at = new Date(localNoon(date, lon).getTime() + 11 * 3600_000);
  const { phase, fraction } = getMoonIllumination(at);
  // One day of the 29.53-day cycle ≈ 0.034 of phase.
  const full = Math.abs(phase - 0.5) < 0.02;
  const distance = getMoonPosition(at, lat, lon).distance;
  return {
    full,
    supermoon: full && distance < 362000,
    newMoon: fraction < 0.04,
    fraction,
  };
}

// ---------------------------------------------------------------------------
// Meteor showers — peak night (evening date), rate (ZHR), who can see it.
// ---------------------------------------------------------------------------

const METEORS: { key: MeteorKey; month: number; day: number; rate: number; minLat: number }[] = [
  { key: 'quadrantids', month: 1, day: 3, rate: 110, minLat: 10 },
  { key: 'lyrids', month: 4, day: 22, rate: 18, minLat: -20 },
  { key: 'etaAquariids', month: 5, day: 5, rate: 50, minLat: -90 },
  { key: 'perseids', month: 8, day: 12, rate: 100, minLat: -10 },
  { key: 'orionids', month: 10, day: 21, rate: 20, minLat: -90 },
  { key: 'leonids', month: 11, day: 17, rate: 15, minLat: -90 },
  { key: 'geminids', month: 12, day: 13, rate: 150, minLat: -30 },
];

export function meteorShowerOn(date: string, lat: number): { key: MeteorKey; rate: number } | null {
  const [, m, d] = date.split('-').map(Number);
  const hit = METEORS.find((s) => s.month === m && s.day === d && lat >= s.minLat);
  return hit ? { key: hit.key, rate: hit.rate } : null;
}
