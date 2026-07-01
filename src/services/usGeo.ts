/**
 * Offline "is this coordinate in the US?" test, used to pick the weather
 * provider (NWS for the US, WeatherAPI elsewhere) without a network round-trip.
 *
 * Uses a coarse (~1 km) bundled outline of the US incl. Alaska & Hawaii and a
 * ray-casting point-in-polygon test. Coarseness near borders is fine: the NWS
 * call falls back to WeatherAPI if a point turns out not to be covered.
 */

import outline from '@/data/usOutline.json';

type Ring = number[][];
type Polygon = Ring[];

const POLYGONS = (outline as { coordinates: Polygon[] }).coordinates;

/** Even-odd ray cast: is (lon,lat) inside this single ring? */
function inRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function isInUSA(lat: number, lon: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  for (const polygon of POLYGONS) {
    // Toggle across the polygon's rings so interior holes are excluded.
    let inside = false;
    for (const ring of polygon) {
      if (inRing(lon, lat, ring)) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
}
