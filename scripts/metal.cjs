// Generates the brushed-metal tile behind the sticker wall (a street pole).
// Run: node scripts/metal.cjs
const path = require('path')
const sharp = require('sharp')

const S = 512
let seed = 11
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

// Fine scratches: short, near-vertical, some light and some dark.
let scratches = ''
for (let i = 0; i < 70; i++) {
  const x = rand() * S
  const y = rand() * S
  const len = 20 + rand() * 140
  const ang = (rand() - 0.5) * 0.5
  const light = rand() < 0.6
  scratches += `<line x1="${x}" y1="${y}" x2="${x + Math.sin(ang) * len}" y2="${y + Math.cos(ang) * len}" stroke="${light ? '#fff' : '#000'}" stroke-opacity="${(0.05 + rand() * 0.12).toFixed(2)}" stroke-width="${(0.5 + rand()).toFixed(1)}"/>`
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
  <filter id="brush" x="0" y="0" width="100%" height="100%">
    <!-- High frequency across, very low down: long vertical brush streaks. -->
    <feTurbulence type="fractalNoise" baseFrequency="0.85 0.006" numOctaves="3" seed="4" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .9 0 0 0 0"/>
  </filter>
  <filter id="mottle" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="9" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .3  0 0 0 0 .28  .5 0 0 0 -.12"/>
  </filter>
  <rect width="100%" height="100%" fill="#9EA29C"/>
  <rect width="100%" height="100%" filter="url(#brush)" opacity=".55" style="mix-blend-mode:overlay"/>
  <rect width="100%" height="100%" filter="url(#brush)" opacity=".18"/>
  <rect width="100%" height="100%" filter="url(#mottle)"/>
  ${scratches}
</svg>`

sharp(Buffer.from(svg))
  .webp({quality: 80})
  .toFile(path.join(__dirname, '..', 'public', 'events', 'metal.webp'))
  .then((i) => console.log('metal.webp', i.size, 'bytes'))
