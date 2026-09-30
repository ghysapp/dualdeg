/**
 * Composer: picks what to say (from the detectors) and how (from a phrase
 * bank), and assembles the briefing card.
 *
 * Per section: the strongest insight, a second one from a different family if
 * it's worth it, one practical tip, and — on a calm day — a bit of colour
 * (moon, meteors, a golden sunset). Dangerous weather flips the card to an
 * alert tone: serious greeting, no extras.
 *
 * Variants are chosen by a hash of place + date + part of day, so the text is
 * stable while the weather is (re-renders and reopenings don't reshuffle it),
 * and changes from one day to the next.
 */

import type { Strings } from '@/i18n/translations';
import type { WeatherData } from '@/services/weatherApi';
import type { TempOrder } from '@/state/settings';
import { orderTemp, orderWind } from '@/utils/temperature';

import { analyzeFrame, pickTip, type DetectContext, type FrameAnalysis } from './detect';
import { buildTimeline, framesFor, weekdayOf } from './timeline';
import type {
  Briefing,
  BriefingPage,
  GreetingKey,
  Insight,
  InsightParams,
  PhraseBank,
  TipKey,
} from './types';

const ALERT = 85;

// ---------------------------------------------------------------------------
// Variant picking
// ---------------------------------------------------------------------------

/** FNV-1a, 32-bit. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pick(variants: string[] | undefined, seed: string): string {
  if (!variants?.length) return '';
  return variants[hash(seed) % variants.length];
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

interface Fmt {
  bank: PhraseBank;
  order: TempOrder;
  weekdays: string[];
}

function tempLabel(t: { c: number; f: number }, order: TempOrder): string {
  const o = orderTemp(t.c, t.f, order);
  return `${o.primaryValue}°${o.primaryUnit} / ${o.secondaryValue}°${o.secondaryUnit}`;
}

function fill(template: string, p: InsightParams, fmt: Fmt, extra: Record<string, string> = {}): string {
  const { bank, order } = fmt;
  const values: Record<string, string | undefined> = {
    start: p.start != null ? bank.hour(p.start) : undefined,
    end: p.end != null ? bank.hour(p.end) : undefined,
    t: p.t != null ? bank.hour(p.t) : undefined,
    high: p.high ? tempLabel(p.high, order) : undefined,
    low: p.low ? tempLabel(p.low, order) : undefined,
    feels: p.feels ? tempLabel(p.feels, order) : undefined,
    diff: p.diffC != null ? tempLabel({ c: p.diffC, f: Math.round(p.diffC * 1.8) }, order) : undefined,
    wind: p.windKph != null ? windLabel(p.windKph, order) : undefined,
    uv: p.uv != null ? String(p.uv) : undefined,
    sunrise: p.sunrise ? bank.time(p.sunrise.h, p.sunrise.m) : undefined,
    sunset: p.sunset ? bank.time(p.sunset.h, p.sunset.m) : undefined,
    golden: p.golden ? bank.time(p.golden.h, p.golden.m) : undefined,
    daylight: p.daylightMin != null ? bank.duration(p.daylightMin) : undefined,
    name: p.meteor ? bank.meteorNames[p.meteor] : undefined,
    rate: p.rate != null ? String(p.rate) : undefined,
    ...extra,
  };
  return template
    .replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function windLabel(kph: number, order: TempOrder): string {
  const w = orderWind(kph, order);
  return `${w.primaryValue} ${w.primaryUnit} / ${w.secondaryValue} ${w.secondaryUnit}`;
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

function greetingKey(date: string, hour: number, weekend: number[], alert: boolean): GreetingKey {
  if (alert) return 'alert';
  const md = date.slice(5);
  const wd = weekdayOf(date);
  const daytime = hour >= 5 && hour < 22;

  if (daytime) {
    if (md === '01-01') return 'newYear';
    if (md === '12-31') return 'newYearsEve';
    if (md === '12-24' || md === '12-25') return 'christmas';
    if (md === '10-31') return 'halloween';
    if (md === '04-01' && hour < 14) return 'aprilFools';
    if (md === '02-14') return 'valentine';
    if (wd === 5 && md.endsWith('-13')) return 'friday13';
  }
  if (hour < 4) return 'nightOwl';
  if (hour < 7) return 'earlyBird';

  const inWeekend = (d: number) => weekend.includes(d);
  const firstWeekend = weekend.find((d) => !inWeekend((d + 6) % 7)) ?? 6;
  const lastWeekend = weekend.find((d) => !inWeekend((d + 1) % 7)) ?? 0;
  const firstWorkday = (lastWeekend + 1) % 7;
  const lastWorkday = (firstWeekend + 6) % 7;
  const midweek = (firstWorkday + 2) % 7;

  if (wd === firstWorkday && hour < 12) return 'firstWorkday';
  if (wd === lastWorkday) return hour >= 17 ? 'lastWorkdayEvening' : 'lastWorkday';
  if (wd === lastWeekend && hour >= 17) return 'weekendEnd';
  if (inWeekend(wd) && hour < 17) return 'weekend';
  if (wd === midweek && hour < 17) return 'midweek';

  if (hour < 12) return 'morning';
  if (hour < 14) return 'midday';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'late';
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/** Strongest insight per family, strongest first. */
function topPerFamily(insights: Insight[]): Insight[] {
  const seen = new Set<string>();
  const out: Insight[] = [];
  for (const i of insights) {
    if (i.family === 'extra' || seen.has(i.family)) continue;
    seen.add(i.family);
    out.push(i);
  }
  return out;
}

