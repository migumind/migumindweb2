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
