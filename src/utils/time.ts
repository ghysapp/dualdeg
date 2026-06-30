/** Time parsing/formatting helpers for WeatherAPI's local clock strings. */

/** Parse "HH:MM" (24h) or "hh:MM AM/PM" into minutes since local midnight. */
export function timeToMinutes(value: string): number {
  const m = value.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return 0;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const period = m[3]?.toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

/** "08:31 PM" / "5:48" → "20:31" / "05:48". */
export function to24h(value: string): string {
  const m = value.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return value;
  let h = Number(m[1]);
  const min = m[2];
  const period = m[3]?.toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}
