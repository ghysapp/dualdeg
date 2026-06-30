/**
 * WeatherAPI.com client.
 *
 * We hit two endpoints:
 *   - /forecast.json  → current conditions + hourly + multi-day + astronomy
 *   - /search.json    → city autocomplete for the "add city" screen
 *
 * The raw response is normalized into the lean {@link WeatherData} model the UI
 * consumes, so the rest of the app never deals with WeatherAPI's shape directly.
 */

import {
  FORECAST_DAYS,
  HAS_API_KEY,
  WEATHER_API_BASE,
  WEATHER_API_KEY,
} from '@/config';

// ---------------------------------------------------------------------------
// Raw API shapes (only the fields we actually read)
// ---------------------------------------------------------------------------

interface RawCondition {
  text: string;
  code: number;
}

interface RawForecastResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string; // "2024-06-27 14:00" — wall clock at the location
  };
  current: {
    temp_c: number;
    temp_f: number;
    is_day: 0 | 1;
    condition: RawCondition;
    feelslike_c: number;
    feelslike_f: number;
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    precip_mm: number;
  };
  forecast: {
    forecastday: RawForecastDay[];
  };
}

interface RawForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    daily_chance_of_rain: number;
    totalprecip_mm: number;
    condition: RawCondition;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moon_phase: string;
    moon_illumination: string | number;
  };
  hour: RawHour[];
}

interface RawHour {
  time_epoch: number;
  time: string; // "2024-06-27 14:00" — already local to the location
  temp_c: number;
  temp_f: number;
  is_day: 0 | 1;
  condition: RawCondition;
  feelslike_c: number;
  feelslike_f: number;
  humidity: number;
  chance_of_rain: number;
}

interface RawSearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

// ---------------------------------------------------------------------------
// Normalized model consumed by the UI
// ---------------------------------------------------------------------------

export interface HourForecast {
  timeEpoch: number;
  /** Hour of day (0–23) in the location's local time. */
  hour24: number;
  /** True for the current hour (shown as "Now"). */
  isNow: boolean;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  humidity: number;
  conditionCode: number;
  isDay: boolean;
  chanceOfRain: number;
}

export interface DayForecast {
  dateEpoch: number;
  /** Day of week, 0 (Sunday) – 6 (Saturday). */
  weekdayIndex: number;
  /** True for the first upcoming day (shown as "Tomorrow"). */
  isTomorrow: boolean;
  maxTempC: number;
  maxTempF: number;
  minTempC: number;
  minTempF: number;
  chanceOfRain: number;
  conditionCode: number;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tzId: string;
    localtimeEpoch: number;
    /** Wall-clock time at the location, "YYYY-MM-DD HH:MM". */
    localtime: string;
  };
  current: {
    tempC: number;
    tempF: number;
    conditionText: string;
    conditionCode: number;
    isDay: boolean;
    feelsLikeC: number;
    feelsLikeF: number;
    humidity: number;
    windKph: number;
    windDir: string;
    precipMm: number;
  };
  today: {
    maxTempC: number;
    maxTempF: number;
    minTempC: number;
    minTempF: number;
    chanceOfRain: number;
    precipMm: number;
    sunrise: string;
    sunset: string;
    moonPhase: string;
    /** Illuminated fraction of the moon, 0–100. */
    moonIllumination: number;
  };
  hours: HourForecast[];
  days: DayForecast[];
}

export interface CitySearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export class WeatherApiError extends Error {}

function assertKey() {
  if (!HAS_API_KEY) {
    throw new WeatherApiError(
      'No WeatherAPI key configured. Add EXPO_PUBLIC_WEATHERAPI_KEY to .env and restart Expo.',
    );
  }
}

async function request<T>(path: string, params: Record<string, string>): Promise<T> {
  assertKey();
  const search = new URLSearchParams({ key: WEATHER_API_KEY, ...params });
  const url = `${WEATHER_API_BASE}/${path}?${search.toString()}`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new WeatherApiError('Network error — check your connection.');
  }
  if (!res.ok) {
    // WeatherAPI returns { error: { code, message } } on failures.
    let message = `WeatherAPI request failed (${res.status}).`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) message = body.error.message;
    } catch {
      // ignore parse errors, keep generic message
    }
    throw new WeatherApiError(message);
  }
  return (await res.json()) as T;
}

