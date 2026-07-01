/**
 * Local astronomy (sunrise/sunset, moon phase + illumination) via `suncalc`.
 * NWS provides no astronomy, so we compute it ourselves; the output matches
 * WeatherAPI's shape (e.g. "6:12 AM", "Waxing Gibbous", 0–100) so both
 * providers feed the UI identically.
 */

import { getMoonIllumination, getTimes } from 'suncalc';

export interface Astro {
  sunrise: string;
  sunset: string;
  moonPhase: string;
  /** Illuminated fraction, 0–100. */
  moonIllumination: number;
}

/** Format a Date as "h:mm AM/PM" in the given IANA timezone. */
function formatTime(date: Date | null | undefined, tz: string): string {
  if (!date || !Number.isFinite(date.getTime())) return '';
  const opts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  try {
    return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: tz }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-US', opts).format(date);
  }
}

/** Map suncalc's phase (0=new, .25=first quarter, .5=full, .75=last quarter). */
function moonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return 'New Moon';
  if (phase < 0.22) return 'Waxing Crescent';
  if (phase < 0.28) return 'First Quarter';
  if (phase < 0.47) return 'Waxing Gibbous';
  if (phase < 0.53) return 'Full Moon';
  if (phase < 0.72) return 'Waning Gibbous';
  if (phase < 0.78) return 'Last Quarter';
  return 'Waning Crescent';
}

export function computeAstro(lat: number, lon: number, tz: string, date: Date = new Date()): Astro {
  const times = getTimes(date, lat, lon);
  const moon = getMoonIllumination(date);
  return {
    sunrise: formatTime(times.sunrise, tz),
    sunset: formatTime(times.sunset, tz),
    moonPhase: moonPhaseName(moon.phase),
    moonIllumination: Math.round(moon.fraction * 100),
  };
}
