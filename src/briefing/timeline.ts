/**
 * Turns a {@link WeatherData} into one continuous, annotated hour timeline, and
 * slices it into the frames a briefing talks about (today, tonight, tomorrow).
 *
 * Everything is keyed to the real clock at the location, not to when the data
 * was fetched: a saved city can be served from a cache several hours old, and
 * "rain from 2 pm" must not be said at 4 pm.
 */

import type { HourForecast, WeatherData } from '@/services/weatherApi';

import type { FrameKind } from './types';

export type PrecipType =
  | 'drizzle'
  | 'rain'
  | 'showers'
  | 'thunder'
  | 'thunderSnow'
  | 'snow'
  | 'sleet'
  | 'freezing';

/** 1 light · 2 moderate · 3 heavy · 4 torrential */
export type Intensity = 1 | 2 | 3 | 4;

export interface Precip {
  type: PrecipType;
  intensity: Intensity;
  /** False when the provider only calls it a possibility (low probability). */
  likely: boolean;
}

export type SkyKind = 'clear' | 'partly' | 'cloudy' | 'fog';

export interface THour {
  epoch: number;
  /** Local calendar date, "YYYY-MM-DD". */
  date: string;
  /** Whole days from today's local date (0 = today). */
  offset: number;
  hour: number;
  tC: number;
  tF: number;
  feelC: number;
  feelF: number;
  humidity: number;
  code: number;
  pop: number;
  isDay: boolean;
  uv?: number;
  windKph?: number;
  gustKph?: number;
  precipMm?: number;
  precip: Precip | null;
  sky: SkyKind;
  /** Freezing fog (fog below 0°C, or reported as such). */
  freezingFog: boolean;
}

// ---------------------------------------------------------------------------
// Condition codes (WeatherAPI's set; every provider maps onto it)
// ---------------------------------------------------------------------------

/** Codes that only say precipitation is *possible*. */
const POSSIBLE_CODES = new Set([1063, 1066, 1069, 1072, 1087]);

function precipFromCode(code: number): { type: PrecipType; intensity: Intensity } | null {
  switch (code) {
    case 1063: return { type: 'showers', intensity: 1 };
    case 1066: return { type: 'snow', intensity: 1 };
    case 1069: return { type: 'sleet', intensity: 1 };
    case 1072: return { type: 'freezing', intensity: 1 };
    case 1087: return { type: 'thunder', intensity: 2 };
    case 1114: return { type: 'snow', intensity: 2 }; // blowing snow
    case 1117: return { type: 'snow', intensity: 3 }; // blizzard
    case 1150: case 1153: return { type: 'drizzle', intensity: 1 };
    case 1168: return { type: 'freezing', intensity: 1 };
    case 1171: return { type: 'freezing', intensity: 2 };
    case 1180: case 1183: return { type: 'rain', intensity: 1 };
    case 1186: case 1189: return { type: 'rain', intensity: 2 };
    case 1192: case 1195: return { type: 'rain', intensity: 3 };
    case 1198: return { type: 'freezing', intensity: 1 };
    case 1201: return { type: 'freezing', intensity: 2 };
    case 1204: return { type: 'sleet', intensity: 1 };
    case 1207: return { type: 'sleet', intensity: 2 };
    case 1210: case 1213: return { type: 'snow', intensity: 1 };
    case 1216: case 1219: return { type: 'snow', intensity: 2 };
    case 1222: case 1225: return { type: 'snow', intensity: 3 };
    case 1237: return { type: 'sleet', intensity: 2 }; // ice pellets
    case 1240: return { type: 'showers', intensity: 1 };
    case 1243: return { type: 'showers', intensity: 3 };
    case 1246: return { type: 'showers', intensity: 4 };
    case 1249: return { type: 'sleet', intensity: 1 };
    case 1252: return { type: 'sleet', intensity: 2 };
    case 1255: return { type: 'snow', intensity: 1 };
    case 1258: return { type: 'snow', intensity: 2 };
    case 1261: return { type: 'sleet', intensity: 1 };
    case 1264: return { type: 'sleet', intensity: 2 };
    case 1273: return { type: 'thunder', intensity: 2 };
    case 1276: return { type: 'thunder', intensity: 3 };
    case 1279: case 1282: return { type: 'thunderSnow', intensity: 2 };
    default: return null;
  }
}

export const BLIZZARD_CODES = new Set([1114, 1117]);

function skyFromCode(code: number): SkyKind {
  if (code === 1000) return 'clear';
  if (code === 1003) return 'partly';
  if (code === 1030 || code === 1135 || code === 1147) return 'fog';
  return 'cloudy';
}

/**
 * Whether (and how) it's wet this hour. The condition code says what; the
 * probability says whether to believe it. A probability of exactly 0 next to a
 * rain code is read as "not reported" (Météo-France's coarse series has gaps)
 * rather than as a contradiction, unless the amount is explicitly zero too.
 */
