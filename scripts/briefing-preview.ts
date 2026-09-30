/**
 * Preview the daily briefing for 20 synthetic situations (rain windows, frost,
 * blizzard, storms, meteor showers, New Year…) in any language:
 *
 *   npx tsx --tsconfig tsconfig.json scripts/briefing-preview.ts fr
 */
import { composeBriefing, phraseBankFor } from '@/briefing';
import { TRANSLATIONS, type LanguageCode } from '@/i18n/translations';
import type { HourForecast, WeatherData } from '@/services/weatherApi';

type H = Partial<HourForecast> & { c?: number };
interface Scn {
  name: string;
  now: string; // local ISO "2026-09-29T07:10" in tz
  tz?: string;
  lat?: number;
  lon?: number;
  hour: (h: number, dayOffset: number) => H;
  todayMax?: number;
  uvClearSky?: boolean;
  aq?: number;
}

function tzOffsetMs(tz: string, utcMs: number): number {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const p = Object.fromEntries(f.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return asUtc - utcMs;
}
function localToUtc(iso: string, tz: string): number {
  const guess = Date.parse(iso + ':00Z');
  return guess - tzOffsetMs(tz, guess);
}

function build(s: Scn): { data: WeatherData; nowMs: number } {
  const tz = s.tz ?? 'UTC';
  const nowMs = localToUtc(s.now, tz);
  const date = s.now.slice(0, 10);
  const startMs = localToUtc(`${date}T00:00`, tz);
  const all: HourForecast[] = [];
  for (let i = 0; i < 72; i++) {
    const ms = startMs + i * 3600_000;
    const off = Math.floor(i / 24);
    const hr = i % 24;
    const x = s.hour(hr, off);
    const c = x.tempC ?? x.c ?? 15;
    const fl = x.feelsLikeC ?? c;
    all.push({
      timeEpoch: ms / 1000,
      hour24: hr,
      isNow: false,
      tempC: c,
      tempF: Math.round(c * 1.8 + 32),
      feelsLikeC: fl,
      feelsLikeF: Math.round(fl * 1.8 + 32),
      humidity: x.humidity ?? 60,
      conditionCode: x.conditionCode ?? 1003,
      isDay: x.isDay ?? (hr >= 7 && hr <= 19),
      chanceOfRain: x.chanceOfRain ?? 0,
      uv: x.uv,
      windKph: x.windKph ?? 10,
      gustKph: x.gustKph,
      precipMm: x.precipMm,
    });
  }
  const nowIdx = all.findIndex((h) => (h.timeEpoch + 3600) * 1000 > nowMs);
  const hours = all.slice(nowIdx, nowIdx + 24);
  const today = all.slice(0, 24);
  const days = [1, 2].map((d) => ({
    dateEpoch: 0, weekdayIndex: 0, isTomorrow: d === 1,
    maxTempC: 0, maxTempF: 0, minTempC: 0, minTempF: 0, chanceOfRain: 0, conditionCode: 1000,
    hours: all.slice(d * 24, d * 24 + 24),
  }));
  const maxC = s.todayMax ?? Math.max(...today.map((h) => h.tempC));
  const data: WeatherData = {
    location: { name: 'X', region: '', country: '', lat: s.lat ?? 50.8, lon: s.lon ?? 0, tzId: tz, localtimeEpoch: nowMs / 1000, localtime: s.now.replace('T', ' ') },
    current: { tempC: 0, tempF: 0, conditionText: '', conditionCode: 1000, isDay: true, feelsLikeC: 0, feelsLikeF: 0, humidity: 50, windKph: 0, windDir: '', precipMm: 0 },
    today: { maxTempC: maxC, maxTempF: Math.round(maxC * 1.8 + 32), minTempC: 0, minTempF: 0, chanceOfRain: 0, precipMm: 0, sunrise: '', sunset: '', moonPhase: '', moonIllumination: 0, uvClearSky: s.uvClearSky },
    hours,
    days,
    airQuality: s.aq ? { band: s.aq, source: 'test' } : undefined,
  };
  return { data, nowMs };
}

// temperature curve: min at 6, max at 15
const curve = (lo: number, hi: number) => (h: number) => {
  const x = h <= 6 ? 0 : h <= 15 ? (h - 6) / 9 : Math.max(0, 1 - (h - 15) / 15);
  return Math.round(lo + (hi - lo) * Math.sin((x * Math.PI) / 2));
};

const scenarios: Scn[] = [
  {
    name: '1. Tue 07:10 — dry until 14h, then showers; 7→21',
    now: '2026-09-29T07:10',
    hour: (h, d) => ({ c: d === 0 ? curve(7, 21)(h) : curve(10, 17)(h), conditionCode: d === 0 && h >= 14 ? 1183 : 1003, chanceOfRain: d === 0 && h >= 14 ? 80 : 5, uv: h >= 10 && h <= 15 ? 4 : 0 }),
  },
  {
    name: '2. Mon 06:40 — rain at commute 7–9',
    now: '2026-09-28T06:40',
    hour: (h, d) => ({ c: curve(10, 16)(h), conditionCode: d === 0 && h >= 7 && h <= 9 ? 1189 : 1006, chanceOfRain: d === 0 && h >= 7 && h <= 9 ? 85 : 10 }),
  },
  {
    name: '3. Fri 15:20 — warm & sunny, terrace evening',
    now: '2026-10-02T15:20',
    hour: (h) => ({ c: h >= 19 && h <= 21 ? 23 : curve(16, 28)(h), conditionCode: 1000, humidity: 45, uv: h >= 11 && h <= 15 ? 5 : 0 }),
  },
  {
    name: '4. Tue 20:30 — clear night, frost by dawn; tomorrow sunny & cold',
    now: '2026-12-01T20:30',
    hour: (h, d) => ({ c: d === 0 ? 3 - Math.max(0, h - 18) * 0.5 : h < 8 ? -3 : curve(-3, 4)(h), conditionCode: 1000, humidity: 70 }),
  },
  {
    name: '5. Thu 08:05 — blizzard 10–16',
    now: '2027-01-14T08:05',
    hour: (h, d) => ({ c: -3, feelsLikeC: -10, conditionCode: d === 0 && h >= 10 && h <= 16 ? 1225 : 1009, chanceOfRain: 0, windKph: d === 0 && h >= 10 && h <= 16 ? 60 : 20, gustKph: d === 0 && h >= 10 && h <= 16 ? 85 : 30 }),
  },
  {
    name: '6. Wed 12:30 — hot 36 felt + thunder 17–19',
    now: '2027-07-14T12:30',
    lat: 44,
    hour: (h, d) => ({ c: curve(22, 34)(h), feelsLikeC: curve(22, 37)(h), humidity: 45, conditionCode: d === 0 && h >= 17 && h <= 18 ? 1276 : 1000, chanceOfRain: d === 0 && h >= 17 && h <= 18 ? 70 : 0, uv: h >= 11 && h <= 15 ? 9 : 2 }),
  },
  {
    name: '7. Sat 09:00 — storm gusts 120',
    now: '2026-10-03T09:00',
    hour: (h, d) => ({ c: 12, conditionCode: 1189, chanceOfRain: 90, windKph: d === 0 && h >= 12 && h <= 20 ? 75 : 30, gustKph: d === 0 && h >= 12 && h <= 20 ? 120 : 50 }),
  },
  {
    name: '8. Wed 02:15 — night owl, rain until 4',
    now: '2026-09-30T02:15',
    hour: (h, d) => ({ c: curve(9, 17)(h), conditionCode: d === 0 && h <= 3 ? 1183 : 1003, chanceOfRain: d === 0 && h <= 3 ? 80 : 5 }),
  },
  {
    name: '9. Thu 18:30 Dec 31 — dry NYE',
    now: '2026-12-31T18:30',
    hour: () => ({ c: 2, conditionCode: 1003 }),
  },
  {
    name: '10. Wed 07:30 Aug 12 — perfect day, Perseids tonight',
    now: '2026-08-12T07:30',
    lat: 48,
    hour: (h) => ({ c: curve(14, 25)(h), conditionCode: 1000, humidity: 45, windKph: 12, uv: h >= 11 && h <= 15 ? 5 : 1 }),
  },
  {
    name: '11. Sun 10:00 Jun 21 Tromsø — midnight sun, solstice',
    now: '2026-06-21T10:00',
    tz: 'Europe/Oslo',
    lat: 69.65,
    lon: 18.96,
    hour: (h) => ({ c: curve(8, 14)(h), conditionCode: 1003, isDay: true }),
  },
  {
    name: '12. Tue 06:30 — freezing rain 7–10',
    now: '2027-01-12T06:30',
    hour: (h, d) => ({ c: -2, conditionCode: d === 0 && h >= 7 && h <= 10 ? 1201 : 1009, chanceOfRain: d === 0 && h >= 7 && h <= 10 ? 75 : 0 }),
  },
  {
    name: '13. Thu 07:00 — fog until 10 (workday)',
    now: '2026-10-08T07:00',
    hour: (h) => ({ c: curve(6, 15)(h), conditionCode: h <= 9 ? 1135 : 1003, humidity: 95 }),
  },
  {
    name: '14. Sat 09:10 — on-and-off showers, breezy',
    now: '2026-10-03T09:10',
    hour: (h, d) => ({ c: curve(9, 14)(h), conditionCode: d === 0 && [10, 11, 14, 17, 18].includes(h) ? 1240 : 1003, chanceOfRain: d === 0 && [10, 11, 14, 17, 18].includes(h) ? 65 : 20, windKph: 30, gustKph: 52 }),
  },
  {
    name: '15. Tue 10:00 — nice today, tomorrow 9° colder + rain',
    now: '2026-09-29T10:00',
    hour: (h, d) => ({ c: d === 0 ? curve(12, 22)(h) : curve(7, 13)(h), conditionCode: d === 1 && h >= 8 ? 1189 : 1003, chanceOfRain: d === 1 && h >= 8 ? 85 : 5 }),
  },
  {
    name: '16. Tue 16:00 — cools fast, 22 now → 12 at 21h (desert)',
    now: '2026-09-29T16:00',
    lat: 36,
    hour: (h, d) => ({ c: d === 0 && h >= 16 ? 22 - (h - 16) * 2 : curve(8, 23)(h), conditionCode: 1000, humidity: 20, uv: h >= 11 && h <= 15 ? 7 : 1 }),
  },
  {
    name: '17. Mon 07:30 — gray all day, drizzle 11–13',
    now: '2026-09-28T07:30',
    hour: (h, d) => ({ c: curve(11, 15)(h), conditionCode: d === 0 && h >= 11 && h <= 12 ? 1153 : 1009, chanceOfRain: d === 0 && h >= 11 && h <= 12 ? 60 : 10 }),
  },
  {
    name: '18. Fri 19:00 Dec 24 — snow tonight, Christmas',
    now: '2026-12-24T19:00',
    hour: (h, d) => ({ c: -1, conditionCode: (d === 0 && h >= 21) || (d === 1 && h <= 6) ? 1219 : 1009, chanceOfRain: 0 }),
  },
  {
    name: '19. Wed 14:00 — poor air, calm',
    now: '2026-09-30T14:00',
    aq: 4,
    hour: (h) => ({ c: curve(12, 19)(h), conditionCode: 1006 }),
  },
  {
    name: '20. Tue 07:00 — hurricane force',
    now: '2026-09-29T07:00',
    lat: 25,
    lon: -80,
    hour: (h, d) => ({ c: 27, conditionCode: 1195, chanceOfRain: 95, windKph: d === 0 && h >= 12 ? 130 : 60, gustKph: d === 0 && h >= 12 ? 170 : 90 }),
  },
];

const lang = (process.argv[2] ?? 'en') as LanguageCode;
for (const s of scenarios) {
  const { data, nowMs } = build(s);
  const b = composeBriefing(data, { bank: phraseBankFor(lang), strings: TRANSLATIONS[lang], order: 'CF', nowMs });
  console.log(`\n=== ${s.name}`);
  if (!b) { console.log('(null)'); continue; }
  for (const p of b.pages) {
    console.log(`  [${p.label}] ${p.tone === 'alert' ? '⚠️  ' : ''}${p.heading}`);
    for (const l of p.lines) console.log(`   • ${l}`);
    if (p.tip) console.log(`   💡 ${p.tip}`);
  }
}
