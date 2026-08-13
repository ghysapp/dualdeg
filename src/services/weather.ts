/**
 * Provider router: try each national provider that covers the location (free
 * government/national services, to spare the WeatherAPI quota), then fall back
 * to WeatherAPI. Provider failures and coverage gaps always fall through safely.
 *
 * Providers live in providers.ts — add a country there, not here.
 */

import { languageToApiLang, type LanguageCode } from '@/i18n/translations';
import { fetchAirQuality } from '@/services/airQuality';
import { PROVIDERS, type ProviderContext } from '@/services/providers';
import { fetchForecast, type AirQuality, type WeatherData } from '@/services/weatherApi';

export interface ForecastRequest {
  /** WeatherAPI `q` value ("lat,lon", "id:123", or a postal code). */
  query: string;
  /** Coordinates, when known — required to consider a national provider. */
  coords?: { lat: number; lon: number } | null;
  /** Known country (saved cities carry one); null for a raw GPS fix. */
  country?: string | null;
  /** Known place name (saved cities), for providers that don't return one. */
  place?: string | null;
  language: LanguageCode;
}

export async function fetchWeather(req: ForecastRequest): Promise<WeatherData> {
  const { query, coords, country, place, language } = req;

  // Air quality comes from a different set of national authorities than the
  // forecast, so it's kicked off up front and merged in at the end — it costs
  // nothing to run alongside, and a failure here must never cost us a forecast.
  const airQuality = coords
    ? fetchAirQuality({ coords, country: country ?? null }).catch(() => null)
    : Promise.resolve(null);

  if (coords) {
    const ctx: ProviderContext = { coords, country: country ?? null, place: place ?? null, language };
    for (const provider of PROVIDERS) {
      if (!provider.covers(ctx)) continue;
      try {
        const data = await provider.fetch(ctx);
        if (__DEV__) console.log(`[wx] ${provider.id} served "${query}"`);
        return withAirQuality(data, await airQuality);
      } catch (e) {
        if (__DEV__) {
          console.log(
            `[wx] ${provider.id} failed for "${query}", falling back:`,
            e instanceof Error ? e.message : e,
          );
        }
      }
    }
  }

  if (__DEV__) console.log(`[wx] WeatherAPI served "${query}"`);
  // WeatherAPI already returns air quality on the forecast call itself, so a
  // national reading only overrides it when one was actually available.
  return withAirQuality(await fetchForecast(query, languageToApiLang(language)), await airQuality);
}

function withAirQuality(data: WeatherData, airQuality: AirQuality | null): WeatherData {
  return airQuality ? { ...data, airQuality } : data;
}
