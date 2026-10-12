// Pixel drawings from the contact page. A drawing is a 16×16 grid of palette
// indices, packed into a short text code (one character per pixel, version
// prefix first) so it can ride along in an email link and be redrawn at
// /contact/drawing/#<code> with no server involved.

export const SIZE = 16

// 0 is empty; the rest are the site's colours plus skin, sky and white.
export const PALETTE = [
  'transparent',
  '#141613', // ink
  '#F4F1E8', // paper
  '#EE4B1B', // vermilion
  '#EFB100', // mustard
  '#1E4436', // forest
  '#8B9F8C', // sage
  '#2A31C8', // cobalt
  '#AE96DE', // lavender
  '#FF3B92', // fluor
  '#C68A5A', // skin
  '#7CC6F2', // sky
]

const CHARS = '0123456789ab'
const VERSION = '1'

export const encode = (px: number[]) => VERSION + px.map((i) => CHARS[i] ?? '0').join('')

export function decode(code: string): number[] | null {
  const body = code.replace(/^#/, '')
  if (body[0] !== VERSION || body.length !== SIZE * SIZE + 1) return null
  const px = [...body.slice(1)].map((c) => CHARS.indexOf(c))
  return px.every((i) => i >= 0) ? px : null
}

/** Paint a drawing onto a canvas at `scale` pixels per cell (empty cells stay transparent). */
export function paint(canvas: HTMLCanvasElement, px: number[], scale = 1) {
  canvas.width = canvas.height = SIZE * scale
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  px.forEach((i, n) => {
    if (!i) return
    ctx.fillStyle = PALETTE[i]
    ctx.fillRect((n % SIZE) * scale, Math.floor(n / SIZE) * scale, scale, scale)
  })
}
