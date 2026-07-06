/**
 * Pluggable national weather providers.
 *
 * Each provider declares which locations it `covers` (by known country and/or an
 * offline point-in-polygon test) and how to `fetch` a normalized forecast. The
 * router (weather.ts) tries them in order and falls back to WeatherAPI.
 *
 * To add a country:
 *   1. generate its outline (scripts/genOutlines.js) + add it to REGIONS in geo.ts,
 *   2. write (or reuse) a `fetch…Forecast(...)` client returning WeatherData,
 *   3. add a provider entry (or a METNO_COUNTRIES row) below.
 */

import { isInFrance, isInGermany, isInRegion, isInUSA } from '@/services/geo';
import { fetchDwdForecast } from '@/services/dwdApi';
import { fetchMeteoFranceForecast } from '@/services/meteoFranceApi';
import { fetchMetNoForecast } from '@/services/metNoApi';
import { fetchNwsForecast } from '@/services/nwsApi';
import type { WeatherData } from '@/services/weatherApi';
import type { LanguageCode } from '@/i18n/translations';

export interface ProviderContext {
  coords: { lat: number; lon: number };
  /** Known country (saved cities carry one); null for a raw GPS fix. */
  country: string | null;
  /** Known place name (saved cities), for providers that don't return one. */
  place: string | null;
  language: LanguageCode;
}

export interface WeatherProvider {
  /** Short id for logging. */
  id: string;
  /** Whether this provider serves the given location. */
  covers: (ctx: ProviderContext) => boolean;
  fetch: (ctx: ProviderContext) => Promise<WeatherData>;
}

// Countries served by MET Norway (single-timezone → tz can be hard-coded).
const METNO_COUNTRIES: { country: string; region: string; tz: string }[] = [
  { country: 'Norway', region: 'norway', tz: 'Europe/Oslo' },
  { country: 'Sweden', region: 'sweden', tz: 'Europe/Stockholm' },
  { country: 'Denmark', region: 'denmark', tz: 'Europe/Copenhagen' },
  { country: 'Finland', region: 'finland', tz: 'Europe/Helsinki' },
  { country: 'United Kingdom', region: 'uk', tz: 'Europe/London' },
  { country: 'Ireland', region: 'ireland', tz: 'Europe/Dublin' },
  { country: 'Netherlands', region: 'netherlands', tz: 'Europe/Amsterdam' },
  { country: 'Belgium', region: 'belgium', tz: 'Europe/Brussels' },
  { country: 'Switzerland', region: 'switzerland', tz: 'Europe/Zurich' },
  { country: 'Austria', region: 'austria', tz: 'Europe/Vienna' },
  { country: 'Italy', region: 'italy', tz: 'Europe/Rome' },
  { country: 'Spain', region: 'spain', tz: 'Europe/Madrid' },
  { country: 'Portugal', region: 'portugal', tz: 'Europe/Lisbon' },
  { country: 'Poland', region: 'poland', tz: 'Europe/Warsaw' },
  { country: 'Czechia', region: 'czechia', tz: 'Europe/Prague' },
];

const metNoProviders: WeatherProvider[] = METNO_COUNTRIES.map((c) => ({
  id: `MET Norway/${c.country}`,
  covers: ({ coords, country }) => country === c.country || isInRegion(c.region, coords.lat, coords.lon),
  fetch: ({ coords, place, language }) =>
    fetchMetNoForecast(coords.lat, coords.lon, c.tz, place ?? '', language, c.country),
}));

export const PROVIDERS: WeatherProvider[] = [
  {
    id: 'NWS',
    covers: ({ coords, country }) =>
      country === 'United States' || isInUSA(coords.lat, coords.lon),
    fetch: ({ coords, language }) => fetchNwsForecast(coords.lat, coords.lon, language),
  },
  {
    id: 'Météo-France',
    covers: ({ coords, country }) => country === 'France' || isInFrance(coords.lat, coords.lon),
    fetch: ({ coords, language }) => fetchMeteoFranceForecast(coords.lat, coords.lon, language),
  },
  {
    id: 'DWD',
    covers: ({ coords, country }) => country === 'Germany' || isInGermany(coords.lat, coords.lon),
    fetch: ({ coords, language }) => fetchDwdForecast(coords.lat, coords.lon, language),
  },
  ...metNoProviders,
];
