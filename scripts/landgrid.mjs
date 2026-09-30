// Precomputes which 2°×2° cells are land, for the "blocks" and "dots" globe
// styles. Output is a compact bitstring so the browser needn't test points
// against coastlines. Run: node scripts/landgrid.mjs
import fs from 'node:fs'
import {geoContains} from 'd3-geo'
import {feature} from 'topojson-client'

const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'))
const land = feature(topo, topo.objects.land)
const STEP = 2
const cols = 360 / STEP
const rows = 180 / STEP
let bits = ''
for (let r = 0; r < rows; r++) {
  const lat = 90 - STEP * (r + 0.5)
  for (let c = 0; c < cols; c++) {
    const lng = -180 + STEP * (c + 0.5)
    bits += geoContains(land, [lng, lat]) ? '1' : '0'
  }
}
// Pack 6 bits per char (base64 alphabet).
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
let packed = ''
for (let i = 0; i < bits.length; i += 6) packed += A[parseInt(bits.slice(i, i + 6).padEnd(6, '0'), 2)]
fs.writeFileSync('src/lib/landgrid.json', JSON.stringify({step: STEP, cols, rows, bits: packed}) + '\n')
console.log(`${bits.split('').filter((b) => b === '1').length} land cells of ${bits.length}, ${packed.length} chars`)
