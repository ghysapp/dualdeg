/**
 * Météo-France client, normalized into the same {@link WeatherData} model as
 * the other providers. Uses the public mobile-app forecast API
 * (webservice.meteofrance.com/forecast?lat=&lon=&token=) — lat/lon direct, with
 * hourly + daily + a "windchill" feels-like. Astronomy is computed locally
 * (suncalc) for moon phase; condition text is localized in-app from the MF icon.
 */

import { MAX_FUTURE_DAYS, METEOFRANCE_API_BASE, METEOFRANCE_TOKEN } from '@/config';
import { conditionFromMeteoFrance, conditionText } from '@/i18n/conditions';
import type { LanguageCode } from '@/i18n/translations';
import { computeAstro } from '@/services/astronomy';
import {
  summarizeDayHours,
  WeatherApiError,
  type DayForecast,
  type HourForecast,
  type WeatherData,
} from '@/services/weatherApi';
import { dateInTz, hourInTz, localNow } from '@/utils/tz';
import { cToF, degToCompass } from '@/utils/units';

function weekdayIndexOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function iconIsDay(icon: string | undefined, epochMs: number, tz: string): boolean {
  if (icon) return !/n$/i.test(icon);
  const h = hourInTz(epochMs, tz);
  return h >= 7 && h < 20;
}

async function mf<T = any>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new WeatherApiError('Network error — check your connection.');
  }
  if (!res.ok) throw new WeatherApiError(`Météo-France request failed (${res.status}).`);
  return (await res.json()) as T;
}

