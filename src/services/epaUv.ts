/**
 * US UV index, from the EPA's Envirofacts UV service.
 *
 * NWS publishes no UV at all, so this fills the gap for US locations. It's
 * free, keyless, takes lat/lon directly (no ZIP lookup), and covers the states
 * plus Alaska, Hawaii and Puerto Rico. The catch is that it's **today only** —
 * there's no multi-day UV forecast — so it feeds today's peak and the hourly
 * strip, and leaves the day screens without a UV card.
 */

import { EPA_UV_API_BASE } from '@/config';

interface EpaUvRow {
  ORDER?: number;
  DATE_TIME?: string;
  UV_VALUE?: number;
}

export interface EpaUvForecast {
  /** UV by local hour of day, keyed "<days from today>:<hour24>". */
  byHour: Map<string, number>;
  /** Peak UV for today. */
  peak?: number;
}

/** "Aug/13/2026 07 AM" → 7, "12 PM" → 12, "12 AM" → 0. */
function parseHour(dateTime: string | undefined): number | null {
  const m = /(\d{1,2})\s*(AM|PM)\s*$/i.exec(dateTime ?? '');
  if (!m) return null;
  const h = Number(m[1]) % 12;
  return /PM/i.test(m[2]) ? h + 12 : h;
}

/**
 * Fetch today's hourly UV for a coordinate.
 *
 * The series runs ~21 hours and crosses midnight, but the rows' own date labels
 * don't roll over correctly in every timezone (an Anchorage series ends stamped
 * with *yesterday's* date). `ORDER` is the trustworthy part, so the day
 * rollover is tracked by watching the hour wrap instead of parsing dates.
 */
export async function fetchEpaUv(lat: number, lon: number): Promise<EpaUvForecast | null> {
  const url = `${EPA_UV_API_BASE}/getEnvirofactsUVHOURLY/LATITUDE/${lat.toFixed(4)}/LONGITUDE/${lon.toFixed(4)}/JSON`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`EPA UV request failed (${res.status}).`);
  const rows = (await res.json()) as EpaUvRow[];
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const ordered = [...rows].sort((a, b) => (a.ORDER ?? 0) - (b.ORDER ?? 0));
  const byHour = new Map<string, number>();
  let dayOffset = 0;
  let prevHour = -1;
  let peak: number | undefined;

  for (const row of ordered) {
    const hour = parseHour(row.DATE_TIME);
    const value = row.UV_VALUE;
    if (hour == null || !Number.isFinite(value)) continue;
    if (prevHour >= 0 && hour < prevHour) dayOffset += 1;
    prevHour = hour;
    byHour.set(`${dayOffset}:${hour}`, value as number);
    if (dayOffset === 0 && (peak == null || (value as number) > peak)) peak = value as number;
  }

  return byHour.size ? { byHour, peak } : null;
}
