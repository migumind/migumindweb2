// Generates the default sticker set shown behind the events globe.
// These are fallbacks: stickers uploaded in the studio ("Event stickers")
// replace them. Run: node scripts/stickers.cjs
//
// Rendered with system fonts (Windows: Arial Black, Impact, Showcard Gothic,
// Brush Script) and committed as WebP, so the build never needs these fonts.
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const OUT = path.join(__dirname, '..', 'public', 'events', 'stickers')
const INK = '#141613'
const PAPER = '#F4F1E8'
const DIE = 14 // white die-cut border width

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const T = (x, y, s, size, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.font || 'Arial Black'}" font-size="${size}" font-weight="${o.weight || 900}" fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 6}" paint-order="stroke" stroke-linejoin="round"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.italic ? ' font-style="italic"' : ''}${o.tf ? ` transform="${o.tf}"` : ''}${o.len ? ` textLength="${o.len}" lengthAdjust="spacingAndGlyphs"` : ''}>${esc(s)}</text>`
const die = (shape) => shape.replace(/\/>$/, ` fill="#fff" stroke="#fff" stroke-width="${DIE * 2}" stroke-linejoin="round"/>`)

// Lat/long grid clipped to an ellipse: the recurring globe motif.
function globeLines(cx, cy, rx, ry, stroke, sw = 4) {
  let s = ''
  for (let i = 1; i < 6; i++) {
    const y = cy - ry + (2 * ry * i) / 6
    const half = rx * Math.sqrt(1 - ((y - cy) / ry) ** 2)
    s += `<line x1="${cx - half}" y1="${y}" x2="${cx + half}" y2="${y}" stroke="${stroke}" stroke-width="${sw}"/>`
  }
  for (let i = 1; i < 6; i++) {
    const w = Math.abs(rx * Math.cos((Math.PI * i) / 6))
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="${ry}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`
  }
  return s + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`
}

const S = []
const add = (name, w, h, body) => S.push({name, w, h, body})

// 1. Yellow script oval
add('script-oval-yellow', 560, 300, `
  ${die('<ellipse cx="280" cy="140" rx="250" ry="115"/>')}
  ${die('<rect x="70" y="250" width="420" height="36" rx="6"/>')}
  <ellipse cx="280" cy="140" rx="250" ry="115" fill="#E8D33A" stroke="${INK}" stroke-width="12"/>
  ${T(282, 178, 'Migumind', 128, {font: 'Brush Script MT', weight: 400, stroke: INK, sw: 4})}
  ${T(508, 44, '®', 36, {font: 'Arial'})}
  ${T(280, 280, '©2026 BASED IN SYDNEY', 26, {font: 'Arial Black'})}`)

// 2. White oval, red stripe
add('stripe-oval', 560, 280, `
  ${die('<ellipse cx="280" cy="140" rx="255" ry="118"/>')}
  <clipPath id="c2"><ellipse cx="280" cy="140" rx="255" ry="118"/></clipPath>
  <ellipse cx="280" cy="140" rx="255" ry="118" fill="${PAPER}"/>
  <g clip-path="url(#c2)"><rect x="0" y="70" width="560" height="26" fill="#E8492A"/><rect x="0" y="184" width="560" height="26" fill="#E8492A"/></g>
  <ellipse cx="280" cy="140" rx="255" ry="118" fill="none" stroke="${INK}" stroke-width="12"/>
  ${T(280, 162, 'MIGUMIND', 70, {font: 'Arial Black', len: 400})}`)

// 3. Blue dotted bubble oval
add('bubble-oval-blue', 560, 300, `
  ${die('<ellipse cx="280" cy="150" rx="262" ry="132"/>')}
  <ellipse cx="280" cy="150" rx="262" ry="132" fill="${PAPER}"/>
  <ellipse cx="280" cy="150" rx="246" ry="116" fill="none" stroke="${INK}" stroke-width="9" stroke-dasharray="0 22" stroke-linecap="round"/>
  <ellipse cx="280" cy="150" rx="222" ry="98" fill="${INK}"/>
  <ellipse cx="280" cy="150" rx="210" ry="86" fill="#2E5BD8"/>
  ${T(282, 190, 'MGMD', 118, {font: 'Showcard Gothic', weight: 400, fill: '#fff', stroke: INK, sw: 12})}
  ${T(532, 40, 'TM', 26)}`)

// 4. Globe + wordmark
add('globe-live', 560, 330, `
  ${die('<ellipse cx="280" cy="130" rx="250" ry="112"/>')}
  ${die('<rect x="30" y="226" width="500" height="86" rx="10"/>')}
  <ellipse cx="280" cy="130" rx="250" ry="112" fill="${PAPER}" stroke="${INK}" stroke-width="10"/>
  <clipPath id="c4"><ellipse cx="220" cy="130" rx="110" ry="88"/></clipPath>
  <g clip-path="url(#c4)">${globeLines(220, 130, 110, 88, INK, 6)}</g>
  <g transform="rotate(35 400 130)"><rect x="388" y="40" width="24" height="96" rx="10" fill="${INK}"/><rect x="384" y="132" width="32" height="26" fill="#E8492A" stroke="${INK}" stroke-width="5"/><path d="M386 158 h28 q2 40 -14 56 q-16 -16 -14 -56z" fill="${INK}"/></g>
  ${T(280, 296, 'LIVE PAINTING', 60, {font: 'Arial Black', italic: true, len: 440})}`)

// 5. Property of — black oval
add('property-of', 580, 300, `
  ${die('<ellipse cx="290" cy="150" rx="266" ry="130"/>')}
  <ellipse cx="290" cy="150" rx="266" ry="130" fill="${PAPER}"/>
  <ellipse cx="290" cy="150" rx="252" ry="116" fill="${INK}"/>
  ${T(290, 86, 'Property of', 44, {font: 'Brush Script MT', weight: 400, fill: '#fff'})}
  ${T(290, 176, 'MIGUMIND', 96, {font: 'Impact', weight: 400, fill: '#fff', len: 400})}
  ${T(290, 222, 'WORLDWIDE', 34, {font: 'Arial Black', fill: '#fff', ls: 2})}`)

// 6. Die-cut wordmark, no badge
add('mgmd-cyan', 600, 260, `
  ${T(300, 150, 'MGMD', 160, {font: 'Arial Black', fill: '#fff', stroke: '#fff', sw: DIE * 2 + 16, len: 540})}
  ${T(300, 230, 'WORLDWIDE', 50, {font: 'Arial Black', fill: '#fff', stroke: '#fff', sw: DIE * 2 + 12, len: 380})}
  ${T(306, 156, 'MGMD', 160, {font: 'Arial Black', fill: INK, len: 540})}
  ${T(300, 150, 'MGMD', 160, {font: 'Arial Black', fill: '#35B4E3', stroke: INK, sw: 8, len: 540})}
  ${T(300, 230, 'WORLDWIDE', 50, {font: 'Arial Black', len: 380})}
  ${T(582, 44, 'TM', 24)}`)

// 7. Varsity script — red oval + star
add('varsity-red', 580, 310, `
  ${die('<ellipse cx="280" cy="160" rx="260" ry="125"/>')}
  ${die('<polygon points="505,18 520,56 560,58 528,82 540,120 505,98 470,120 482,82 450,58 490,56"/>')}
  <ellipse cx="280" cy="160" rx="260" ry="125" fill="#E0452B" stroke="${INK}" stroke-width="12"/>
  ${T(286, 184, 'Migumind', 118, {font: 'Brush Script MT', weight: 400, fill: INK})}
  ${T(280, 178, 'Migumind', 118, {font: 'Brush Script MT', weight: 400, fill: '#fff', stroke: INK, sw: 5})}
  <path d="M90 214 q190 40 380 -6" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  ${T(280, 256, 'LIVE ART', 34, {font: 'Arial Black', ls: 3})}
  <polygon points="505,18 520,56 560,58 528,82 540,120 505,98 470,120 482,82 450,58 490,56" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`)

// 8. Green globe oval
add('globe-green', 560, 290, `
  ${die('<ellipse cx="280" cy="145" rx="255" ry="122"/>')}
  <ellipse cx="280" cy="145" rx="255" ry="122" fill="#38D14B" stroke="${INK}" stroke-width="10"/>
  ${globeLines(280, 145, 200, 112, INK, 7)}
  <rect x="70" y="112" width="420" height="66" fill="#38D14B"/>
  ${T(280, 168, 'MIGUMIND', 58, {font: 'Arial Black', len: 390})}`)

// 9. Yellow tag sticker, handstyle
add('tag-yellow', 440, 300, `
  ${die('<rect x="20" y="20" width="400" height="260" rx="6"/>')}
  <rect x="20" y="20" width="400" height="260" fill="#F5D81C" stroke="${INK}" stroke-width="6"/>
  ${T(210, 190, 'MIGU!', 124, {font: 'Ink Free', weight: 700, stroke: INK, sw: 5, tf: 'rotate(-6 210 160)'})}
  ${T(360, 70, '26', 36, {font: 'Ink Free', weight: 700})}
  ${T(330, 250, 'ink..', 30, {font: 'Ink Free', weight: 700})}`)

// 10. Orange signature square
add('signature-orange', 360, 380, `
  ${die('<rect x="20" y="20" width="320" height="340" rx="4"/>')}
  <rect x="20" y="20" width="320" height="340" fill="#F2582C"/>
  ${T(184, 220, 'mp', 220, {font: 'Brush Script MT', weight: 400, fill: '#fff'})}
  <path d="M70 250 q110 30 230 -20" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  ${T(180, 320, 'm.pacheco', 48, {font: 'Brush Script MT', weight: 400, fill: '#fff'})}
  ${T(60, 60, 'MP', 22, {fill: '#fff', anchor: 'start'})}`)

// 11. Black box legends
add('ink-paper-screen', 420, 300, `
  ${die('<rect x="20" y="20" width="380" height="260"/>')}
  <rect x="20" y="20" width="380" height="260" fill="${INK}"/>
  <rect x="34" y="34" width="352" height="232" fill="none" stroke="#fff" stroke-width="5"/>
  ${T(210, 102, 'INK + PAPER', 42, {font: 'Georgia', weight: 700, fill: '#fff', len: 290})}
  ${T(210, 176, '$', 64, {font: 'Arial Black', fill: '#fff'})}
  ${T(210, 244, 'SCREEN', 50, {font: 'Georgia', weight: 700, fill: '#fff', len: 260})}`)

// 12. Round badge
add('round-badge', 320, 320, `
  ${die('<circle cx="160" cy="160" r="140"/>')}
  <circle cx="160" cy="160" r="140" fill="#B8292F" stroke="${INK}" stroke-width="8"/>
  <circle cx="160" cy="160" r="100" fill="${INK}"/>
  <path id="arc12" d="M50 160 a110 110 0 0 1 220 0" fill="none"/>
  <text font-family="Arial Black" font-size="26" fill="#fff" letter-spacing="3"><textPath href="#arc12" startOffset="50%" text-anchor="middle">MIGUMIND STUDIO</textPath></text>
  ${T(160, 184, 'MGMD', 60, {font: 'Arial Black', fill: '#E8D33A'})}
  ${T(160, 238, 'EST. 2024', 18, {fill: '#fff', ls: 2})}`)

// 13. Pink note
add('wet-paint', 300, 260, `
  ${die('<rect x="20" y="20" width="260" height="220" rx="4"/>')}
  <rect x="20" y="20" width="260" height="220" fill="#F7B8CC"/>
  ${T(150, 80, 'WET', 40, {font: 'Arial Black'})}
  ${T(150, 180, 'paint', 84, {font: 'Ink Free', weight: 700, tf: 'rotate(-4 150 160)'})}`)

// 14. Extra ink pill
add('extra-ink', 460, 200, `
  ${die('<rect x="20" y="30" width="420" height="140" rx="70"/>')}
  <rect x="20" y="30" width="420" height="140" rx="70" fill="#E3262E"/>
  <circle cx="92" cy="100" r="46" fill="#fff"/>
  ${T(92, 122, 'M', 58, {fill: '#E3262E'})}
  ${T(290, 96, 'EXTRA', 46, {fill: '#fff', len: 250})}
  ${T(290, 146, 'INK', 56, {fill: '#fff', len: 250})}`)

// 15. Bubble outline letters
add('bubble-migu', 520, 260, `
  ${T(260, 180, 'MIGU', 150, {font: 'Showcard Gothic', weight: 400, fill: '#fff', stroke: '#fff', sw: DIE * 2 + 18})}
  ${T(260, 180, 'MIGU', 150, {font: 'Showcard Gothic', weight: 400, fill: '#fff', stroke: INK, sw: 12})}`)

// 16. Eye
add('eye', 320, 320, `
  ${die('<circle cx="160" cy="160" r="140"/>')}
  <circle cx="160" cy="160" r="140" fill="${INK}"/>
  <path d="M40 160 q120 -110 240 0 q-120 110 -240 0z" fill="#fff"/>
  <circle cx="160" cy="160" r="46" fill="${INK}"/><circle cx="160" cy="160" r="22" fill="#fff"/><circle cx="160" cy="160" r="12" fill="${INK}"/>
  <circle cx="176" cy="146" r="7" fill="#fff"/>`)

// 17. Framed sky
add('framed-sky', 420, 320, `
  ${die('<rect x="20" y="20" width="380" height="280"/>')}
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6FD6"/><stop offset="1" stop-color="#9CC4F2"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9C766"/><stop offset=".5" stop-color="#9C7424"/><stop offset="1" stop-color="#E9C766"/></linearGradient></defs>
  <rect x="20" y="20" width="380" height="280" fill="url(#gold)"/>
  <rect x="44" y="44" width="332" height="232" fill="none" stroke="#6E4F15" stroke-width="4"/>
  <rect x="56" y="56" width="308" height="208" fill="url(#sky)"/>
  <g fill="#fff"><circle cx="150" cy="190" r="40"/><circle cx="200" cy="170" r="52"/><circle cx="256" cy="192" r="40"/><circle cx="296" cy="206" r="28"/><rect x="110" y="196" width="210" height="40" rx="20"/></g>`)

// 18. Hello my name is
add('hello-name', 420, 300, `
  ${die('<rect x="20" y="20" width="380" height="260" rx="22"/>')}
  <rect x="20" y="20" width="380" height="260" rx="22" fill="#2649C9"/>
  <rect x="40" y="110" width="340" height="140" rx="6" fill="#fff"/>
  ${T(210, 70, 'HELLO', 50, {fill: '#fff', ls: 4})}
  ${T(210, 98, 'MY NAME IS', 20, {fill: '#fff', ls: 3})}
  ${T(210, 212, 'Migu', 96, {font: 'Ink Free', weight: 700, tf: 'rotate(-5 210 190)'})}`)

;(async () => {
  fs.mkdirSync(OUT, {recursive: true})
  const manifest = []
  for (const s of S) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w + DIE * 2}" height="${s.h + DIE * 2}" viewBox="-${DIE} -${DIE} ${s.w + DIE * 2} ${s.h + DIE * 2}">${s.body}</svg>`
    const W = s.w + DIE * 2
    const H = s.h + DIE * 2
    await sharp(Buffer.from(svg), {density: 144}).resize({width: W}).webp({quality: 86, alphaQuality: 90}).toFile(path.join(OUT, `${s.name}.webp`))
    manifest.push({src: `/events/stickers/${s.name}.webp`, w: W, h: H})
  }
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'stickers.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(`${manifest.length} stickers -> public/events/stickers`)
})()
