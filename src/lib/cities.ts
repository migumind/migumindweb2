// Fallback pin positions so an event lands on the globe from its city (or its
// venue text) without anyone typing coordinates. Exact coordinates set in the
// studio always win. Add cities here as the event list grows.
const CITIES: Record<string, [number, number]> = {
  sydney: [-33.8688, 151.2093], melbourne: [-37.8136, 144.9631], brisbane: [-27.4698, 153.0251],
  perth: [-31.9523, 115.8613], adelaide: [-34.9285, 138.6007], canberra: [-35.2809, 149.13],
  hobart: [-42.8821, 147.3272], darwin: [-12.4634, 130.8456], 'gold coast': [-28.0167, 153.4],
  newcastle: [-32.9283, 151.7817], wollongong: [-34.4278, 150.8931], 'byron bay': [-28.6474, 153.602],
  'blue mountains': [-33.7, 150.3], katoomba: [-33.7125, 150.3119], parramatta: [-33.815, 151.0011],
  auckland: [-36.8485, 174.7633], wellington: [-41.2865, 174.7762], christchurch: [-43.532, 172.6306],
  manila: [14.5995, 120.9842], 'quezon city': [14.676, 121.0437], cebu: [10.3157, 123.8854], makati: [14.5547, 121.0244],
  tokyo: [35.6762, 139.6503], osaka: [34.6937, 135.5023], kyoto: [35.0116, 135.7681], seoul: [37.5665, 126.978],
  'hong kong': [22.3193, 114.1694], taipei: [25.033, 121.5654], shanghai: [31.2304, 121.4737], beijing: [39.9042, 116.4074],
  singapore: [1.3521, 103.8198], bangkok: [13.7563, 100.5018], 'kuala lumpur': [3.139, 101.6869], jakarta: [-6.2088, 106.8456],
  bali: [-8.3405, 115.092], 'ho chi minh': [10.8231, 106.6297], hanoi: [21.0278, 105.8342], mumbai: [19.076, 72.8777],
  delhi: [28.7041, 77.1025], dubai: [25.2048, 55.2708],
  london: [51.5072, -0.1276], paris: [48.8566, 2.3522], berlin: [52.52, 13.405], amsterdam: [52.3676, 4.9041],
  barcelona: [41.3874, 2.1686], madrid: [40.4168, -3.7038], lisbon: [38.7223, -9.1393], rome: [41.9028, 12.4964],
  milan: [45.4642, 9.19], vienna: [48.2082, 16.3738], copenhagen: [55.6761, 12.5683], stockholm: [59.3293, 18.0686],
  dublin: [53.3498, -6.2603], glasgow: [55.8642, -4.2518], manchester: [53.4808, -2.2426], brussels: [50.8503, 4.3517],
  zurich: [47.3769, 8.5417], prague: [50.0755, 14.4378], mainz: [49.9929, 8.2473],
  'new york': [40.7128, -74.006], brooklyn: [40.6782, -73.9442], 'los angeles': [34.0522, -118.2437],
  'san francisco': [37.7749, -122.4194], chicago: [41.8781, -87.6298], miami: [25.7617, -80.1918],
  seattle: [47.6062, -122.3321], portland: [45.5152, -122.6784], austin: [30.2672, -97.7431],
  toronto: [43.6532, -79.3832], montreal: [45.5019, -73.5674], vancouver: [49.2827, -123.1207],
  'mexico city': [19.4326, -99.1332], 'sao paulo': [-23.5505, -46.6333], 'rio de janeiro': [-22.9068, -43.1729],
  'buenos aires': [-34.6037, -58.3816], bogota: [4.711, -74.0721], lima: [-12.0464, -77.0428], santiago: [-33.4489, -70.6693],
  'cape town': [-33.9249, 18.4241], johannesburg: [-26.2041, 28.0473], lagos: [6.5244, 3.3792], nairobi: [-1.2921, 36.8219],
  cairo: [30.0444, 31.2357], marrakech: [31.6295, -7.9811],
}

const title = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase())
// Longest names first so "new york" wins over "york"-style partial matches.
const NAMES = Object.keys(CITIES).sort((a, b) => b.length - a.length)

export type Geo = {lat: number; lng: number; city?: string}

export function resolveGeo(e: {
  city?: string
  location?: string
  coordinates?: {lat?: number; lng?: number}
}): Geo | undefined {
  const text = `${e.city ?? ''} ${e.location ?? ''}`.toLowerCase()
  const found = NAMES.find((n) => new RegExp(`\\b${n}\\b`).test(text))
  const city = e.city || (found ? title(found) : undefined)
  const c = e.coordinates
  if (c && typeof c.lat === 'number' && typeof c.lng === 'number') return {lat: c.lat, lng: c.lng, city}
  if (found) return {lat: CITIES[found][0], lng: CITIES[found][1], city}
  return undefined
}
