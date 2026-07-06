/**
 * Germany via Bright Sky (brightsky.dev) — a free, no-key JSON API over
 * Deutscher Wetterdienst (DWD) open data. Normalized into {@link WeatherData}.
 *
 * Bright Sky returns hourly data by lat/lon (no native daily / astronomy), so
 * daily min/max is aggregated from the hourly series, feels-like is computed,
 * astronomy comes from suncalc, and conditions are localized in-app from the
 * Dark-Sky-style icon. Germany is a single timezone (Europe/Berlin), which we
 * pass to the API so timestamps come back local.
 */

import { BRIGHTSKY_API_BASE } from '@/config';
import { conditionFromBrightSky, conditionText } from '@/i18n/conditions';
import type { LanguageCode } from '@/i18n/translations';
import { computeAstro } from '@/services/astronomy';
import {
  WeatherApiError,
  type DayForecast,
  type HourForecast,
  type WeatherData,
} from '@/services/weatherApi';
import { localNow } from '@/utils/tz';
import { cToF, degToCompass, feelsLikeC } from '@/utils/units';

const TZ = 'Europe/Berlin';

function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function weekdayIndexOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function iconIsDay(icon: string | undefined, hour24: number): boolean {
  if (icon?.endsWith('-day')) return true;
  if (icon?.endsWith('-night')) return false;
  return hour24 >= 7 && hour24 < 20;
}

async function brightsky<T = any>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new WeatherApiError('Network error — check your connection.');
  }
  if (!res.ok) throw new WeatherApiError(`Bright Sky request failed (${res.status}).`);
  return (await res.json()) as T;
}

export async function fetchDwdForecast(
  lat: number,
  lon: number,
  language: LanguageCode,
): Promise<WeatherData> {
  const localtime = localNow(TZ);
  const todayDate = localtime.slice(0, 10);
  const url =
    `${BRIGHTSKY_API_BASE}/weather?lat=${lat}&lon=${lon}` +
    `&date=${todayDate}&last_date=${addDays(todayDate, 3)}&tz=${encodeURIComponent(TZ)}`;
  const data = await brightsky(url);

  const all: any[] = Array.isArray(data.weather) ? data.weather : [];
  const name: string = String(data.sources?.[0]?.station_name ?? 'Current location').split(/[-,]/)[0].trim();
  const now = Date.now();

  const chanceOf = (h: any): number =>
    h.precipitation_probability ?? h.precipitation_probability_6h ?? 0;

  // --- Hourly (current hour onward, 24). Timestamps are local (tz param). ---
  const future = all.filter((h) => Date.parse(h.timestamp) + 3600_000 > now);
  const slice = (future.length ? future : all).slice(0, 24);

  const hours: HourForecast[] = slice.map((h, i) => {
    const hour24 = Number(String(h.timestamp).slice(11, 13));
    const isDay = iconIsDay(h.icon, hour24);
    const tC = h.temperature ?? 0;
    const humidity = h.relative_humidity ?? 0;
    const windKph = h.wind_speed ?? 0;
    const flC = feelsLikeC(tC, humidity, windKph);
    return {
      timeEpoch: Math.floor(Date.parse(h.timestamp) / 1000),
      hour24,
      isNow: i === 0,
      tempC: Math.round(tC),
      tempF: Math.round(cToF(tC)),
      feelsLikeC: Math.round(flC),
      feelsLikeF: Math.round(cToF(flC)),
      humidity,
      conditionCode: conditionFromBrightSky(h.icon, h.condition).code,
      isDay,
      chanceOfRain: chanceOf(h),
    };
  });

  // --- Group by local date for daily + today aggregates ---
  const byDate = new Map<string, any[]>();
  for (const h of all) {
    const day = String(h.timestamp).slice(0, 10);
    (byDate.get(day) ?? byDate.set(day, []).get(day)!).push(h);
  }
  const aggregate = (list: any[]) => {
    const temps = list.map((h) => h.temperature).filter((v) => v != null) as number[];
    const noon = list.find((h) => String(h.timestamp).slice(11, 13) === '12') ?? list[Math.floor(list.length / 2)] ?? list[0];
    return {
      hi: temps.length ? Math.max(...temps) : 0,
      lo: temps.length ? Math.min(...temps) : 0,
      pop: Math.max(0, ...list.map(chanceOf)),
      precip: list.reduce((s, h) => s + (h.precipitation ?? 0), 0),
      code: conditionFromBrightSky(noon?.icon, noon?.condition).code,
    };
  };

  const futureDays = [...byDate.keys()].filter((d) => d > todayDate).sort();
  const days: DayForecast[] = futureDays.slice(0, 2).map((d, i) => {
    const a = aggregate(byDate.get(d)!);
    return {
      dateEpoch: Math.floor(new Date(`${d}T12:00:00Z`).getTime() / 1000),
      weekdayIndex: weekdayIndexOf(d),
      isTomorrow: i === 0,
      maxTempC: Math.round(a.hi),
      maxTempF: Math.round(cToF(a.hi)),
      minTempC: Math.round(a.lo),
      minTempF: Math.round(cToF(a.lo)),
      chanceOfRain: a.pop,
      conditionCode: a.code,
    };
  });

  const todayAgg = aggregate(byDate.get(todayDate) ?? slice);
  const astro = computeAstro(lat, lon, TZ);

  // --- Current (from the first/now hour) ---
  const h0 = slice[0] ?? {};
  const curHour = Number(String(h0.timestamp ?? '').slice(11, 13));
  const curIsDay = iconIsDay(h0.icon, Number.isFinite(curHour) ? curHour : 12);
  const curCond = conditionFromBrightSky(h0.icon, h0.condition);
  const curTc = h0.temperature ?? 0;
  const curHum = h0.relative_humidity ?? 0;
  const curWind = h0.wind_speed ?? 0;
  const curFlC = feelsLikeC(curTc, curHum, curWind);

  return {
    location: {
      name,
      region: '',
      country: 'Germany',
      lat,
      lon,
      tzId: TZ,
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
      humidity: curHum,
      windKph: Math.round(curWind),
      windDir: degToCompass(h0.wind_direction),
      precipMm: h0.precipitation ?? 0,
    },
    today: {
      maxTempC: Math.round(todayAgg.hi),
      maxTempF: Math.round(cToF(todayAgg.hi)),
      minTempC: Math.round(todayAgg.lo),
      minTempF: Math.round(cToF(todayAgg.lo)),
      chanceOfRain: todayAgg.pop,
      precipMm: Math.round(todayAgg.precip * 10) / 10,
      sunrise: astro.sunrise,
      sunset: astro.sunset,
      moonPhase: astro.moonPhase,
      moonIllumination: astro.moonIllumination,
    },
    hours,
    days,
  };
}
