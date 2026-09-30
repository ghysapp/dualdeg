/**
 * Dev-only timing helpers for the `[loc]` / `[wx]` / `[aq]` logs: a timestamp
 * relative to bundle start, and a detector that reports when the JS thread was
 * blocked (busy computing) rather than waiting on the network or storage.
 */

const T0 = Date.now();

/** "+1234ms" since the bundle started. */
export function since(): string {
  return `+${Date.now() - T0}ms`;
}

const TICK_MS = 200;
const REPORT_OVER_MS = 300;

/** Logs `[lag]` whenever a 200 ms timer fires more than 300 ms late. */
export function watchJsStalls(): void {
  if (!__DEV__) return;
  let last = Date.now();
  setInterval(() => {
    const now = Date.now();
    const lag = now - last - TICK_MS;
    if (lag > REPORT_OVER_MS) console.log(`[lag] ${since()} JS thread was blocked ~${lag}ms`);
    last = now;
  }, TICK_MS);
}
