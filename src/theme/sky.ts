/**
 * Adaptive "sky" theme.
 *
 * The design recolors a single layout by time-of-day + condition, and that
 * recoloring doubles as the light/dark theme. Given a location's local time,
 * sun times and current condition we resolve one of five palettes:
 *
 *   day          → Frame A (light, blue)   — clear/partly daytime
 *   overcast     → muted blue-grey         — cloudy/rainy daytime
 *   golden       → Frame C (warm)          — clear sunrise/sunset (~75 min window)
 *   overcastDusk → dusky warm-grey         — cloudy/rainy sunrise/sunset
 *   night        → Frame B (dark, starry)  — after dusk / before dawn (any weather)
 */

import type { WeatherData } from '@/services/weatherApi';
import { timeToMinutes } from '@/utils/time';

export type SkyKey = 'day' | 'overcast' | 'golden' | 'overcastDusk' | 'night';

export interface SkyShadow {
  color: string;
  opacity: number;
  radius: number;
  offsetY: number;
  elevation: number;
}

export interface SkyTheme {
  key: SkyKey;
  mode: 'light' | 'dark';
  /** Background gradient stops (top → bottom). */
  gradient: readonly string[];
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  cardBg: string;
  cardBorder: string;
  divider: string;
  tabActiveBg: string;
  tabActiveFg: string;
  tabInactiveBg: string;
  tabInactiveFg: string;
  tabShadow: SkyShadow;
  /** Tint for the accent label above the active location ("A · Daylight…"). */
  accentLabel: string;
  statusBar: 'light' | 'dark';
  /** Whether to render the starfield overlay (night only). */
  stars: boolean;
}

const SKY: Record<SkyKey, SkyTheme> = {
  day: {
    key: 'day',
    mode: 'light',
    gradient: ['#62b3f7', '#a7d6fc', '#dcefff'],
    textPrimary: '#0e3a63',
    textSecondary: '#1a4e80',
    textAccent: '#1a4e80',
    cardBg: 'rgba(255,255,255,0.42)',
    cardBorder: 'rgba(255,255,255,0.5)',
    divider: 'rgba(26,78,128,0.18)',
    tabActiveBg: 'rgba(255,255,255,0.92)',
    tabActiveFg: '#0e3a63',
    tabInactiveBg: 'rgba(255,255,255,0.28)',
    tabInactiveFg: '#1a4e80',
    tabShadow: { color: '#1c3c6e', opacity: 0.18, radius: 12, offsetY: 4, elevation: 4 },
    accentLabel: '#1e6fd4',
    statusBar: 'dark',
    stars: false,
  },
  overcast: {
    key: 'overcast',
    mode: 'light',
    gradient: ['#8ea6bd', '#aebccc', '#cfd8e1'],
    textPrimary: '#26323f',
    textSecondary: '#3c4a5a',
    textAccent: '#3c4a5a',
    cardBg: 'rgba(255,255,255,0.4)',
    cardBorder: 'rgba(255,255,255,0.5)',
    divider: 'rgba(38,50,63,0.18)',
    tabActiveBg: 'rgba(255,255,255,0.92)',
    tabActiveFg: '#26323f',
    tabInactiveBg: 'rgba(255,255,255,0.3)',
    tabInactiveFg: '#3c4a5a',
    tabShadow: { color: '#26323f', opacity: 0.16, radius: 12, offsetY: 4, elevation: 4 },
    accentLabel: '#516274',
    statusBar: 'dark',
    stars: false,
  },
  golden: {
    key: 'golden',
    mode: 'light',
    gradient: ['#ff9460', '#ffb27e', '#ffd0a8', '#ffe1cf'],
    textPrimary: '#5e2a0f',
    textSecondary: '#8a3c14',
    textAccent: '#8a3c14',
    cardBg: 'rgba(255,255,255,0.5)',
    cardBorder: 'rgba(255,255,255,0.6)',
    divider: 'rgba(138,60,20,0.18)',
    tabActiveBg: 'rgba(255,255,255,0.95)',
    tabActiveFg: '#8a3c14',
    tabInactiveBg: 'rgba(255,255,255,0.32)',
    tabInactiveFg: '#7a3a16',
    tabShadow: { color: '#be5a1e', opacity: 0.22, radius: 12, offsetY: 4, elevation: 4 },
    accentLabel: '#e0772f',
    statusBar: 'dark',
    stars: false,
  },
  overcastDusk: {
    key: 'overcastDusk',
    mode: 'light',
    gradient: ['#8a7f86', '#a99ba0', '#cabfc0', '#ddd4d2'],
    textPrimary: '#33272a',
    textSecondary: '#5a4a4d',
    textAccent: '#5a4a4d',
    cardBg: 'rgba(255,255,255,0.4)',
    cardBorder: 'rgba(255,255,255,0.5)',
    divider: 'rgba(51,39,42,0.18)',
    tabActiveBg: 'rgba(255,255,255,0.92)',
    tabActiveFg: '#33272a',
    tabInactiveBg: 'rgba(255,255,255,0.3)',
    tabInactiveFg: '#5a4a4d',
    tabShadow: { color: '#4a3a3d', opacity: 0.18, radius: 12, offsetY: 4, elevation: 4 },
    accentLabel: '#8a6f72',
    statusBar: 'dark',
    stars: false,
  },
  night: {
    key: 'night',
    mode: 'dark',
    gradient: ['#2b3f73', '#15244a', '#0c1430'],
    textPrimary: '#eaf0ff',
    textSecondary: '#aab9ee',
    textAccent: '#aab9ee',
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(255,255,255,0.13)',
    divider: 'rgba(170,185,238,0.22)',
    tabActiveBg: 'rgba(255,255,255,0.95)',
    tabActiveFg: '#15244a',
    tabInactiveBg: 'rgba(255,255,255,0.1)',
    tabInactiveFg: '#c5d2f5',
    tabShadow: { color: '#000000', opacity: 0.3, radius: 14, offsetY: 4, elevation: 6 },
    accentLabel: '#7c6cf0',
    statusBar: 'light',
    stars: true,
  },
};

