// Emoji reactions for the community gallery's stamps.
//
//   GET  /counts             → {counts: {<drawingId>: {<emoji>: n}}}
//   POST /react {drawing, emoji, on}  → {ok, count}
//
// One reaction per visitor, per emoji, per drawing. A visitor is a salted hash of
// their IP address; the IP itself is never stored. Counts live in D1 so increments
// are atomic.
//
// Binding: DB (D1). Secret: SALT. Vars: ALLOWED_ORIGINS.

// Must match REACTIONS in src/lib/reactions.ts.
const EMOJI = ['🔥', '❤️', '😂', '🤯', '🎨']
const ID = /^[A-Za-z0-9._-]{1,64}$/

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || ''
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
    const cors = allowed.includes(origin)
      ? {'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin'}
      : {}

    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors})

    if (request.method === 'GET' && url.pathname === '/counts') {
      const {results} = await env.DB.prepare('SELECT drawing, emoji, n FROM counts WHERE n > 0').all()
      const counts = {}
      for (const r of results) (counts[r.drawing] ??= {})[r.emoji] = r.n
      // Brief edge caching keeps a busy page from hitting the database on every view.
      return reply({counts}, 200, {...cors, 'Cache-Control': 'public, max-age=15'})
    }

    if (request.method === 'POST' && url.pathname === '/react') {
      if (!cors['Access-Control-Allow-Origin']) return reply({ok: false, error: 'origin'}, 403, cors)
      let body
      try {
        body = await request.json()
      } catch {
        return reply({ok: false, error: 'invalid'}, 400, cors)
      }
      const {drawing, emoji, on} = body
      if (!ID.test(String(drawing)) || !EMOJI.includes(emoji) || typeof on !== 'boolean') {
        return reply({ok: false, error: 'invalid'}, 400, cors)
      }

      const ip = request.headers.get('CF-Connecting-IP') || ''
      const voter = await sha256(`${env.SALT}|${ip}|${drawing}|${emoji}`)

      // Only move the count when this visitor's vote actually changes, so repeat
      // clicks (or a scripted loop) can't pile up reactions.
      const changed = on
        ? (await env.DB.prepare('INSERT OR IGNORE INTO votes (voter) VALUES (?)').bind(voter).run()).meta.changes
        : (await env.DB.prepare('DELETE FROM votes WHERE voter = ?').bind(voter).run()).meta.changes

      if (changed) {
        await env.DB.prepare(
          `INSERT INTO counts (drawing, emoji, n) VALUES (?1, ?2, MAX(?3, 0))
           ON CONFLICT (drawing, emoji) DO UPDATE SET n = MAX(n + ?3, 0)`,
        ).bind(drawing, emoji, on ? 1 : -1).run()
      }
      const row = await env.DB.prepare('SELECT n FROM counts WHERE drawing = ? AND emoji = ?').bind(drawing, emoji).first()
      return reply({ok: true, count: row?.n ?? 0}, 200, cors)
    }

    return reply({ok: false, error: 'not found'}, 404, cors)
  },
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const reply = (data, status, headers) =>
  new Response(JSON.stringify(data), {status, headers: {...headers, 'Content-Type': 'application/json'}})
