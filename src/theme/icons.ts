/**
 * Maps WeatherAPI condition codes to the emoji glyphs used in the design.
 * (The design deliberately uses emoji rather than an icon font.)
 *
 * Code reference: https://www.weatherapi.com/docs/weather_conditions.json
 */

type Glyph = { day: string; night: string };

const CLEAR: Glyph = { day: '☀️', night: '🌙' };
const PARTLY: Glyph = { day: '⛅', night: '☁️' };
const CLOUDY: Glyph = { day: '☁️', night: '☁️' };
const FOG: Glyph = { day: '🌫️', night: '🌫️' };
const DRIZZLE: Glyph = { day: '🌦️', night: '🌧️' };
const RAIN: Glyph = { day: '🌧️', night: '🌧️' };
const THUNDER: Glyph = { day: '⛈️', night: '⛈️' };
const SNOW: Glyph = { day: '🌨️', night: '🌨️' };
const SLEET: Glyph = { day: '🌨️', night: '🌨️' };

const CODE_TO_GLYPH: Record<number, Glyph> = {
  1000: CLEAR,
  1003: PARTLY,
  1006: CLOUDY,
  1009: CLOUDY,
  1030: FOG,
  1135: FOG,
  1147: FOG,
  // thunder
  1087: THUNDER,
  1273: THUNDER,
  1276: THUNDER,
  1279: THUNDER,
  1282: THUNDER,
  // drizzle / light rain
  1063: DRIZZLE,
  1150: DRIZZLE,
  1153: DRIZZLE,
  1168: DRIZZLE,
  1171: DRIZZLE,
  1180: DRIZZLE,
  1183: DRIZZLE,
  1240: DRIZZLE,
  // moderate / heavy rain
  1186: RAIN,
  1189: RAIN,
  1192: RAIN,
  1195: RAIN,
  1198: RAIN,
  1201: RAIN,
  1243: RAIN,
  1246: RAIN,
  // snow
  1066: SNOW,
  1114: SNOW,
  1117: SNOW,
  1210: SNOW,
  1213: SNOW,
  1216: SNOW,
  1219: SNOW,
  1222: SNOW,
  1225: SNOW,
  1255: SNOW,
  1258: SNOW,
  // sleet / ice pellets
  1069: SLEET,
  1072: SLEET,
  1204: SLEET,
  1207: SLEET,
  1237: SLEET,
  1249: SLEET,
  1252: SLEET,
  1261: SLEET,
  1264: SLEET,
};

/** Returns the emoji for a condition code, respecting day/night. */
export function weatherEmoji(code: number, isDay: boolean): string {
  const glyph = CODE_TO_GLYPH[code] ?? PARTLY;
  return isDay ? glyph.day : glyph.night;
}
