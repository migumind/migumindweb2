// Precomputes the globe's vector shapes into src/lib/globe-shapes.json:
//   angular  — low-poly land plus highlighted countries, all simplified from
//              one topology so the country edges line up with the coast
//   detailed — the highlighted countries at full 1:110m detail
// Run: node scripts/globe-shapes.mjs  (then node scripts/landgrid.mjs)
import fs from 'node:fs'
import {feature, merge} from 'topojson-client'
import {presimplify, quantile, simplify, filter, sphericalRingArea, sphericalTriangleArea} from 'topojson-simplify'

// Share of coastline points kept for the angular style. Lower = more angular.
const KEEP = 0.16
// Islands smaller than this (steradians) are dropped, except near KEEP_NEAR.
const MIN_ISLAND = 1.2e-3
// Countries drawn in their own colour (ISO 3166 numeric ids).
export const HIGHLIGHT = {au: '036', ph: '608'}
// Always keep every Philippine island, however small.
const KEEP_NEAR = ([lng, lat]) => lng > 116 && lng < 127.5 && lat > 4 && lat < 21.5

const raw = fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8')

// --- angular ---
const pre = presimplify(JSON.parse(raw), sphericalTriangleArea)
const simp = simplify(pre, quantile(pre, KEEP))
const kept = filter(simp, (ring, interior) => {
  if (interior) return true
  // \`ring\` is arc indexes; decode it the way topojson-simplify's filterWeight does.
  const coords = feature(simp, {type: 'Polygon', arcs: [ring]}).geometry.coordinates[0]
  return KEEP_NEAR(coords[0]) || sphericalRingArea(coords, false) >= MIN_ISLAND
})
const geoms = kept.objects.countries.geometries
const pick = (id) => feature(kept, {type: 'GeometryCollection', geometries: geoms.filter((g) => g.id === id)})
// Rounding to 0.01° keeps the file small without visibly moving anything.
const round = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v)))
const angular = {
  land: round(merge(kept, geoms.filter((g) => g.type))),
  au: round(pick(HIGHLIGHT.au)),
  ph: round(pick(HIGHLIGHT.ph)),
}

// --- detailed ---
const full = JSON.parse(raw)
const fullGeoms = full.objects.countries.geometries
const pickFull = (id) => feature(full, {type: 'GeometryCollection', geometries: fullGeoms.filter((g) => g.id === id)})
const detailed = {au: round(pickFull(HIGHLIGHT.au)), ph: round(pickFull(HIGHLIGHT.ph))}

const out = JSON.stringify({angular, detailed})
fs.writeFileSync('src/lib/globe-shapes.json', out + '\n')
const pts = (g) => JSON.stringify(g).split('],[').length
console.log(`angular land ~${pts(angular.land)} pts, ph rings ${angular.ph.features[0]?.geometry.coordinates.length}; ${(out.length / 1024).toFixed(1)} KB`)
