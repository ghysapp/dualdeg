/** Unit conversions + derived meteorological values shared by providers. */

export const cToF = (c: number): number => (c * 9) / 5 + 32;

export const kphToMph = (kph: number): number => kph / 1.609344;

export const mmToIn = (mm: number): number => mm / 25.4;

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

export function degToCompass(deg: number | null | undefined): string {
  if (deg == null || deg < 0) return '';
  return COMPASS[Math.round(deg / 22.5) % 16];
}

/**
 * Apparent temperature (°C) via NOAA heat index (hot+humid) or wind chill
 * (cold+windy), else the air temperature. For providers that don't supply a
 * feels-like value.
 */
export function feelsLikeC(tempC: number, humidity: number, windKph: number): number {
  if (tempC >= 27 && humidity > 0) {
    const T = cToF(tempC);
    const R = humidity;
    const hi =
      -42.379 +
      2.04901523 * T +
      10.14333127 * R -
      0.22475541 * T * R -
      6.83783e-3 * T * T -
      5.481717e-2 * R * R +
      1.22874e-3 * T * T * R +
      8.5282e-4 * T * R * R -
      1.99e-6 * T * T * R * R;
    return ((hi - 32) * 5) / 9;
  }
  if (tempC <= 10 && windKph >= 4.8) {
    const v = Math.pow(windKph, 0.16);
    return 13.12 + 0.6215 * tempC - 11.37 * v + 0.3965 * tempC * v;
  }
  return tempC;
}
