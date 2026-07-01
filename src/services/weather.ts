/**
 * Provider router: use the free NWS API for US locations (to spare the
 * WeatherAPI quota) and WeatherAPI everywhere else. US is decided offline via a
 * bundled outline; NWS failures fall back to WeatherAPI so coverage gaps and
 * border misclassifications are always safe.
 */

import { languageToApiLang, type LanguageCode } from '@/i18n/translations';
import { fetchNwsForecast } from '@/services/nwsApi';
import { isInUSA } from '@/services/usGeo';
import { fetchForecast, type WeatherData } from '@/services/weatherApi';

export interface ForecastRequest {
  /** WeatherAPI `q` value ("lat,lon", "id:123", or a postal code). */
  query: string;
  /** Coordinates, when known — required to consider NWS. */
  coords?: { lat: number; lon: number } | null;
  /** Known country (saved cities carry one); null for a raw GPS fix. */
  country?: string | null;
  language: LanguageCode;
}

export async function fetchWeather(req: ForecastRequest): Promise<WeatherData> {
  const { query, coords, country, language } = req;

  const useNws =
    !!coords &&
    (country === 'United States' || (country == null && isInUSA(coords.lat, coords.lon)));

  if (useNws && coords) {
    try {
      const data = await fetchNwsForecast(coords.lat, coords.lon, language);
      if (__DEV__) console.log(`[wx] NWS served "${query}"`);
      return data;
    } catch (e) {
      if (__DEV__) {
        console.log(`[wx] NWS failed for "${query}", using WeatherAPI:`, e instanceof Error ? e.message : e);
      }
    }
  }

  if (__DEV__) console.log(`[wx] WeatherAPI served "${query}"`);
  return fetchForecast(query, languageToApiLang(language));
}
