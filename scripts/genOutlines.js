/**
 * Dev-only: generate compact country outlines for offline point-in-polygon
 * provider selection. Source: Natural Earth 110m via world-atlas; simplified by
 * rounding to 2 decimals (~1 km), which is plenty for "is this in <country>?"
 * given the fallback to WeatherAPI.
 *
 *   node scripts/genOutlines.js
 *
 * To add a country: add an entry to REGIONS (match by NE `name`, id fallback).
 */
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const topo = require('world-atlas/countries-110m.json');

const REGIONS = [
  { file: 'usOutline.json', name: 'United States of America', id: '840' },
  { file: 'franceOutline.json', name: 'France', id: '250' },
  { file: 'germanyOutline.json', name: 'Germany', id: '276' },
  // Served by MET Norway (single-timezone countries).
  { file: 'norwayOutline.json', name: 'Norway' },
  { file: 'swedenOutline.json', name: 'Sweden' },
  { file: 'denmarkOutline.json', name: 'Denmark' },
  { file: 'finlandOutline.json', name: 'Finland' },
  { file: 'ukOutline.json', name: 'United Kingdom' },
  { file: 'irelandOutline.json', name: 'Ireland' },
  { file: 'netherlandsOutline.json', name: 'Netherlands' },
  { file: 'belgiumOutline.json', name: 'Belgium' },
  { file: 'switzerlandOutline.json', name: 'Switzerland' },
  { file: 'austriaOutline.json', name: 'Austria' },
  { file: 'italyOutline.json', name: 'Italy' },
  { file: 'spainOutline.json', name: 'Spain' },
  { file: 'portugalOutline.json', name: 'Portugal' },
  { file: 'polandOutline.json', name: 'Poland' },
  { file: 'czechiaOutline.json', name: 'Czechia' },
];

const fc = topojson.feature(topo, topo.objects.countries);
const r = (n) => Math.round(n * 100) / 100;

function cleanRing(ring) {
  const out = [];
  for (const [x, y] of ring) {
    const p = [r(x), r(y)];
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
  }
  return out;
}

for (const region of REGIONS) {
  const feat = fc.features.find(
    (f) => f.properties?.name === region.name || String(f.id) === region.id,
  );
  if (!feat) throw new Error(`Feature not found: ${region.name}`);

  const geom = feat.geometry;
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  const coordinates = polys
    .map((poly) => poly.map(cleanRing).filter((ring) => ring.length >= 4))
    .filter((poly) => poly.length > 0);

  const dest = path.join(__dirname, '..', 'src', 'data', region.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify({ type: 'MultiPolygon', coordinates }));

  const pts = coordinates.reduce((s, p) => s + p.reduce((t, ring) => t + ring.length, 0), 0);
  console.log(`${region.file}: polygons=${coordinates.length} points=${pts} bytes=${fs.statSync(dest).size}`);
}