/**
 * "Gloomy" = anything that isn't a clear or partly-cloudy sky, i.e. cloudy,
 * overcast, foggy, rainy, drizzly, thundery, sleety or snowy. WeatherAPI codes
 * 1000 (clear/sunny) and 1003 (partly cloudy) stay bright; everything else
 * triggers a greyish palette during the day or at sunrise/sunset.
 */
function isGloomy(code: number): boolean {
  return code !== 1000 && code !== 1003;
}

const GOLDEN_WINDOW_MIN = 75;

/** Resolve the sky palette for a forecast. */
export function resolveSky(data: WeatherData): SkyTheme {
  const { current, today, location } = data;

  // Night is driven by the API's is_day flag (it accounts for twilight) and
  // keeps its palette regardless of weather.
  if (!current.isDay) return SKY.night;

  const gloomy = isGloomy(current.conditionCode);

  const nowMin = timeToMinutes(location.localtime.slice(11)); // "HH:MM"
  const sunriseMin = timeToMinutes(today.sunrise);
  const sunsetMin = timeToMinutes(today.sunset);
  const nearSunrise = Math.abs(nowMin - sunriseMin) <= GOLDEN_WINDOW_MIN;
  const nearSunset = Math.abs(nowMin - sunsetMin) <= GOLDEN_WINDOW_MIN;

  // Sunrise / sunset window.
  if (nearSunrise || nearSunset) return gloomy ? SKY.overcastDusk : SKY.golden;

  // Regular daytime.
  return gloomy ? SKY.overcast : SKY.day;
}

export function skyByKey(key: SkyKey): SkyTheme {
  return SKY[key];
}

/** Neutral palette used before any data has loaded. */
export const LOADING_SKY = SKY.day;
