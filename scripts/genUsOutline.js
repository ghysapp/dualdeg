/**
 * Dev-only: generate a compact US (incl. AK/HI) outline for offline
 * point-in-polygon provider selection. Source: Natural Earth 110m via
 * world-atlas; simplified by rounding to 2 decimals (~1 km), which is plenty
 * for "is this in the US?" given the NWS→WeatherAPI fallback.
 *
 *   node scripts/genUsOutline.js
 */
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const topo = require('world-atlas/countries-110m.json');

const fc = topojson.feature(topo, topo.objects.countries);
const usa = fc.features.find((f) => f.id === '840');
if (!usa) throw new Error('USA feature (id 840) not found');

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

const coordinates = usa.geometry.coordinates
  .map((poly) => poly.map(cleanRing).filter((ring) => ring.length >= 4))
  .filter((poly) => poly.length > 0);

const out = { type: 'MultiPolygon', coordinates };
const dest = path.join(__dirname, '..', 'src', 'data', 'usOutline.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out));

const pts = coordinates.reduce((s, poly) => s + poly.reduce((t, r2) => t + r2.length, 0), 0);
console.log(`wrote ${dest}`);
console.log(`polygons=${coordinates.length} points=${pts} bytes=${fs.statSync(dest).size}`);