interface SectionPlan {
  insights: Insight[];
  tip: TipKey | null;
}

/** Families that describe the weather itself (as opposed to air, UV, extras). */
const WEATHER_FAMILIES = new Set([
  'precip', 'thunder', 'downpour', 'ice', 'fog', 'sky', 'temp', 'heat', 'cold', 'wind', 'trend',
]);

function planSection(
  insights: Insight[],
  calm: Insight | null,
  tip: TipKey | null,
  alert: boolean,
  compact: boolean,
): SectionPlan {
  const ranked = topPerFamily(insights).filter((i) => i.severity >= 30);
  const picked: Insight[] = [];

  if (ranked.length) {
    picked.push(ranked[0]);
    // In an alert, only things that matter as much sit beside the warning.
    const second = ranked[1];
    const secondMin = alert ? 70 : compact ? 55 : 40;
    if (second && second.severity >= secondMin) picked.push(second);
    const third = ranked[2];
    if (!compact && third && third.severity >= 70) picked.push(third);
  }
  // Air or UV alone doesn't describe the day: lead with what the sky does.
  if (calm && !picked.some((i) => WEATHER_FAMILIES.has(i.family))) picked.unshift(calm);

  // Colour on quiet days; big-calendar extras (meteors, solstice…) even if
  // there's already one line.
  if (!alert) {
    const extra = insights.find((i) => i.family === 'extra');
    if (extra && (picked.length < 2 || extra.severity >= 28) && picked.length < 3) picked.push(extra);
  }
  return { insights: picked, tip };
}

/**
 * Tonight's frost is tomorrow morning's frost, and snow that starts tonight
 * isn't news again at 6 am: when the first page covers the night, the second
 * doesn't repeat what carries straight over into its morning.
 */
function withoutCarryOver(b: FrameAnalysis, shown: Insight[]): Insight[] {
  const families = new Set(shown.map((i) => i.family));
  const firstHour = b.frame.hours[0]?.hour;
  return b.insights.filter((i) => {
    if ((i.family === 'ice' || i.family === 'fog') && families.has(i.family)) return false;
    if ((i.family === 'precip' || i.family === 'thunder') && families.has(i.family) && i.params.start === firstHour) {
      return false;
    }
    return true;
  });
}

