import {sanityClient} from 'sanity:client'

export const CATS: [string, string][] = [
  ['all', 'All'],
  ['paintings', 'Paintings'],
  ['drawings', 'Drawings'],
  ['prints', 'Prints'],
  ['commissions', 'Commissions'],
  ['live', 'Live work'],
  ['other', 'Other'],
]

export const STATUS: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  private: 'Private collection',
  commissioned: 'Commissioned',
  nfs: 'Not for sale',
}

export type Artwork = {
  _id: string
  title: string
  slug: string
  year?: string
  medium?: string
  dimensions?: string
  status?: string
  category: string
  gridWidth?: number
  image?: {asset?: {_ref?: string}}
  description?: any[]
  exhibition?: {title: string; slug: string; number?: string; accent?: string}
  studioEntries?: {title: string; slug: string}[]
}

const ARTWORK_FIELDS = `
  _id, title, year, medium, dimensions, status, category, gridWidth, image, description,
  "slug": slug.current,
  "exhibition": exhibition->{title, number, accent, "slug": slug.current},
  "studioEntries": studioEntries[]->{title, "slug": slug.current}
`

export const getArtworks = () =>
  sanityClient.fetch<Artwork[]>(
    `*[_type == "artwork" && defined(slug.current)]|order(order asc, title asc){${ARTWORK_FIELDS}}`,
  )

export type Exhibition = {
  _id: string
  title: string
  slug: string
  number?: string
  accent?: string
  bandText?: 'dark' | 'light'
  year?: string
  dates?: string
  location?: string
  collaborators?: string
  statement?: any[]
  heroImage?: {asset?: {_ref?: string}}
  installationImages?: {asset?: {_ref?: string}}[]
}

const EXHIBITION_FIELDS = `
  _id, title, number, accent, bandText, year, dates, location, collaborators,
  statement, heroImage, installationImages,
  "slug": slug.current
`

export const getExhibitions = () =>
  sanityClient.fetch<Exhibition[]>(
    `*[_type == "exhibition" && defined(slug.current)]|order(order asc, number asc, title asc){${EXHIBITION_FIELDS}}`,
  )

export const getArtworksByExhibition = (exhibitionId: string) =>
  sanityClient.fetch<Artwork[]>(
    `*[_type == "artwork" && exhibition._ref == $exhibitionId && defined(slug.current)]|order(order asc, title asc){${ARTWORK_FIELDS}}`,
    {exhibitionId},
  )

export type StudioEntry = {
  _id: string
  title: string
  slug: string
  date?: string
  category?: string
  materials?: string
  description?: any[]
  image?: {asset?: {_ref?: string}}
  relatedArtwork?: {title: string; slug: string}
}

const STUDIO_FIELDS = `
  _id, title, date, category, materials, description, image,
  "slug": slug.current,
  "relatedArtwork": *[_type == "artwork" && references(^._id)][0]{title, "slug": slug.current}
`

export const getStudioEntries = () =>
  sanityClient.fetch<StudioEntry[]>(
    `*[_type == "studioEntry" && defined(slug.current)]|order(date desc, title asc){${STUDIO_FIELDS}}`,
  )

export type Sketchbook = {
  _id: string
  title?: string
  date?: string
  sheets?: {_key: string; caption?: string; asset?: {_ref?: string}}[]
}

export const getSketchbooks = () =>
  sanityClient.fetch<Sketchbook[]>(
    `*[_type == "sketchbook"]|order(date desc){_id, title, date, sheets[]{_key, caption, asset}}`,
  )

/** ISO date -> "12 MAR 2026", matching the uppercase mono captions in the design. */
export function formatDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d
    .toLocaleDateString('en-AU', {day: '2-digit', month: 'short', year: 'numeric'})
    .toUpperCase()
}

export type HomePage = {
  portrait?: {asset?: {_ref?: string}}
  portraitAlt?: string
  portraitCaption?: string
  statementHeading?: string
  statement?: any[]
}

export const getHomePage = () =>
  sanityClient.fetch<HomePage | null>(
    `*[_type == "homePage"][0]{portrait, portraitAlt, portraitCaption, statementHeading, statement}`,
  )
