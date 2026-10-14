// A hand-simplified Sydney for the globe's city view: one angular land outline
// (coast, the harbour up the Parramatta River, Middle Harbour, the Lane Cove
// River, Botany Bay and the Georges River) plus a few place names. Natural
// Earth's coastlines are too coarse at this scale to show the harbour at all.
// Points are [lng, lat], traced clockwise from the map's north-west corner.

export const SYDNEY = {
  /** [west, south, east, north] */
  bbox: [150.9, -34.08, 151.36, -33.7] as [number, number, number, number],
  center: [151.13, -33.89] as [number, number],
  land: [
    [150.9, -33.7], [151.305, -33.7],
    // northern beaches down to North Head
    [151.3, -33.75], [151.295, -33.79], [151.3, -33.81],
    // into the harbour: Manly, Middle Harbour, the lower north shore
    [151.285, -33.822], [151.285, -33.8], [151.255, -33.815], [151.245, -33.79], [151.235, -33.775],
    [151.225, -33.79], [151.235, -33.825], [151.23, -33.835], [151.215, -33.849], [151.205, -33.845],
    // Lane Cove River
    [151.185, -33.84], [151.17, -33.82], [151.155, -33.808], [151.15, -33.82], [151.16, -33.835],
    // Parramatta River, north bank west to Parramatta, then the south bank back
    [151.13, -33.835], [151.1, -33.825], [151.07, -33.825], [151.04, -33.82], [151.01, -33.815],
    [151.002, -33.816], [151.01, -33.819], [151.04, -33.826], [151.07, -33.831], [151.1, -33.836],
    [151.13, -33.846],
    // Iron Cove, Balmain, Darling Harbour, Circular Quay, the eastern bays
    [151.155, -33.855], [151.148, -33.866], [151.162, -33.862], [151.175, -33.856], [151.195, -33.866],
    [151.2, -33.872], [151.205, -33.861], [151.21, -33.857], [151.216, -33.857], [151.222, -33.866],
    [151.226, -33.86], [151.24, -33.871], [151.26, -33.869], [151.28, -33.84], [151.285, -33.835],
    // ocean beaches south to Cape Banks
    [151.28, -33.89], [151.262, -33.92], [151.26, -33.95], [151.248, -33.998],
    // Botany Bay's north shore and the Georges River
    [151.232, -33.99], [151.215, -33.97], [151.185, -33.965], [151.175, -33.955], [151.155, -33.96],
    [151.145, -33.985], [151.135, -34.0], [151.11, -33.99], [151.08, -33.98], [151.05, -33.975],
    [151.03, -33.97], [151.04, -33.985], [151.08, -33.995], [151.11, -34.01],
    // Kurnell back out to Cape Solander, then down to Cronulla
    [151.125, -34.02], [151.16, -34.01], [151.2, -34.005], [151.22, -34.0], [151.235, -34.01],
    [151.23, -34.04], [151.2, -34.05], [151.16, -34.06], [151.15, -34.08],
    [150.9, -34.08], [150.9, -33.7],
  ] as [number, number][],
  /** [lng, lat, text, kind] — `water` names sit on the sea in italics. */
  labels: [
    [151.005, -33.835, 'Parramatta', 'place'],
    [151.207, -33.884, 'CBD', 'place'],
    [151.145, -33.9, 'Inner West', 'place'],
    [151.17, -33.79, 'North Shore', 'place'],
    [151.272, -33.905, 'Bondi', 'place'],
    [151.06, -33.94, 'South West', 'place'],
    [151.19, -33.99, 'Botany Bay', 'water'],
    [151.32, -33.96, 'Pacific Ocean', 'water'],
    [151.235, -33.85, 'Harbour', 'water'],
  ] as [number, number, string, 'place' | 'water'][],
}

/** True when a point is on this map (with a little margin). */
export const inSydney = (lng: number, lat: number) =>
  lng > SYDNEY.bbox[0] - 0.05 && lng < SYDNEY.bbox[2] + 0.05 && lat > SYDNEY.bbox[1] - 0.05 && lat < SYDNEY.bbox[3] + 0.05