function renderPage(
  label: string,
  heading: string,
  tone: BriefingPage['tone'],
  plan: SectionPlan,
  fmt: Fmt,
  seedBase: string,
): BriefingPage {
  const lines = plan.insights.map((i) => fill(pick(fmt.bank.lines[i.key], `${seedBase}|${i.key}`), i.params, fmt));
  const tip = plan.tip ? fill(pick(fmt.bank.tips[plan.tip], `${seedBase}|tip:${plan.tip}`), {}, fmt) : '';
  return { label, heading, tone, lines: lines.filter(Boolean), tip: tip || undefined };
}

/** "samedi" → "Samedi"; scripts without case are left alone. */
function capitalize(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s;
}

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

export interface ComposeOptions {
  bank: PhraseBank;
  strings: Pick<Strings, 'weekdays'>;
  order: TempOrder;
  nowMs?: number;
}

/**
 * Two pages at most: what's left of today (or tonight), then the next day in
 * full — tomorrow, or after midnight the day that starts when the user wakes.
 */
export function composeBriefing(data: WeatherData, opts: ComposeOptions): Briefing | null {
  const { bank, order } = opts;
  const nowMs = opts.nowMs ?? Date.now();
  const tl = buildTimeline(data, nowMs);
  if (tl.hours.length < 3) return null;

  const weekend = bank.weekend ?? [0, 6];
  const ctx: DetectContext = {
    data,
    tl,
    lat: data.location.lat,
    lon: data.location.lon,
    tz: data.location.tzId,
    nowMs,
    isWorkday: (date) => !weekend.includes(weekdayOf(date)),
  };
  const fmt: Fmt = { bank, order, weekdays: opts.strings.weekdays };

  const { primary, secondary } = framesFor(tl);
  const A = analyzeFrame(primary, ctx);
  const B = secondary && secondary.hours.length >= 4 ? analyzeFrame(secondary, ctx) : null;

  const part = tl.now.hour < 12 ? 'am' : tl.now.hour < 18 ? 'pm' : 'night';
  const seedBase = `${data.location.lat.toFixed(1)},${data.location.lon.toFixed(1)}|${tl.now.date}|${part}`;

  // --- Page 1: today / tonight ---
  const alertA = (A.insights[0]?.severity ?? 0) >= ALERT;
  const tomorrowWet =
    !!B &&
    B.frame.kind === 'tomorrow' &&
    B.frame.hours.filter((h) => h.precip?.likely && h.precip.type !== 'snow').length >= 3;
  const planA = planSection(A.insights, A.calm, null, alertA, false);
  planA.tip = pickTip(A, ctx, tomorrowWet, planA.insights.map((i) => i.key));

  const gKey = greetingKey(tl.now.date, tl.now.hour, weekend, alertA);
  const greeting = fill(pick(bank.greetings[gKey], `${seedBase}|g:${gKey}`), {}, fmt, {
    day: fmt.weekdays[weekdayOf(tl.now.date)] ?? '',
  });
  // The tab stays short: "Today" also covers "the rest of the day".
  const labelA = primary.kind === 'tonight' ? bank.labels.tonight : bank.labels.today;
  const pages: BriefingPage[] = [
    renderPage(labelA, greeting, alertA ? 'alert' : 'normal', planA, fmt, `${seedBase}|A`),
  ];

  // --- Page 2: the next day, in full ---
  if (B) {
    const insights = primary.kind === 'tonight' ? withoutCarryOver(B, planA.insights) : B.insights;
    const alertB = (insights[0]?.severity ?? 0) >= ALERT;
    const planB = planSection(insights, B.calm, null, alertB, false);
    planB.tip = pickTip({ ...B, insights }, ctx, false, planB.insights.map((i) => i.key));
    const date = B.frame.hours[0].date;
    const heading = capitalize(fmt.weekdays[weekdayOf(date)] ?? '');
    if (planB.insights.length) {
      pages.push(
        renderPage(B.frame.kind === 'laterToday' ? bank.labels.laterToday : bank.labels.tomorrow, heading, alertB ? 'alert' : 'normal', planB, fmt, `${seedBase}|B`),
      );
    }
  }

  return { title: bank.title, pages };
}
