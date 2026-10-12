// Products from the Shopify store, read at build time from its public JSON endpoints.
// (The endpoints send no CORS headers, so browsers can't fetch them; the build can.)
// Prices and stock refresh whenever the site rebuilds.
import {SHOP_URL} from './shop'

export type StoreProduct = {
  title: string
  url: string
  price: string
  available: boolean
  /** Plain-text opening of the product description, trimmed to a couple of sentences. */
  blurb: string
  image?: {src: string; width: number; height: number}
}

export type StoreCollection = {
  handle: string
  title: string
  url: string
  products: StoreProduct[]
}

type RawProduct = {
  title: string
  handle: string
  body_html?: string
  images: {src: string; width: number; height: number}[]
  variants: {price: string; available?: boolean}[]
}

type RawCollection = {handle: string; title: string}

// Shopify's built-in homepage collection isn't a real grouping of the work.
const HIDDEN = new Set(['frontpage'])
// Collections listed first on the shop page, in this order; the rest follow in store order.
const FIRST = ['migumags']

const blurbOf = (html = '', max = 240) => {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length <= max ? text : text.slice(0, text.lastIndexOf(' ', max)) + '…'
}

const money = new Intl.NumberFormat('en-AU', {style: 'currency', currency: 'AUD'})

const toProduct = (p: RawProduct): StoreProduct => {
  const prices = p.variants.map((v) => Number(v.price))
  const low = Math.min(...prices)
  const img = p.images[0]
  return {
    title: p.title,
    url: `${SHOP_URL}/products/${p.handle}`,
    price: (prices.some((x) => x !== low) ? 'From ' : '') + money.format(low),
    blurb: blurbOf(p.body_html),
    // The single-product endpoint omits `available`; treat missing as in stock.
    available: p.variants.some((v) => v.available !== false),
    image: img && {src: `${img.src}${img.src.includes('?') ? '&' : '?'}width=900`, width: img.width, height: img.height},
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${SHOP_URL}${path}`)
  if (!res.ok) throw new Error(`${path}: ${res.status}`)
  return (await res.json()) as T
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  try {
    const {products} = await getJson<{products: RawProduct[]}>('/products.json?limit=250')
    return products.map(toProduct)
  } catch (e) {
    // A store hiccup shouldn't fail the whole site build; the page falls back to a link.
    console.warn(`[shop] could not load products: ${e}`)
    return []
  }
}

export async function getStoreProduct(handle: string): Promise<StoreProduct | undefined> {
  try {
    const {product} = await getJson<{product: RawProduct}>(`/products/${handle}.json`)
    return toProduct(product)
  } catch (e) {
    console.warn(`[shop] could not load product ${handle}: ${e}`)
    return undefined
  }
}

export async function getStoreCollections(): Promise<StoreCollection[]> {
  try {
    const {collections} = await getJson<{collections: RawCollection[]}>('/collections.json?limit=250')
    const rank = (h: string) => (FIRST.includes(h) ? FIRST.indexOf(h) : FIRST.length)
    const shown = collections.filter((c) => !HIDDEN.has(c.handle)).sort((a, b) => rank(a.handle) - rank(b.handle))
    const filled = await Promise.all(
      shown.map(async (c) => {
        const {products} = await getJson<{products: RawProduct[]}>(`/collections/${c.handle}/products.json?limit=250`)
        return {handle: c.handle, title: c.title, url: `${SHOP_URL}/collections/${c.handle}`, products: products.map(toProduct)}
      }),
    )
    // Empty collections sink to the bottom (stable sort keeps the order above otherwise).
    return filled.sort((a, b) => Number(a.products.length === 0) - Number(b.products.length === 0))
  } catch (e) {
    console.warn(`[shop] could not load collections: ${e}`)
    return []
  }
}