/** Weekday index (0=Sun) from a "YYYY-MM-DD" date string, computed in UTC. */
function weekdayIndexOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and normalize the forecast for a `q` value accepted by WeatherAPI:
 * "lat,lon", a city name, or "id:12345".
 */
export async function fetchForecast(query: string, lang?: string): Promise<WeatherData> {
  const raw = await request<RawForecastResponse>('forecast.json', {
    q: query,
    days: String(FORECAST_DAYS),
    aqi: 'no',
    alerts: 'no',
    ...(lang ? { lang } : {}),
  });

  const days = raw.forecast.forecastday;
  const today = days[0];
  const nowEpoch = raw.location.localtime_epoch;

  // Flatten every forecast hour, then keep the current hour onward (24 of them).
  const allHours = days.flatMap((d) => d.hour);
  const startIdx = Math.max(
    0,
    allHours.findIndex((h) => h.time_epoch + 3600 > nowEpoch),
  );
  const hours: HourForecast[] = allHours.slice(startIdx, startIdx + 24).map((h, i) => ({
    timeEpoch: h.time_epoch,
    hour24: Number(h.time.slice(11, 13)),
    isNow: i === 0,
    tempC: Math.round(h.temp_c),
    tempF: Math.round(h.temp_f),
    feelsLikeC: Math.round(h.feelslike_c),
    feelsLikeF: Math.round(h.feelslike_f),
    humidity: h.humidity,
    conditionCode: h.condition.code,
    isDay: h.is_day === 1,
    chanceOfRain: h.chance_of_rain,
  }));

  // The "next days" rows: everything after today.
  const dayForecasts: DayForecast[] = days.slice(1).map((d, i) => ({
    dateEpoch: d.date_epoch,
    weekdayIndex: weekdayIndexOf(d.date),
    isTomorrow: i === 0,
    maxTempC: Math.round(d.day.maxtemp_c),
    maxTempF: Math.round(d.day.maxtemp_f),
    minTempC: Math.round(d.day.mintemp_c),
    minTempF: Math.round(d.day.mintemp_f),
    chanceOfRain: d.day.daily_chance_of_rain,
    conditionCode: d.day.condition.code,
  }));

  return {
    location: {
      name: raw.location.name,
      region: raw.location.region,
      country: raw.location.country,
      lat: raw.location.lat,
      lon: raw.location.lon,
      tzId: raw.location.tz_id,
      localtimeEpoch: raw.location.localtime_epoch,
      localtime: raw.location.localtime,
    },
    current: {
      tempC: Math.round(raw.current.temp_c),
      tempF: Math.round(raw.current.temp_f),
      conditionText: raw.current.condition.text,
      conditionCode: raw.current.condition.code,
      isDay: raw.current.is_day === 1,
      feelsLikeC: Math.round(raw.current.feelslike_c),
      feelsLikeF: Math.round(raw.current.feelslike_f),
      humidity: raw.current.humidity,
      windKph: Math.round(raw.current.wind_kph),
      windDir: raw.current.wind_dir,
      precipMm: raw.current.precip_mm,
    },
    today: {
      maxTempC: Math.round(today.day.maxtemp_c),
      maxTempF: Math.round(today.day.maxtemp_f),
      minTempC: Math.round(today.day.mintemp_c),
      minTempF: Math.round(today.day.mintemp_f),
      chanceOfRain: today.day.daily_chance_of_rain,
      precipMm: today.day.totalprecip_mm,
      sunrise: today.astro.sunrise,
      sunset: today.astro.sunset,
      moonPhase: today.astro.moon_phase,
      moonIllumination: Number(today.astro.moon_illumination) || 0,
    },
    hours,
    days: dayForecasts,
  };
}

/** City autocomplete for the add-city screen. */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const raw = await request<RawSearchResult[]>('search.json', { q: trimmed });
  return raw.map((r) => ({
    id: r.id,
    name: r.name,
    region: r.region,
    country: r.country,
    lat: r.lat,
    lon: r.lon,
  }));
}
