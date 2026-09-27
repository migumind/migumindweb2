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
  heroVideo?: {asset?: {url?: string; mimeType?: string}}
  installationImages?: {asset?: {_ref?: string}}[]
}

const EXHIBITION_FIELDS = `
  _id, title, number, accent, bandText, year, dates, location, collaborators,
  statement, heroImage, heroVideo{asset->{url, mimeType}}, "installationImages": installationImages[defined(asset)],
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
    `*[_type == "sketchbook"]|order(date desc){_id, title, date, "sheets": sheets[defined(asset)]{_key, caption, asset}}`,
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

export type HeroSlide = {
  _key?: string
  image?: {asset?: {_ref?: string}}
  video?: {asset?: {url?: string; mimeType?: string}}
  alt?: string
  caption?: string
}

export type HomePage = {
  track?: {asset?: {url?: string; mimeType?: string}}
  introVideo?: {asset?: {url?: string; mimeType?: string}}
  introPoster?: {asset?: {_ref?: string}}
  heroSlides?: HeroSlide[]
  statementHeading?: string
  statement?: any[]
}

export const getHomePage = () =>
  sanityClient.fetch<HomePage | null>(
    `*[_type == "homePage"][0]{
      track{asset->{url, mimeType}}, introVideo{asset->{url, mimeType}}, introPoster,
      heroSlides[defined(image.asset)]{_key, image, video{asset->{url, mimeType}}, alt, caption},
      statementHeading, statement
    }`,
  )

export type EventItem = {
  _id: string
  title: string
  slug: string
  date?: string
  location?: string
  description?: any[]
  images?: {_key?: string; asset?: {_ref?: string}}[]
}

export const getEvents = () =>
  sanityClient.fetch<EventItem[]>(
    `*[_type == "event" && defined(slug.current)]|order(order asc, date desc){
      _id, title, date, location, description, images[defined(asset)]{_key, asset},
      "slug": slug.current
    }`,
  )
