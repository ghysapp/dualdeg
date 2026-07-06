/**
 * MET Norway (api.met.no) client — free, official, no key, global. Normalized
 * into {@link WeatherData}. Used for single-timezone countries so the tz can be
 * passed in (met.no returns UTC and no timezone).
 *
 * Locationforecast "complete" gives hourly instant details + next_1_hours
 * (symbol + precip amount + probability). Daily min/max is aggregated from the
 * hourly series; feels-like is computed; astronomy comes from suncalc; the place
 * name (met.no returns none) is passed in for saved cities.
 */

import { METNO_API_BASE, METNO_USER_AGENT } from '@/config';
import { conditionFromMetNo, conditionText } from '@/i18n/conditions';
import type { LanguageCode } from '@/i18n/translations';
import { computeAstro } from '@/services/astronomy';
import {
  WeatherApiError,
  type DayForecast,
  type HourForecast,
  type WeatherData,
} from '@/services/weatherApi';
import { dateInTz, hourInTz, localNow } from '@/utils/tz';
import { cToF, degToCompass, feelsLikeC } from '@/utils/units';

const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

function weekdayIndexOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function symbolIsDay(symbol: string | undefined, hour24: number): boolean {
  if (symbol?.endsWith('_day')) return true;
  if (symbol?.endsWith('_night')) return false;
  return hour24 >= 7 && hour24 < 20;
}

const symbolOf = (e: any): string | undefined =>
  e?.data?.next_1_hours?.summary?.symbol_code ?? e?.data?.next_6_hours?.summary?.symbol_code;
const precipOf = (e: any): number =>
  e?.data?.next_1_hours?.details?.precipitation_amount ??
  e?.data?.next_6_hours?.details?.precipitation_amount ??
  0;
const popOf = (e: any): number => e?.data?.next_1_hours?.details?.probability_of_precipitation ?? 0;

async function metno<T = any>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { headers: { 'User-Agent': METNO_USER_AGENT } });
  } catch {
    throw new WeatherApiError('Network error — check your connection.');
  }
  if (!res.ok) throw new WeatherApiError(`MET Norway request failed (${res.status}).`);
  return (await res.json()) as T;
}

export async function fetchMetNoForecast(
  lat: number,
  lon: number,
  tz: string,
  place: string,
  language: LanguageCode,
  country: string,
): Promise<WeatherData> {
  const data = await metno(
    `${METNO_API_BASE}/complete?lat=${round4(lat)}&lon=${round4(lon)}`,
  );
  const series: any[] = data.properties?.timeseries ?? [];

  const localtime = localNow(tz);
  const todayDate = localtime.slice(0, 10);
  const now = Date.now();

  const detailsOf = (e: any) => e?.data?.instant?.details ?? {};

  // --- Hourly (current hour onward, 24) ---
  const future = series.filter((e) => Date.parse(e.time) + 3600_000 > now);
  const slice = (future.length ? future : series).slice(0, 24);

  const hours: HourForecast[] = slice.map((e, i) => {
    const ms = Date.parse(e.time);
    const hour24 = hourInTz(ms, tz);
    const symbol = symbolOf(e);
    const isDay = symbolIsDay(symbol, hour24);
    const dt = detailsOf(e);
    const tC = dt.air_temperature ?? 0;
    const humidity = Math.round(dt.relative_humidity ?? 0);
    const windKph = (dt.wind_speed ?? 0) * 3.6;
    const flC = feelsLikeC(tC, humidity, windKph);
    return {
      timeEpoch: Math.floor(ms / 1000),
      hour24,
      isNow: i === 0,
      tempC: Math.round(tC),
      tempF: Math.round(cToF(tC)),
      feelsLikeC: Math.round(flC),
      feelsLikeF: Math.round(cToF(flC)),
      humidity,
      conditionCode: conditionFromMetNo(symbol, isDay).code,
      isDay,
      chanceOfRain: Math.round(popOf(e)),
    };
  });

  // --- Group by local date for daily + today aggregates ---
  const byDate = new Map<string, any[]>();
  for (const e of series) {
    const day = dateInTz(Date.parse(e.time), tz);
    (byDate.get(day) ?? byDate.set(day, []).get(day)!).push(e);
  }
  const aggregate = (list: any[]) => {
    const temps = list.map((e) => detailsOf(e).air_temperature).filter((v) => v != null) as number[];
    const noon = list.find((e) => hourInTz(Date.parse(e.time), tz) === 12) ?? list[Math.floor(list.length / 2)] ?? list[0];
    return {
      hi: temps.length ? Math.max(...temps) : 0,
      lo: temps.length ? Math.min(...temps) : 0,
      pop: Math.round(Math.max(0, ...list.map(popOf))),
      precip: list.reduce((s, e) => s + precipOf(e), 0),
      code: conditionFromMetNo(symbolOf(noon), true).code,
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
  const astro = computeAstro(lat, lon, tz);

  // --- Current (from the first/now entry) ---
  const h0 = slice[0] ?? {};
  const d0 = detailsOf(h0);
  const curSymbol = symbolOf(h0);
  const curHour = hourInTz(Date.parse(h0.time ?? new Date().toISOString()), tz);
  const curIsDay = symbolIsDay(curSymbol, curHour);
  const curCond = conditionFromMetNo(curSymbol, curIsDay);
  const curTc = d0.air_temperature ?? 0;
  const curHum = Math.round(d0.relative_humidity ?? 0);
  const curWindKph = (d0.wind_speed ?? 0) * 3.6;
  const curFlC = feelsLikeC(curTc, curHum, curWindKph);

  return {
    location: {
      name: place,
      region: '',
      country,
      lat: round4(lat),
      lon: round4(lon),
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
      humidity: curHum,
      windKph: Math.round(curWindKph),
      windDir: degToCompass(d0.wind_from_direction),
      precipMm: Math.round(precipOf(h0) * 10) / 10,
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
