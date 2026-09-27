import {createImageUrlBuilder} from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {sanityClient} from 'sanity:client'

const builder = createImageUrlBuilder(sanityClient)

export const urlFor = (source: SanityImageSource) => builder.image(source)

export type SanityImage = {asset?: {_ref?: string}}

/** Sanity encodes the real pixel dimensions in the asset id: image-<hash>-2394x1287-jpg */
export function ratioOf(image: SanityImage | undefined, fallback = '3 / 2'): string {
  const ref = image?.asset?._ref
  const match = ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
  return match ? `${match[1]} / ${match[2]}` : fallback
}

const DEFAULT_WIDTHS = [400, 640, 900, 1280]

/**
 * Builds a srcset so each device downloads a file sized for it, rather than
 * everyone pulling the desktop-sized one. Sanity keeps the original upload
 * untouched; this only controls what gets delivered.
 */
export function responsive(
  source: SanityImageSource,
  opts: {widths?: number[]; quality?: number; sizes?: string} = {},
) {
  const {widths = DEFAULT_WIDTHS, quality = 75, sizes = '100vw'} = opts
  const at = (w: number) =>
    builder.image(source).width(w).quality(quality).fit('max').auto('format').url()

  return {
    src: at(widths[widths.length - 1]),
    srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    sizes,
  }
}