function precipOf(h: HourForecast): Precip | null {
  const base = precipFromCode(h.conditionCode);
  const pop = h.chanceOfRain ?? 0;
  const mm = h.precipMm;

  if (!base) {
    // A dry code with a high probability still deserves a mention.
    return pop >= 70 && mm !== 0 ? { type: 'showers', intensity: 1, likely: false } : null;
  }
  if (pop === 0 && mm === 0) return null;
  const possibleCode = POSSIBLE_CODES.has(h.conditionCode);
  if (pop > 0 && pop < (possibleCode ? 50 : 40)) return null;

  let intensity = base.intensity;
  if (mm != null) {
    if (mm >= 15) intensity = 4;
    else if (mm >= 7) intensity = Math.max(intensity, 3) as Intensity;
    else if (mm >= 2.5) intensity = Math.max(intensity, 2) as Intensity;
  }

  let type = base.type;
  // Rain in sub-zero air is freezing rain in all but name.
  if ((type === 'rain' || type === 'showers' || type === 'drizzle') && h.tempC <= -1) type = 'freezing';

  const likely = pop === 0 ? !possibleCode || (mm ?? 0) > 0 : pop >= 60 || (mm ?? 0) >= 0.5;
  return { type, intensity, likely };
}

// ---------------------------------------------------------------------------
// Local clock
// ---------------------------------------------------------------------------

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(tz: string): Intl.DateTimeFormat {
  let f = partsFormatters.get(tz);
  if (!f) {
    const opts: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    try {
      f = new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: tz });
    } catch {
      f = new Intl.DateTimeFormat('en-CA', opts);
    }
    partsFormatters.set(tz, f);
  }
  return f;
}

export interface LocalClock {
  date: string;
  hour: number;
  minute: number;
}

/** Wall-clock date/hour/minute of an instant at the location. */
export function localClock(ms: number, tz: string): LocalClock {
  const parts = formatterFor(tz).formatToParts(new Date(ms));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return {
    date: `${g('year')}-${g('month')}-${g('day')}`,
    hour: Number(g('hour')) % 24,
    minute: Number(g('minute')),
  };
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekdayOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export interface Timeline {
  now: LocalClock;
  hours: THour[];
}

export function buildTimeline(data: WeatherData, nowMs: number): Timeline {
  const tz = data.location.tzId;
  const now = localClock(nowMs, tz);

  // The 24-hour strip runs from the current hour; the per-day breakdowns carry
  // on from there. Merge by timestamp, keep only the current hour onward.
  const byEpoch = new Map<number, HourForecast>();
  for (const h of data.hours) byEpoch.set(h.timeEpoch, h);
  for (const d of data.days) for (const h of d.hours ?? []) if (!byEpoch.has(h.timeEpoch)) byEpoch.set(h.timeEpoch, h);

  const hours: THour[] = [...byEpoch.values()]
    .filter((h) => (h.timeEpoch + 3600) * 1000 > nowMs)
    .sort((a, b) => a.timeEpoch - b.timeEpoch)
    .map((h) => {
      const clock = localClock(h.timeEpoch * 1000, tz);
      const sky = skyFromCode(h.conditionCode);
      return {
        epoch: h.timeEpoch,
        date: clock.date,
        offset: daysBetween(now.date, clock.date),
        hour: clock.hour,
        tC: h.tempC,
        tF: h.tempF,
        feelC: h.feelsLikeC,
        feelF: h.feelsLikeF,
        humidity: h.humidity,
        code: h.conditionCode,
        pop: h.chanceOfRain ?? 0,
        isDay: h.isDay,
        uv: h.uv,
        windKph: h.windKph,
        gustKph: h.gustKph,
        precipMm: h.precipMm,
        precip: precipOf(h),
        sky,
        freezingFog: h.conditionCode === 1147 || (sky === 'fog' && h.tempC <= 0),
      };
    });

  return { now, hours };
}

// ---------------------------------------------------------------------------
// Frames
// ---------------------------------------------------------------------------

export interface Frame {
  kind: FrameKind;
  /** Day offset the frame's daytime belongs to (tonight: the evening's date). */
  offset: number;
  hours: THour[];
  /** True when the frame begins at the current hour (so "now" is its start). */
  startsNow: boolean;
}

/** Waking hours: what a day frame's rain/temperature story is about. */
const DAY_START = 6;
const DAY_END = 22; // inclusive

function dayFrame(tl: Timeline, kind: FrameKind, offset: number, fromHour: number): Frame {
  return {
    kind,
    offset,
    hours: tl.hours.filter((h) => h.offset === offset && h.hour >= fromHour && h.hour <= DAY_END),
    startsNow: offset === 0 && fromHour === tl.now.hour,
  };
}

/** Now until 07:00 the next morning. */
function nightFrame(tl: Timeline): Frame {
  const endOffset = tl.now.hour >= 12 ? 1 : 0;
  return {
    kind: 'tonight',
    offset: tl.now.hour >= 12 ? 0 : -1,
    hours: tl.hours.filter((h) => h.offset < endOffset || (h.offset === endOffset && h.hour < 7)),
    startsNow: true,
  };
}

/**
 * The two frames a briefing covers at this time of day — one per page:
 *   04–11  today            · tomorrow
 *   12–17  rest of the day  · tomorrow
 *   18–23  tonight          · tomorrow
 *   00–03  tonight          · the day after waking up
 */
export function framesFor(tl: Timeline): { primary: Frame; secondary: Frame } {
  const h = tl.now.hour;
  if (h >= 4 && h < 18) {
    return {
      primary: dayFrame(tl, h < 12 ? 'today' : 'restOfDay', 0, h),
      secondary: dayFrame(tl, 'tomorrow', 1, DAY_START),
    };
  }
  if (h >= 18) return { primary: nightFrame(tl), secondary: dayFrame(tl, 'tomorrow', 1, DAY_START) };
  return { primary: nightFrame(tl), secondary: dayFrame(tl, 'laterToday', 0, 7) };
}

export const isDayFrame = (f: Frame) => f.kind !== 'tonight';
export { DAY_END, DAY_START };