export async function fetchMeteoFranceForecast(
  lat: number,
  lon: number,
  language: LanguageCode,
): Promise<WeatherData> {
  const url =
    `${METEOFRANCE_API_BASE}/forecast?lat=${lat}&lon=${lon}` +
    `&lang=en&token=${encodeURIComponent(METEOFRANCE_TOKEN)}`;
  const data = await mf(url);

  const pos = data.position ?? {};
  const tz: string = pos.timezone || 'Europe/Paris';
  const name: string = String(pos.name ?? 'Current location').split('—')[0].trim();

  const hourly: any[] = Array.isArray(data.forecast) ? data.forecast : [];
  const daily: any[] = Array.isArray(data.daily_forecast) ? data.daily_forecast : [];

  // Rain probability series (coarse, 3h/6h) → step function lookup by epoch.
  const probs = (Array.isArray(data.probability_forecast) ? data.probability_forecast : [])
    .map((p: any) => ({ dt: p.dt as number, v: (p.rain?.['3h'] ?? p.rain?.['6h'] ?? 0) as number }))
    .sort((a: any, b: any) => a.dt - b.dt);
  const probAt = (dt: number): number => {
    let v = 0;
    for (const p of probs) {
      if (p.dt <= dt) v = p.v ?? 0;
      else break;
    }
    return v;
  };
  const probForDay = (day: string): number => {
    let m = 0;
    for (const p of probs) if (dateInTz(p.dt * 1000, tz) === day) m = Math.max(m, p.v ?? 0);
    return m;
  };

  const localtime = localNow(tz);
  const todayDate = localtime.slice(0, 10);
  const now = Date.now();

  const toHour = (e: any, isNow: boolean): HourForecast => {
    const ms = e.dt * 1000;
    const isDay = iconIsDay(e.weather?.icon, ms, tz);
    const tC = e.T?.value ?? 0;
    const flC = e.T?.windchill ?? tC;
    return {
      timeEpoch: e.dt,
      hour24: hourInTz(ms, tz),
      isNow,
      tempC: Math.round(tC),
      tempF: Math.round(cToF(tC)),
      feelsLikeC: Math.round(flC),
      feelsLikeF: Math.round(cToF(flC)),
      humidity: e.humidity ?? 0,
      conditionCode: conditionFromMeteoFrance(e.weather?.icon, e.weather?.desc, isDay).code,
      isDay,
      chanceOfRain: probAt(e.dt),
    };
  };

  // --- Hourly (current hour onward, 24) ---
  const future = hourly.filter((e) => (e.dt + 3600) * 1000 > now);
  const slice = (future.length ? future : hourly).slice(0, 24);

  const hours: HourForecast[] = slice.map((e, i) => toHour(e, i === 0));

  // Hourly entries grouped by local date, for each future day's breakdown.
  const hoursByDate = new Map<string, any[]>();
  for (const e of hourly) {
    const day = dateInTz(e.dt * 1000, tz);
    (hoursByDate.get(day) ?? hoursByDate.set(day, []).get(day)!).push(e);
  }

  // --- Daily (next N days) ---
  const days: DayForecast[] = daily.slice(1, 1 + MAX_FUTURE_DAYS).map((d, i) => {
    const day = dateInTz(d.dt * 1000, tz);
    const hi = d.T?.max ?? d.T?.min ?? 0;
    const lo = d.T?.min ?? d.T?.max ?? 0;
    const cond = conditionFromMeteoFrance(d.weather12H?.icon, d.weather12H?.desc, true);
    const dayHours = (hoursByDate.get(day) ?? []).map((e) => toHour(e, false));
    const summary = summarizeDayHours(dayHours);
    const windiest = dayHours.length
      ? (hoursByDate.get(day) ?? []).reduce(
          (x, y) => ((y.wind?.speed ?? 0) > (x.wind?.speed ?? 0) ? y : x),
          (hoursByDate.get(day) ?? [])[0],
        )
      : undefined;
    const humAvg =
      d.humidity?.min != null && d.humidity?.max != null
        ? Math.round((d.humidity.min + d.humidity.max) / 2)
        : summary.avgHumidity;
    const astro = computeAstro(lat, lon, tz, new Date(`${day}T12:00:00Z`));
    return {
      // Noon UTC of the local date — uniform anchor across providers.
      dateEpoch: Math.floor(new Date(`${day}T12:00:00Z`).getTime() / 1000),
      weekdayIndex: weekdayIndexOf(day),
      isTomorrow: i === 0,
      maxTempC: Math.round(hi),
      maxTempF: Math.round(cToF(hi)),
      minTempC: Math.round(lo),
      minTempF: Math.round(cToF(lo)),
      chanceOfRain: probForDay(day),
      conditionCode: cond.code,
      conditionText: conditionText(cond.key, language),
      feelsLikeC: summary.feelsLikeC,
      feelsLikeF: summary.feelsLikeF,
      avgHumidity: humAvg,
      maxWindKph: windiest ? Math.round(windiest.wind?.speed ?? 0) || undefined : undefined,
      windDir: windiest ? degToCompass(windiest.wind?.direction) : undefined,
      totalPrecipMm: d.precipitation?.['24h'],
      uv: d.uv,
      sunrise: astro.sunrise,
      sunset: astro.sunset,
      moonPhase: astro.moonPhase,
      moonIllumination: astro.moonIllumination,
      hours: dayHours,
    };
  });

  // --- Today ---
  const today = daily[0] ?? {};
  const hiC = today.T?.max ?? hours[0]?.tempC ?? 0;
  const loC = today.T?.min ?? hiC;
  const astro = computeAstro(lat, lon, tz);

  // --- Current (from the first/now hourly period) ---
  const h0 = slice[0] ?? {};
  const curIsDay = iconIsDay(h0.weather?.icon, (h0.dt ?? now / 1000) * 1000, tz);
  const curCond = conditionFromMeteoFrance(h0.weather?.icon, h0.weather?.desc, curIsDay);
  const curTc = h0.T?.value ?? 0;
  const curFlC = h0.T?.windchill ?? curTc;

  return {
    location: {
      name,
      region: '',
      country: 'France',
      lat: pos.lat ?? lat,
      lon: pos.lon ?? lon,
      tzId: tz,
      localtimeEpoch: Math.floor(now / 1000),
      localtime,
    },
    current: {
      tempC: Math.round(curTc),
      tempF: Math.round(cToF(curTc)),
      conditionText: conditionText(curCond.key, language),
      conditionCode: curCond.code,
      isDay: curIsDay,
      feelsLikeC: Math.round(curFlC),
      feelsLikeF: Math.round(cToF(curFlC)),
      humidity: h0.humidity ?? 0,
      windKph: Math.round(h0.wind?.speed ?? 0),
      windDir: degToCompass(h0.wind?.direction),
      precipMm: h0.rain?.['1h'] ?? 0,
    },
    today: {
      maxTempC: Math.round(hiC),
      maxTempF: Math.round(cToF(hiC)),
      minTempC: Math.round(loC),
      minTempF: Math.round(cToF(loC)),
      chanceOfRain: probForDay(todayDate),
      precipMm: today.precipitation?.['24h'] ?? 0,
      sunrise: astro.sunrise,
      sunset: astro.sunset,
      moonPhase: astro.moonPhase,
      moonIllumination: astro.moonIllumination,
    },
    hours,
    days,
  };
}
