// Precomputes which 2°×2° cells are land, and which of those belong to the
// highlighted countries, for the "blocks" and "dots" globe styles. Output is
// compact bitstrings so the browser needn't test points against coastlines.
// Run: node scripts/landgrid.mjs
import fs from 'node:fs'
import {geoCentroid, geoContains} from 'd3-geo'
import {feature} from 'topojson-client'

const land = feature(...load('land-110m', 'land'))
const [countries, obj] = load('countries-110m', 'countries')
const country = (id) => feature(countries, {type: 'GeometryCollection', geometries: obj.geometries.filter((g) => g.id === id)})
const au = country('036')
const ph = country('608')

const STEP = 2
const cols = 360 / STEP
const rows = 180 / STEP
const cellOf = ([lng, lat]) => Math.floor((90 - lat) / STEP) * cols + Math.floor((lng + 180) / STEP)

const isLand = new Uint8Array(cols * rows)
const isAU = new Uint8Array(cols * rows)
const isPH = new Uint8Array(cols * rows)
for (let r = 0; r < rows; r++) {
  const lat = 90 - STEP * (r + 0.5)
  for (let c = 0; c < cols; c++) {
    const p = [-180 + STEP * (c + 0.5), lat]
    const i = r * cols + c
    isLand[i] = geoContains(land, p) ? 1 : 0
    isAU[i] = geoContains(au, p) ? 1 : 0
    isPH[i] = geoContains(ph, p) ? 1 : 0
  }
}
// Small islands can fall between cell centres; give each Philippine island
// at least the cell its centre sits in, so the country never disappears.
for (const poly of ph.features[0].geometry.coordinates) {
  const i = cellOf(geoCentroid({type: 'Polygon', coordinates: poly}))
  isPH[i] = isLand[i] = 1
}
for (let i = 0; i < isLand.length; i++) if (isAU[i] || isPH[i]) isLand[i] = 1

// Pack 6 bits per char (base64 alphabet).
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const pack = (bits) => {
  let s = ''
  for (let i = 0; i < bits.length; i += 6) {
    let v = 0
    for (let j = 0; j < 6; j++) v = (v << 1) | (bits[i + j] ?? 0)
    s += A[v]
  }
  return s
}
fs.writeFileSync('src/lib/landgrid.json', JSON.stringify({step: STEP, cols, rows, bits: pack(isLand), au: pack(isAU), ph: pack(isPH)}) + '\n')
const n = (b) => b.reduce((s, v) => s + v, 0)
console.log(`land ${n(isLand)}, australia ${n(isAU)}, philippines ${n(isPH)} cells`)

function load(file, key) {
  const t = JSON.parse(fs.readFileSync(`node_modules/world-atlas/${file}.json`, 'utf8'))
  return [t, t.objects[key]]
}
