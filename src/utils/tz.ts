/** Timezone helpers for provider normalization (IANA tz aware, Hermes-safe). */

/** Wall-clock "YYYY-MM-DD HH:MM" for now, in the given timezone. */
export function localNow(tz: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: tz }).formatToParts(new Date());
  } catch {
    parts = new Intl.DateTimeFormat('en-CA', opts).formatToParts(new Date());
  }
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  const hour = g('hour') === '24' ? '00' : g('hour');
  return `${g('year')}-${g('month')}-${g('day')} ${hour}:${g('minute')}`;
}

/** "YYYY-MM-DD" for an epoch (ms), in the given timezone. */
export function dateInTz(ms: number, tz: string): string {
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  try {
    return new Intl.DateTimeFormat('en-CA', { ...opts, timeZone: tz }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat('en-CA', opts).format(new Date(ms));
  }
}

/** Hour of day (0–23) for an epoch (ms), in the given timezone. */
export function hourInTz(ms: number, tz: string): number {
  const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', hour12: false };
  let h: string;
  try {
    h = new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: tz }).format(new Date(ms));
  } catch {
    h = new Intl.DateTimeFormat('en-GB', opts).format(new Date(ms));
  }
  const n = Number(h.replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n % 24 : 0;
}
