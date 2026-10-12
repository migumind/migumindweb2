// The sticker set used across the site: the stickers uploaded in the studio ("Event stickers"),
// or the built-in Migumind set when none are uploaded. Uploads often sit in a big transparent
// canvas, so each one is trimmed to its visible edges (Sanity crops it via `rect`).
import sharp from 'sharp'
import {getStickers} from './sanity'
import {urlFor} from './image'
import DEFAULTS from './stickers.json'

export type StickerImg = {src: string; w: number; h: number; size: number}

const PROBE = 256

/** The visible box of a transparent sticker, in source pixels; undefined when there's nothing to trim. */
async function visibleRect(probeUrl: string, w: number, h: number) {
  const buf = Buffer.from(await (await fetch(probeUrl)).arrayBuffer())
  const img = sharp(buf).ensureAlpha()
  const {data} = await img.clone().raw().toBuffer({resolveWithObject: true})
  if (data[3] !== 0) return undefined // opaque corner: a full-bleed sticker, leave it whole
  const {info} = await img.trim({threshold: 1}).toBuffer({resolveWithObject: true})
  const k = w / (await sharp(buf).metadata()).width!
  const x = Math.max(0, Math.floor(-(info.trimOffsetLeft ?? 0) * k) - 2)
  const y = Math.max(0, Math.floor(-(info.trimOffsetTop ?? 0) * k) - 2)
  const rw = Math.min(w - x, Math.ceil(info.width * k) + 4)
  const rh = Math.min(h - y, Math.ceil(info.height * k) + 4)
  return rw < w * 0.97 || rh < h * 0.97 ? {x, y, w: rw, h: rh} : undefined
}

async function load(): Promise<StickerImg[]> {
  const uploaded = (await getStickers().catch(() => null)) ?? []
  if (!uploaded.length) return DEFAULTS.map((d) => ({...d, size: 1}))
  return Promise.all(
    uploaded.map(async (s) => {
      const m = s.asset?._ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
      const w = m ? +m[1] : 400
      const h = m ? +m[2] : 300
      const r = await visibleRect(urlFor(s).width(PROBE).format('png').url(), w, h).catch(() => undefined)
      const base = r ? urlFor(s).rect(r.x, r.y, r.w, r.h) : urlFor(s)
      return {src: base.width(480).fit('max').auto('format').url(), w: r?.w ?? w, h: r?.h ?? h, size: s.size ?? 1}
    }),
  )
}

// One fetch per build, shared by every page and component that shows stickers.
let cached: Promise<StickerImg[]> | undefined
export const getStickerSet = () => (cached ??= load())

/** Width that gives stickers of any shape a similar visual weight: `base` is the width of a square one. */
export const stickerWidth = (s: StickerImg, base: number) =>
  Math.round(base * Math.min(1.9, Math.max(0.6, Math.sqrt(s.w / s.h))) * s.size)
