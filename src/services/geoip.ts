/**
 * Approximate location from the caller's IP, used as a fallback when GPS
 * permission isn't granted. The endpoint returns
 *   { success, ip, estimated, data: { postalCode, ... } }
 * and yields no postal code for private/local IPs (emulator, LAN) — treated
 * as "no fallback available".
 */

import { GEOIP_API_KEY, GEOIP_API_URL } from '@/config';

export async function getZipcodeFromIP(): Promise<string | null> {
  if (!GEOIP_API_URL) return null;
  try {
    const res = await fetch(GEOIP_API_URL, {
      method: 'GET',
      headers: GEOIP_API_KEY ? { 'X-API-Key': GEOIP_API_KEY } : undefined,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      success?: boolean;
      data?: { postalCode?: string | number } | null;
    };
    if (!body?.success || !body?.data?.postalCode) return null;
    const postal = String(body.data.postalCode).trim();
    return postal.length > 0 ? postal : null;
  } catch {
    return null;
  }
}
