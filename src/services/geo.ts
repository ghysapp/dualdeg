/**
 * Offline "is this coordinate in <region>?" tests, used to pick a national
 * weather provider without a network round-trip. Each region is a coarse
 * (~1 km) bundled MultiPolygon; coarseness near borders is fine because the
 * chosen provider falls back to WeatherAPI when a point isn't actually covered.
 *
 * To add a country: generate its outline (scripts/genOutlines.js) and add it to
 * REGIONS below.
 */

import austriaOutline from '@/data/austriaOutline.json';
import belgiumOutline from '@/data/belgiumOutline.json';
import czechiaOutline from '@/data/czechiaOutline.json';
import denmarkOutline from '@/data/denmarkOutline.json';
import finlandOutline from '@/data/finlandOutline.json';
import franceOutline from '@/data/franceOutline.json';
import germanyOutline from '@/data/germanyOutline.json';
import irelandOutline from '@/data/irelandOutline.json';
import italyOutline from '@/data/italyOutline.json';
import netherlandsOutline from '@/data/netherlandsOutline.json';
import norwayOutline from '@/data/norwayOutline.json';
import polandOutline from '@/data/polandOutline.json';
import portugalOutline from '@/data/portugalOutline.json';
import spainOutline from '@/data/spainOutline.json';
import swedenOutline from '@/data/swedenOutline.json';
import switzerlandOutline from '@/data/switzerlandOutline.json';
import ukOutline from '@/data/ukOutline.json';
import usOutline from '@/data/usOutline.json';

type Ring = number[][];
type Polygon = Ring[];
interface Outline {
  coordinates: Polygon[];
}

const REGIONS: Record<string, Outline> = {
  us: usOutline as Outline,
  france: franceOutline as Outline,
  germany: germanyOutline as Outline,
  norway: norwayOutline as Outline,
  sweden: swedenOutline as Outline,
  denmark: denmarkOutline as Outline,
  finland: finlandOutline as Outline,
  uk: ukOutline as Outline,
  ireland: irelandOutline as Outline,
  netherlands: netherlandsOutline as Outline,
  belgium: belgiumOutline as Outline,
  switzerland: switzerlandOutline as Outline,
  austria: austriaOutline as Outline,
  italy: italyOutline as Outline,
  spain: spainOutline as Outline,
  portugal: portugalOutline as Outline,
  poland: polandOutline as Outline,
  czechia: czechiaOutline as Outline,
};

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

function inOutline(lat: number, lon: number, outline: Outline): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  for (const polygon of outline.coordinates) {
    // Toggle across the polygon's rings so interior holes are excluded.
    let inside = false;
    for (const ring of polygon) {
      if (inRing(lon, lat, ring)) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
}

/** Is the coordinate inside the named region (see REGIONS keys)? */
export function isInRegion(key: string, lat: number, lon: number): boolean {
  const outline = REGIONS[key];
  return outline ? inOutline(lat, lon, outline) : false;
}

export const isInUSA = (lat: number, lon: number) => isInRegion('us', lat, lon);
export const isInFrance = (lat: number, lon: number) => isInRegion('france', lat, lon);
export const isInGermany = (lat: number, lon: number) => isInRegion('germany', lat, lon);
