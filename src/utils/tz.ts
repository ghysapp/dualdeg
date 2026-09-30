/** Timezone helpers for provider normalization (IANA tz aware, Hermes-safe). */

/**
 * `Intl.DateTimeFormat` instances, built once per (locale, options, tz). On
 * Android, Hermes implements Intl through JNI calls into the platform, which
 * makes constructing a formatter expensive; providers call these helpers for
 * every forecast hour, so they must not build a fresh one each time.
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

export function cachedFormatter(
  locale: string,
  opts: Intl.DateTimeFormatOptions,
  tz?: string,
): Intl.DateTimeFormat {
  const key = `${locale}|${tz ?? ''}|${JSON.stringify(opts)}`;
  let f = formatters.get(key);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(locale, tz ? { ...opts, timeZone: tz } : opts);
    } catch {
      // Unknown timezone: fall back to the device's.
      f = new Intl.DateTimeFormat(locale, opts);
    }
    formatters.set(key, f);
  }
  return f;
}

const DATE_TIME: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};
const DATE: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
const HOUR: Intl.DateTimeFormatOptions = { hour: '2-digit', hour12: false };

/** Wall-clock "YYYY-MM-DD HH:MM" for now, in the given timezone. */
export function localNow(tz: string): string {
  const parts = cachedFormatter('en-CA', DATE_TIME, tz).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  const hour = g('hour') === '24' ? '00' : g('hour');
  return `${g('year')}-${g('month')}-${g('day')} ${hour}:${g('minute')}`;
}

/** "YYYY-MM-DD" for an epoch (ms), in the given timezone. */
export function dateInTz(ms: number, tz: string): string {
  return cachedFormatter('en-CA', DATE, tz).format(new Date(ms));
}

/** Hour of day (0–23) for an epoch (ms), in the given timezone. */
export function hourInTz(ms: number, tz: string): number {
  const h = cachedFormatter('en-GB', HOUR, tz).format(new Date(ms));
  const n = Number(h.replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n % 24 : 0;
}
