/**
 * App-wide configuration and constants.
 */

/** WeatherAPI.com key, injected at bundle time from `.env` (EXPO_PUBLIC_ prefix). */
export const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHERAPI_KEY ?? '';

/** True when a real key has been provided (i.e. not the placeholder). */
export const HAS_API_KEY =
  WEATHER_API_KEY.length > 0 && WEATHER_API_KEY !== 'your_weatherapi_key_here';

export const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

/** GeoIP fallback (approximate location from IP when GPS isn't granted). */
export const GEOIP_API_URL = process.env.EXPO_PUBLIC_GEOIP_API_URL ?? '';
export const GEOIP_API_KEY = process.env.EXPO_PUBLIC_GEOIP_API_KEY ?? '';
export const HAS_GEOIP = GEOIP_API_URL.length > 0;

/** Number of forecast days to request (today + 2 = the design's "next 2 days"). */
export const FORECAST_DAYS = 3;

/** Cache freshness windows, in milliseconds. */
export const CACHE_TTL = {
  /** Current (GPS) location refreshes if older than 60 minutes. */
  current: 60 * 60 * 1000,
  /** Saved cities refresh if older than 6 hours. */
  saved: 6 * 60 * 60 * 1000,
} as const;

/** Maximum number of saved cities (the design shows up to 4 alongside Current). */
export const MAX_SAVED_CITIES = 4;

/**
 * Non-consumable in-app purchase that removes the ad banner. Create this exact
 * product id in App Store Connect and Google Play Console (as a one-time /
 * non-consumable product) before shipping. The store is the source of truth —
 * no backend needed; entitlement is restored from the store on reinstall.
 */
export const REMOVE_ADS_PRODUCT_ID = 'remove_ads';
