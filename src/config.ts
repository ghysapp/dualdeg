/**
 * App-wide configuration and constants.
 */

/** WeatherAPI.com key, injected at bundle time from `.env` (EXPO_PUBLIC_ prefix). */
export const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHERAPI_KEY ?? '';

/** True when a real key has been provided (i.e. not the placeholder). */
export const HAS_API_KEY =
  WEATHER_API_KEY.length > 0 && WEATHER_API_KEY !== 'your_weatherapi_key_here';

export const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

/**
 * US National Weather Service (api.weather.gov) — free, no key, US-only. Used
 * for US locations to spare the WeatherAPI quota; non-US falls back to
 * WeatherAPI. NWS requires a descriptive User-Agent with a contact.
 */
export const NWS_API_BASE = 'https://api.weather.gov';
export const NWS_USER_AGENT = 'dualdeg-weather/1.0 (com.ghysapp.dualdeg; anthony.ghys@gmail.com)';

/**
 * Météo-France — free, France-only. Uses the public mobile-app forecast API
 * (lat/lon → hourly + daily + astronomy) with the shared app token also used by
 * the Home Assistant integration. Override via env if needed.
 */
export const METEOFRANCE_API_BASE = 'https://webservice.meteofrance.com';
export const METEOFRANCE_TOKEN =
  process.env.EXPO_PUBLIC_METEOFRANCE_TOKEN ?? '__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__';

/**
 * Germany → Bright Sky (brightsky.dev), a free, no-key JSON API over Deutscher
 * Wetterdienst (DWD) open data (MOSMIX forecasts + observations), queryable by
 * lat/lon.
 */
export const BRIGHTSKY_API_BASE = 'https://api.brightsky.dev';

/**
 * MET Norway (api.met.no) — free, official, no key, global. Used for a set of
 * single-timezone countries (Norway + much of Europe). Requires an identifying
 * User-Agent with a contact per their terms of service; attribute as
 * "Weather data from MET Norway".
 */
export const METNO_API_BASE = 'https://api.met.no/weatherapi/locationforecast/2.0';
export const METNO_USER_AGENT = 'dualdeg-weather/1.0 github.com/ghysapp (anthony.ghys@gmail.com)';

/**
 * Air quality. Each country is served by its own national authority — none of
 * these spend the WeatherAPI quota, and all are free:
 *   - US      → EPA AirNow. The only one needing a key (free, but per-user):
 *               register at docs.airnowapi.org and set EXPO_PUBLIC_AIRNOW_KEY.
 *               Without it, US locations simply show no air quality.
 *   - Germany → Umweltbundesamt (UBA) hourly station measurements, no key.
 *   - France  → Atmo France, the national aggregate of the regional AASQA
 *               networks, published as a per-commune ATMO index (WFS), no key.
 *   - Norway  → MET Norway's air quality forecast (NILU model), no key; uses
 *               the same User-Agent as the forecast API.
 * Everywhere else, WeatherAPI's `aqi=yes` rides along on the forecast call it
 * already makes, so it costs nothing extra.
 */
export const AIRNOW_API_BASE = 'https://www.airnowapi.org';
/**
 * EPA Envirofacts UV service — free, keyless, lat/lon addressable. NWS has no
 * UV of its own, so US locations get theirs from here (today only; there is no
 * multi-day UV forecast).
 */
export const EPA_UV_API_BASE = 'https://data.epa.gov/efservice';
export const AIRNOW_API_KEY = process.env.EXPO_PUBLIC_AIRNOW_KEY ?? '';
export const HAS_AIRNOW_KEY = AIRNOW_API_KEY.length > 0;
export const UBA_API_BASE = 'https://luftdaten.umweltbundesamt.de/api/air-data/v3';
export const ATMO_FRANCE_WFS = 'https://data.atmo-france.org/geoserver/ind/ows';
export const METNO_AIRQUALITY_BASE = 'https://api.met.no/weatherapi/airqualityforecast/0.1';

/**
 * How long an air quality reading is reused before any source is called again.
 * Deliberately longer than the forecast TTLs: pollution moves slowly, most of
 * these sources only publish hourly (France, daily), and there's no reason for
 * a pull-to-refresh to re-hit a national authority.
 */
export const AIR_QUALITY_TTL = 3 * 60 * 60 * 1000;

/**
 * UBA's station list is ~110 KB and changes a few times a year, so it's cached
 * far longer than any measurement.
 */
export const UBA_STATIONS_TTL = 30 * 24 * 60 * 60 * 1000;

/** GeoIP fallback (approximate location from IP when GPS isn't granted). */
export const GEOIP_API_URL = process.env.EXPO_PUBLIC_GEOIP_API_URL ?? '';
export const GEOIP_API_KEY = process.env.EXPO_PUBLIC_GEOIP_API_KEY ?? '';
export const HAS_GEOIP = GEOIP_API_URL.length > 0;

/**
 * Maximum number of *future* forecast days to display in the "Next N days"
 * section. Providers supply fewer when that's all they have (WeatherAPI's free
 * tier caps at 2, NWS ~6); the daily list renders however many come back.
 */
export const MAX_FUTURE_DAYS = 7;

/** Number of forecast days to request from WeatherAPI (today + the future days). */
export const FORECAST_DAYS = MAX_FUTURE_DAYS + 1;

/** Cache freshness windows, in milliseconds. */
export const CACHE_TTL = {
  /** Current (GPS) location refreshes if older than 60 minutes. */
  current: 60 * 60 * 1000,
  /** Saved cities refresh if older than 6 hours. */
  saved: 6 * 60 * 60 * 1000,
} as const;

/**
 * When the app returns to the foreground after being backgrounded for at least
 * this long, the visible tab is refreshed so we never show stale (e.g. day-old)
 * weather from a previous session.
 */
export const BACKGROUND_REFRESH_THRESHOLD = 10 * 60 * 1000;

/** Maximum number of saved cities (the design shows up to 4 alongside Current). */
export const MAX_SAVED_CITIES = 4;

/**
 * Non-consumable in-app purchase that removes the ad banner. Create this exact
 * product id in App Store Connect and Google Play Console (as a one-time /
 * non-consumable product) before shipping. The store is the source of truth —
 * no backend needed; entitlement is restored from the store on reinstall.
 */
export const REMOVE_ADS_PRODUCT_ID = 'remove_ads';
