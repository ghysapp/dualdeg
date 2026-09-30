/**
 * Detectors: read a frame of hours and say what's worth mentioning, as
 * language-free {@link Insight}s. No wording lives here — only thresholds.
 *
 * Severity guide (0–100):
 *   ≥ 85  dangerous (storm, freezing rain, extreme heat…) → serious tone
 *   60–84 plan around it (rain window, frost, gale, thunder)
 *   40–59 good to know (UV, big swing, drizzle, sky changes)
 *   < 40  colour (moon, sunsets, calm-day lines)
 */

import type { WeatherData } from '@/services/weatherApi';

import { meteorShowerOn, moonNight, seasonEventOn, sunDay } from './astro';
import {
  BLIZZARD_CODES,
  DAY_END,
  addDays,
  isDayFrame,
  weekdayOf,
  type Frame,
  type PrecipType,
  type THour,
  type Timeline,
} from './timeline';
import type { Insight, InsightFamily, InsightParams, LineKey, TipKey } from './types';

export interface DetectContext {
  data: WeatherData;
  tl: Timeline;
  lat: number;
  lon: number;
  tz: string;
  nowMs: number;
  isWorkday: (date: string) => boolean;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const temp = (h: THour) => ({ c: h.tC, f: h.tF });
const feel = (h: THour) => ({ c: h.feelC, f: h.feelF });
const nextHour = (h: THour) => (h.hour + 1) % 24;
const hm = (c: { hour: number; minute: number }) => ({ h: c.hour, m: c.minute });
const maxBy = <T>(xs: T[], f: (x: T) => number): T => xs.reduce((a, b) => (f(b) > f(a) ? b : a));
const minBy = <T>(xs: T[], f: (x: T) => number): T => xs.reduce((a, b) => (f(b) < f(a) ? b : a));

function insight(key: LineKey, family: InsightFamily, severity: number, params: InsightParams = {}): Insight {
  return { key, family, severity, params };
}

/** Dew point (°C), Magnus formula. */
function dewPoint(tC: number, rh: number): number {
  if (rh <= 0) return -99;
  const a = 17.62;
  const b = 243.12;
  const g = Math.log(rh / 100) + (a * tC) / (b + tC);
  return (b * g) / (a - g);
}

const RAINY: PrecipType[] = ['drizzle', 'rain', 'showers', 'thunder'];
const SNOWY: PrecipType[] = ['snow', 'thunderSnow'];

const isSunny = (h: THour) => !h.precip && (h.sky === 'clear' || h.sky === 'partly');
const isGray = (h: THour) => !!h.precip || h.sky === 'cloudy' || h.sky === 'fog';

/** Wind to quote: the gust when there is one, else the sustained speed. */
const windOf = (h: THour) => Math.max(h.windKph ?? 0, h.gustKph ?? 0);

// ---------------------------------------------------------------------------
// Precipitation episodes
// ---------------------------------------------------------------------------

interface Episode {
  hours: THour[];
  /** Index of first/last wet hour within the frame. */
  from: number;
  to: number;
}

/** Contiguous wet spells; a single dry hour inside a spell doesn't split it. */
function episodes(hours: THour[]): Episode[] {
  const out: Episode[] = [];
  let cur: Episode | null = null;
  hours.forEach((h, i) => {
    if (!h.precip) return;
    if (cur && i - cur.to <= 2) {
      cur.to = i;
      cur.hours.push(h);
    } else {
      cur = { hours: [h], from: i, to: i };
      out.push(cur);
    }
  });
  return out;
}

function precipInsights(frame: Frame, ctx: DetectContext): Insight[] {
  const H = frame.hours;
  const n = H.length;
  const wet = H.filter((h) => h.precip);
  if (!wet.length) return [];
  const out: Insight[] = [];
  const night = frame.kind === 'tonight';

  const of = (types: PrecipType[]) => wet.filter((h) => types.includes(h.precip!.type));
  const span = (hs: THour[]) => ({ start: hs[0].hour, end: nextHour(hs[hs.length - 1]) });

  // Thunder is its own family so it can sit beside the rain pattern.
  const thunder = of(['thunder']);
  if (thunder.length) out.push(insight(night ? 'nightStorm' : 'thunder', 'thunder', 78, span(thunder)));
  const tsnow = of(['thunderSnow']);
  if (tsnow.length) out.push(insight('thunderSnow', 'thunder', 76, { start: tsnow[0].hour }));

  // --- Winter types take over the precip family when they dominate. ---
  const freezing = of(['freezing']);
  if (freezing.length) {
    out.push(insight('freezingRain', 'precip', 90, { start: freezing[0].hour }));
    return out;
  }

  const snow = of(SNOWY);
  if (snow.length >= Math.max(1, wet.length * 0.5)) {
    const s = span(snow);
    const heavy = snow.some((h) => h.precip!.intensity >= 3);
    const blizzard = snow.some((h) => BLIZZARD_CODES.has(h.code) || windOf(h) >= 55);
    const avgT = snow.reduce((a, h) => a + h.tC, 0) / snow.length;
    const allLight = snow.every((h) => h.precip!.intensity === 1);
    if (blizzard) out.push(insight('blizzard', 'precip', 92, s));
    else if (heavy) out.push(insight('snowHeavy', 'precip', 88, s));
    else if (avgT >= 2) out.push(insight('slush', 'precip', 58, s));
    else if (night) out.push(insight('nightSnow', 'precip', 70, s));
    else if (allLight && snow.length <= 3) out.push(insight('snowLight', 'precip', 55, s));
    else out.push(insight('snow', 'precip', 72, s));
    return out;
  }

  const sleet = of(['sleet']);
  if (sleet.length >= Math.max(1, wet.length * 0.5)) {
    out.push(insight('sleet', 'precip', 62, span(sleet)));
    return out;
  }

  // --- Rain. ---
  const rain = of(RAINY);
  if (!rain.length) return out;

  const heaviest = maxBy(rain, (h) => h.precip!.intensity);
  // A thunderstorm already implies the downpour; don't say it twice.
  const stormCovers = thunder.some((h) => Math.abs(h.epoch - heaviest.epoch) <= 3600);
  if (heaviest.precip!.intensity >= 3 && !stormCovers) {
    out.push(insight('downpour', 'downpour', heaviest.precip!.intensity === 4 ? 78 : 70, { t: heaviest.hour }));
  }

  if (!rain.some((h) => h.precip!.likely)) {
    out.push(insight('showersPossible', 'precip', 40, span(rain)));
    return out;
  }
  if (rain.every((h) => h.precip!.type === 'drizzle')) {
    out.push(insight('drizzle', 'precip', 45, span(rain)));
    return out;
  }

  const eps = episodes(H);
  const coverage = wet.length / n;
  const push = (key: LineKey, params: InsightParams, sev = 60) => out.push(insight(key, 'precip', sev, params));

  if ((coverage >= 0.7 && n >= 5) || (eps.length === 1 && eps[0].from === 0 && eps[0].to >= n - 1)) {
    push(night ? 'nightRainAll' : 'rainAllDay', {}, 62);
    return out;
  }
  if (eps.length >= 2) {
    if (night) push('nightRainWindow', span(wet));
    else push('rainOnOff', {});
    return out;
  }

  const ep = eps[0];
  const first = ep.hours[0];
  const last = ep.hours[ep.hours.length - 1];
  const workday = frame.kind !== 'tonight' && ctx.isWorkday(first.date);
  const atStart = ep.from === 0;
  const atEnd = ep.to >= n - 1;

  if (night) {
    if (atStart) push('nightRainUntil', { end: nextHour(last) });
    else if (atEnd) push('nightRainFrom', { start: first.hour });
    else push('nightRainWindow', { start: first.hour, end: nextHour(last) });
    return out;
  }

  if (atStart) push('rainStops', { end: nextHour(last) });
  else if (workday && first.hour >= 6 && first.hour <= 8) push('rainCommuteAM', { start: first.hour }, 65);
  else if (workday && first.hour >= 16 && first.hour <= 18) push('rainCommutePM', { start: first.hour }, 65);
  else if (ep.hours.length === 1) push('rainBrief', { t: first.hour }, 50);
  else if (atEnd) push('rainLater', { start: first.hour });
  else push('rainWindow', { start: first.hour, end: nextHour(last) });
  return out;
}

// ---------------------------------------------------------------------------
// Ice, frost, fog
// ---------------------------------------------------------------------------

function iceInsights(frame: Frame, ctx: DetectContext): Insight[] {
  const out: Insight[] = [];
  const H = frame.hours;
  if (!H.length) return out;
  const night = frame.kind === 'tonight';

  // Mornings are what frost/ice talk about: a day frame's early hours, or the
  // tail end of the night.
  const morning = night ? H.filter((h) => h.hour <= 9) : H.filter((h) => h.hour <= 10);

  // Black ice: wet ground meeting sub-zero air — rain/sleet earlier in the
  // timeline (up to 8 h before) followed by a freeze, or a freeze with
  // saturated air right now.
  const all = ctx.tl.hours;
  const icy = H.find((h) => {
    if (h.tC > 0) return false;
    if (h.precip && h.precip.type !== 'snow') return true;
    const idx = all.indexOf(h);
    for (let j = Math.max(0, idx - 8); j < idx; j++) {
      const p = all[j];
      if (p.precip && p.tC > 0 && p.precip.type !== 'snow') return true;
    }
    return frame.startsNow && idx <= 1 && h.humidity >= 95;
  });
  // Freezing rain already says "ice everywhere".
  const freezingRain = H.some((h) => h.precip?.type === 'freezing');
  if (icy && !freezingRain) out.push(insight('blackIce', 'ice', 82, { t: icy.hour }));

  const wintry = H.some((h) => h.precip && (SNOWY.includes(h.precip.type) || h.precip.type === 'sleet'));
  if (!icy && !wintry && morning.length) {
    const coldest = minBy(morning, (h) => h.tC);
    if (coldest.tC <= 0) {
      const workday = ctx.isWorkday(coldest.date);
      out.push(insight('frost', 'ice', workday ? 62 : 56, { low: temp(coldest) }));
    }
  }

  // Fog.
  const fog = H.filter((h) => h.sky === 'fog' && (night || h.hour <= 11));
  if (fog.length >= 1) {
    const freezing = fog.some((h) => h.freezingFog);
    const workdayMorning = !night && ctx.isWorkday(fog[0].date) && fog[0].hour <= 9;
    if (freezing) out.push(insight('freezingFog', 'fog', 80, { end: nextHour(fog[fog.length - 1]) }));
    else if (night) out.push(insight('fogTonight', 'fog', 55, { start: fog[0].hour }));
    else out.push(insight('fogMorning', 'fog', workdayMorning ? 66 : 58, { end: nextHour(fog[fog.length - 1]) }));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Temperature
// ---------------------------------------------------------------------------

function tempInsights(frame: Frame, ctx: DetectContext): Insight[] {
  const out: Insight[] = [];
  const H = frame.hours;
  if (!H.length) return out;

  if (frame.kind === 'tonight') {
    const low = minBy(H, (h) => h.tC);
    if (low.tC >= 20) out.push(insight('tropicalNight', 'heat', 55, { low: temp(low) }));
    const chill = H.filter((h) => h.tC <= 10 && h.tC - h.feelC >= 6);
    if (chill.length) out.push(insight('windChill', 'cold', 46, { feels: feel(minBy(chill, (h) => h.feelC)) }));
    const coldest = minBy(H, (h) => h.feelC);
    if (coldest.feelC <= -28) out.push(insight('extremeCold', 'cold', 92, { feels: feel(coldest) }));
    else if (coldest.feelC <= -18) out.push(insight('bitterCold', 'cold', 78, { feels: feel(coldest) }));
    return out;
  }

  const hi = maxBy(H, (h) => h.tC);
  const hotFeel = maxBy(H, (h) => h.feelC);
  const coldFeel = minBy(H, (h) => h.feelC);

  // Heat.
  const window = (min: number) => {
    const hs = H.filter((h) => h.feelC >= min);
    return hs.length ? { start: hs[0].hour, end: nextHour(hs[hs.length - 1]) } : {};
  };
  if (hotFeel.feelC >= 40) out.push(insight('extremeHeat', 'heat', 92, { feels: feel(hotFeel), ...window(37) }));
  else if (hotFeel.feelC >= 35) out.push(insight('hot', 'heat', 76, { feels: feel(hotFeel), ...window(33) }));
  else if (hi.tC >= 30 || hotFeel.feelC >= 31) out.push(insight('warm', 'heat', 44, { high: temp(hi) }));

  // Cold.
  if (coldFeel.feelC <= -28) out.push(insight('extremeCold', 'cold', 92, { feels: feel(coldFeel) }));
  else if (coldFeel.feelC <= -18) out.push(insight('bitterCold', 'cold', 78, { feels: feel(coldFeel) }));
  else if (hi.tC <= 0) out.push(insight('freezingDay', 'cold', 58, { high: temp(hi) }));
  else if (hi.tC <= 4 && H.filter(isSunny).length / H.length >= 0.7) {
    out.push(insight('sunnyButCold', 'cold', 45, { high: temp(hi) }));
  }

  const chill = H.filter((h) => h.tC <= 10 && h.tC - h.feelC >= 6);
  if (chill.length && coldFeel.feelC > -18) {
    out.push(insight('windChill', 'temp', 46, { feels: feel(minBy(chill, (h) => h.feelC)) }));
  }

  // Morning → afternoon swing.
  const am = H.filter((h) => h.hour >= 6 && h.hour <= 10);
  const pm = H.filter((h) => h.hour >= 12 && h.hour <= 18);
  if (am.length >= 2 && pm.length >= 2) {
    const amLow = minBy(am, (h) => h.tC);
    const pmHigh = maxBy(pm, (h) => h.tC);
    if (pmHigh.tC - amLow.tC >= 10) {
      out.push(insight('bigSwing', 'temp', 55, { low: temp(amLow), high: temp(pmHigh) }));
    }
  }

  // Front: a fast daytime drop, not the usual evening cooling.
  for (let i = 0; i + 3 < H.length; i++) {
    const a = H[i];
    const b = H[i + 3];
    if (a.hour >= 9 && a.hour <= 14 && a.tC - b.tC >= 6) {
      out.push(insight('tempDrop', 'temp', 58, { t: H[i + 1].hour, diffC: a.tC - b.tC }));
      break;
    }
  }

  // Afternoon open: the evening will be much cooler than now.
  if (frame.kind === 'restOfDay') {
    const evening = H.find((h) => h.hour === 21) ?? H.find((h) => h.hour === 20);
    if (evening && H[0].tC - evening.tC >= 8) {
      out.push(insight('eveningChill', 'temp', 44, { low: temp(evening), t: evening.hour }));
    }
  }

  // Muggy.
  const sticky = H.filter((h) => h.tC >= 24 && dewPoint(h.tC, h.humidity) >= 21);
  if (sticky.length >= 3) out.push(insight('muggy', 'temp', 42));

  // Out of season (temperate latitudes only; the tropics have no "winter").
  const absLat = Math.abs(ctx.lat);
  if (absLat >= 30 && absLat <= 65) {
    const month = Number(H[0].date.slice(5, 7));
    const north = ctx.lat >= 0;
    const winter = north ? [12, 1, 2].includes(month) : [6, 7, 8].includes(month);
    const summer = north ? [6, 7, 8].includes(month) : [12, 1, 2].includes(month);
    if (winter && hi.tC >= 17) out.push(insight('warmForSeason', 'trend', 32, { high: temp(hi) }));
    if (summer && hi.tC <= 15 && H.length >= 8) out.push(insight('coldForSeason', 'trend', 32, { high: temp(hi) }));
  }

  return out;
}

/** Tomorrow's high against today's. */
function trendInsight(frame: Frame, ctx: DetectContext): Insight | null {
  if (frame.kind !== 'tomorrow' || !frame.hours.length) return null;
  const hi = maxBy(frame.hours, (h) => h.tC);
  const diff = hi.tC - ctx.data.today.maxTempC;
  if (Math.abs(diff) < 7) return null;
  const sev = Math.abs(diff) >= 10 ? 64 : 56;
  return insight(diff < 0 ? 'tomorrowColder' : 'tomorrowWarmer', 'trend', sev, {
    diffC: Math.abs(diff),
    high: temp(hi),
  });
}

// ---------------------------------------------------------------------------
// Wind
// ---------------------------------------------------------------------------

function windInsight(frame: Frame): Insight | null {
  const H = frame.hours.filter((h) => h.windKph != null || h.gustKph != null);
  if (!H.length) return null;
  const W = Math.max(...H.map((h) => h.windKph ?? 0));
  const G = Math.max(...H.map((h) => h.gustKph ?? 0));
  const params = { windKph: Math.max(W, G) };
  if (W >= 118 || G >= 150) return insight('hurricane', 'wind', 100, params);
  if (W >= 89 || G >= 110) return insight('storm', 'wind', 92, params);
  if (W >= 62 || G >= 90) return insight('gale', 'wind', 80, params);
  if (W >= 40 || G >= 65) return insight('windy', 'wind', 55, params);
  if (W >= 28 || G >= 50) return insight('breezy', 'wind', 32, params);
  return null;
}

// ---------------------------------------------------------------------------
// UV & air
// ---------------------------------------------------------------------------

function uvInsight(frame: Frame, ctx: DetectContext): Insight | null {
  if (!isDayFrame(frame)) return null;
  const H = frame.hours;
  const clearSkyOnly = !!ctx.data.today.uvClearSky;
  // A clear-sky figure means nothing under a lid of cloud.
  if (clearSkyOnly && H.length && H.filter(isGray).length / H.length >= 0.7) return null;

  const withUv = H.filter((h) => h.uv != null && h.isDay);
  let peak: number | undefined;
  let t = 13;
  let above: THour[] = [];
  if (withUv.length) {
    const top = maxBy(withUv, (h) => h.uv!);
    peak = top.uv;
    t = top.hour;
    above = withUv.filter((h) => (h.uv ?? 0) >= 6);
  } else if (frame.kind === 'today') {
    peak = ctx.data.today.uv;
  } else if (frame.kind === 'tomorrow') {
    peak = ctx.data.days[0]?.uv;
  }
  if (peak == null) return null;
  peak = Math.round(peak);
  if (peak >= 11) return insight('uvExtreme', 'uv', 68, { uv: peak });
  if (peak >= 8) {
    const w = above.length ? { start: above[0].hour, end: nextHour(above[above.length - 1]) } : { start: 11, end: 16 };
    return insight('uvVeryHigh', 'uv', 58, { uv: peak, ...w });
  }
  if (peak >= 6) return insight('uvHigh', 'uv', 44, { uv: peak, t });
  return null;
}

function airInsight(frame: Frame, ctx: DetectContext): Insight | null {
  if (frame.kind === 'tomorrow' || frame.kind === 'laterToday') return null;
  const band = ctx.data.airQuality?.band;
  if (band == null) return null;
  if (band >= 5) return insight('airVeryPoor', 'air', 72);
  if (band === 4) return insight('airPoor', 'air', 52);
  return null;
}

// ---------------------------------------------------------------------------
// Sky
// ---------------------------------------------------------------------------

function skyInsights(frame: Frame): Insight[] {
  const out: Insight[] = [];
  if (!isDayFrame(frame)) return out;
  const H = frame.hours.filter((h) => h.isDay);
  const n = H.length;
  if (n < 4) return out;
  const dry = !frame.hours.some((h) => h.precip);
  const sunny = H.filter(isSunny).length / n;
  const gray = H.filter(isGray).length / n;
  const hi = maxBy(frame.hours, (h) => h.tC);

  const maxFeel = maxBy(frame.hours, (h) => h.feelC).feelC;
  const maxWind = Math.max(0, ...frame.hours.map(windOf));
  const humid = frame.hours.some((h) => h.tC >= 20 && dewPoint(h.tC, h.humidity) >= 18);
  if (dry && sunny >= 0.6 && maxFeel >= 19 && maxFeel <= 27 && maxWind < 25 && !humid) {
    out.push(insight('perfectDay', 'sky', 46, { high: temp(hi) }));
  } else if (dry && sunny >= 0.85) {
    out.push(insight('sunnyAllDay', 'sky', 36, { high: temp(hi) }));
  } else if (dry && gray >= 0.85) {
    out.push(insight('grayAllDay', 'sky', 36));
  }

  if (n >= 6) {
    const third = Math.floor(n / 3);
    const head = H.slice(0, third);
    const tail = H.slice(n - third);
    const share = (hs: THour[], f: (h: THour) => boolean) => hs.filter(f).length / hs.length;
    // Start of the final run of sun / cloud.
    const runStart = (f: (h: THour) => boolean) => {
      let i = n - 1;
      while (i > 0 && f(H[i - 1])) i--;
      return H[i].hour;
    };
    if (share(head, isGray) >= 0.66 && share(tail, isSunny) >= 0.66) {
      out.push(insight('clearingLater', 'sky', 40, { t: runStart(isSunny) }));
    } else if (dry && share(head, isSunny) >= 0.66 && share(tail, isGray) >= 0.66) {
      out.push(insight('cloudingLater', 'sky', 30, { t: runStart(isGray) }));
    }
  }
  return out;
}

/** Always available: what to say when nothing else is worth saying. */
function calmInsight(frame: Frame): Insight | null {
  const H = frame.hours;
  if (!H.length) return null;
  const hi = maxBy(H, (h) => h.tC);
  const lo = minBy(H, (h) => h.tC);
  if (frame.kind === 'tonight') {
    const clear = H.filter((h) => h.sky === 'clear' || h.sky === 'partly').length / H.length;
    return clear >= 0.7 && !H.some((h) => h.precip)
      ? insight('clearNight', 'calm', 25, { low: temp(lo) })
      : insight('calmNight', 'calm', 10, { low: temp(lo) });
  }
  const day = H.filter((h) => h.isDay);
  const base = day.length ? day : H;
  const sunny = base.filter(isSunny).length / base.length;
  const gray = base.filter(isGray).length / base.length;
  const key: LineKey = sunny >= 0.6 ? 'calmSunny' : gray >= 0.6 ? 'calmCloudy' : 'calmMixed';
  return insight(key, 'calm', 10, { low: temp(lo), high: temp(hi) });
}

// ---------------------------------------------------------------------------
// Extras: sun, moon, stars, calendar
// ---------------------------------------------------------------------------

function extraInsights(frame: Frame, ctx: DetectContext): Insight[] {
  const out: Insight[] = [];
  const { lat, lon, tz, tl } = ctx;
  const H = frame.hours;
  if (!H.length) return out;
  const date = frame.kind === 'tonight' ? addDays(tl.now.date, frame.offset) : H[0].date;
  const md = date.slice(5);
  const day = isDayFrame(frame);

  // --- Sun ---
  if (day) {
    const sun = sunDay(date, lat, lon, tz);
    const isToday = frame.kind === 'today' || frame.kind === 'restOfDay';
    // Weeks-long states, and the lines say "today": first page only.
    if (isToday && sun.polar === 'day') out.push(insight('midnightSun', 'extra', 30));
    if (isToday && sun.polar === 'night') out.push(insight('polarNight', 'extra', 30));

    const ev = seasonEventOn(date, lon);
    if (ev && !sun.polar) {
      const north = lat >= 0;
      const key: LineKey =
        ev === 'juneSolstice' ? (north ? 'longestDay' : 'shortestDay')
        : ev === 'decemberSolstice' ? (north ? 'shortestDay' : 'longestDay')
        : ev === 'marchEquinox' ? (north ? 'springEquinox' : 'autumnEquinox')
        : north ? 'autumnEquinox' : 'springEquinox';
      out.push(insight(key, 'extra', 30, { daylightMin: sun.daylightMin }));
    }

    if (isToday && sun.sunset && sun.sunsetMs && sun.golden) {
      const untilSunset = sun.sunsetMs - ctx.nowMs;
      const atSunset = H.find((h) => h.hour === sun.sunset!.hour);
      if (untilSunset > 30 * 60000 && untilSunset < 5 * 3600000 && atSunset && isSunny(atSunset)) {
        out.push(insight('goldenHour', 'extra', 22, { sunset: hm(sun.sunset), golden: hm(sun.golden) }));
      }
      if (untilSunset > 0 && Math.abs(lat) >= 40) {
        const mins = sun.sunset.hour * 60 + sun.sunset.minute;
        if (mins <= 16 * 60 + 45) out.push(insight('earlySunset', 'extra', 14, { sunset: hm(sun.sunset) }));
        if (mins >= 21 * 60 + 15) out.push(insight('lateSunset', 'extra', 14, { sunset: hm(sun.sunset) }));
      }
    }
    if (frame.kind === 'today' && sun.sunrise && sun.sunriseMs && sun.sunriseMs > ctx.nowMs) {
      const atSunrise = H.find((h) => h.hour === sun.sunrise!.hour);
      if (atSunrise && isSunny(atSunrise)) out.push(insight('sunriseClear', 'extra', 22, { sunrise: hm(sun.sunrise) }));
    }
  }

  // --- Night sky: tonight, or later today for a daytime open ---
  if (frame.kind === 'tonight' || frame.kind === 'today' || frame.kind === 'restOfDay') {
    const evening = frame.kind === 'tonight' ? date : tl.now.date;
    const nightHours = tl.hours.filter(
      (h) => (h.date === evening && h.hour >= 21) || (h.date === addDays(evening, 1) && h.hour <= 2),
    );
    if (nightHours.length >= 3) {
      const clear = nightHours.filter((h) => !h.precip && (h.sky === 'clear' || h.sky === 'partly')).length / nightHours.length;
      const moon = moonNight(evening, lat, lon);
      const shower = meteorShowerOn(evening, lat);
      if (clear >= 0.6) {
        if (shower) out.push(insight('meteors', 'extra', 28, { meteor: shower.key, rate: shower.rate }));
        else if (moon.supermoon) out.push(insight('supermoon', 'extra', 27));
        else if (moon.full) out.push(insight('fullMoon', 'extra', 24));
        else if (moon.newMoon && clear >= 0.75) out.push(insight('newMoonStars', 'extra', 18));
      }
    }
  }

  // --- Calendar ---
  if (md === '12-24' || md === '12-25') {
    const hasSnow = H.some((h) => h.precip && SNOWY.includes(h.precip.type));
    const hi = maxBy(H, (h) => h.tC);
    if (hasSnow) out.push(insight('whiteChristmas', 'extra', 40));
    else if (day && lat >= 30 && hi.tC >= 12) out.push(insight('greenChristmas', 'extra', 25, { high: temp(hi) }));
  }
  if (md === '12-31' && frame.kind !== 'tomorrow' && frame.kind !== 'laterToday') {
    const midnight = tl.hours.find((h) => h.date === addDays(date, 1) && h.hour === 0);
    if (midnight) {
      out.push(
        midnight.precip
          ? insight('nyeWet', 'extra', 35)
          : insight('nyeDry', 'extra', 35, { low: temp(midnight) }),
      );
    }
  }
  if (md === '10-31' && frame.kind !== 'tomorrow' && frame.kind !== 'laterToday') {
    const spooky = H.some((h) => h.hour >= 18 && h.hour <= DAY_END && (h.sky === 'fog' || h.precip || windOf(h) >= 30));
    if (spooky) out.push(insight('halloween', 'extra', 25));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

export interface FrameAnalysis {
  frame: Frame;
  /** Sorted by severity, highest first. */
  insights: Insight[];
  calm: Insight | null;
}

export function analyzeFrame(frame: Frame, ctx: DetectContext): FrameAnalysis {
  const all: (Insight | null)[] = [
    ...precipInsights(frame, ctx),
    ...iceInsights(frame, ctx),
    ...tempInsights(frame, ctx),
    trendInsight(frame, ctx),
    windInsight(frame),
    uvInsight(frame, ctx),
    airInsight(frame, ctx),
    ...skyInsights(frame),
    ...extraInsights(frame, ctx),
  ];
  const insights = all.filter((i): i is Insight => !!i).sort((a, b) => b.severity - a.severity);
  return { frame, insights, calm: calmInsight(frame) };
}

// ---------------------------------------------------------------------------
// Tips
// ---------------------------------------------------------------------------

/** One practical tip for a frame, most urgent first. */
export function pickTip(
  a: FrameAnalysis,
  ctx: DetectContext,
  tomorrowWet: boolean,
  shown: LineKey[] = [],
): TipKey | null {
  const has = (...keys: LineKey[]) => a.insights.some((i) => keys.includes(i.key));
  const H = a.frame.hours;
  const night = a.frame.kind === 'tonight';

  if (has('hurricane', 'storm')) return 'stayIn';
  if (has('gale')) return 'secureObjects';
  if (has('freezingRain', 'blackIce', 'snowHeavy', 'blizzard', 'freezingFog')) return 'extraTime';
  if (has('extremeHeat', 'hot')) return 'hydrate';
  if (has('extremeCold', 'bitterCold')) return 'bundleUp';

  const wetWaking = H.filter(
    (h) => h.precip && h.precip.type !== 'snow' && h.hour >= 7 && h.hour <= DAY_END,
  );
  if (wetWaking.length && !night) {
    const windy = H.some((h) => (h.windKph ?? 0) >= 40 || (h.gustKph ?? 0) >= 60);
    return windy ? 'raincoat' : 'umbrella';
  }

  if (has('snow', 'snowLight', 'nightSnow')) {
    const date = night ? addDays(ctx.tl.now.date, a.frame.offset + 1) : H[0].date;
    return ctx.isWorkday(date) ? 'snowBoots' : 'snowman';
  }
  // The swing line already tells people to dress in layers.
  if (has('bigSwing') && !shown.includes('bigSwing')) return 'layers';
  if (has('uvHigh', 'uvVeryHigh', 'uvExtreme')) return 'sunscreen';
  if (has('frost')) {
    const date = night ? addDays(ctx.tl.now.date, a.frame.offset + 1) : H[0].date;
    const early = night || H[0].hour <= 9;
    if (early && ctx.isWorkday(date)) return 'scrape';
  }
  if (has('freezingDay', 'sunnyButCold')) return 'bundleUp';
  if (has('eveningChill')) return 'jacketEvening';

  const today = a.frame.kind === 'today' || a.frame.kind === 'restOfDay';
  const dry = !H.some((h) => h.precip);
  if (today && dry && tomorrowWet) return 'noCarWash';

  if (!night && dry && H.length >= 6) {
    const sunny = H.filter(isSunny).length / H.length;
    const maxT = Math.max(...H.map((h) => h.tC));
    const wind = Math.max(0, ...H.map((h) => h.windKph ?? 0));
    const avgHum = H.reduce((s, h) => s + h.humidity, 0) / H.length;
    if (sunny >= 0.6 && maxT >= 15 && wind >= 8 && wind <= 35 && avgHum < 70 && a.frame.hours[0].hour <= 12) {
      return 'laundry';
    }
  }

  const evening = H.filter((h) => h.hour >= 19 && h.hour <= 21);
  if (evening.length >= 2 && !evening.some((h) => h.precip)) {
    const avgT = evening.reduce((s, h) => s + h.tC, 0) / evening.length;
    const avgHum = evening.reduce((s, h) => s + h.humidity, 0) / evening.length;
    const month = Number(evening[0].date.slice(5, 7));
    const summer = ctx.lat >= 0 ? month >= 6 && month <= 8 : month === 12 || month <= 2;
    if (avgT >= 22 && avgHum >= 75 && summer) return 'mosquitoes';
    if (avgT >= 20) return 'terrace';
  }
  return null;
}

export { weekdayOf };
