// Email signup → Shopify customer, subscribed to email marketing and tagged.
//
// The site is static, so this Worker is the only thing that ever holds Shopify
// credentials. It swaps the app's client ID + secret for an Admin API token
// (client credentials grant; tokens last 24 h), then creates the customer — or,
// if the email is already a customer, subscribes and tags the existing one.
//
// Secrets (set with `wrangler secret put`, never committed):
//   SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET
// Vars (wrangler.toml):
//   SHOPIFY_STORE      e.g. migumind.myshopify.com
//   SHOPIFY_API_VERSION
//   ALLOWED_ORIGINS    comma-separated origins allowed to post here

// Which tags each form adds. Anything not listed is rejected.
const LISTS = {
  newsletter: ['newsletter'],
  printclub: ['newsletter', 'print-club-waitlist'],
}

const EMAIL = /^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]{2,}$/

let cached = {token: '', expires: 0}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
    const cors = allowed.includes(origin)
      ? {'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin'}
      : {}

    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors})
    if (request.method !== 'POST') return reply({ok: false, error: 'method'}, 405, cors)
    if (!cors['Access-Control-Allow-Origin']) return reply({ok: false, error: 'origin'}, 403, cors)

    let body
    try {
      body = await request.json()
    } catch {
      return reply({ok: false, error: 'invalid'}, 400, cors)
    }

    // Honeypot: a hidden field people never see. Bots fill it; pretend it worked.
    if (body.website) return reply({ok: true}, 200, cors)

    const email = String(body.email || '').trim().toLowerCase()
    const tags = LISTS[body.list] || null
    if (!EMAIL.test(email) || email.length > 254 || !tags) return reply({ok: false, error: 'invalid'}, 400, cors)
    const source = String(body.source || 'site').replace(/[^a-z0-9-]/gi, '').slice(0, 32)

    try {
      await subscribe(env, email, [...tags, `source:${source}`])
      // Same answer whether or not they were already subscribed, so the form
      // can't be used to check who is on the list.
      return reply({ok: true}, 200, cors)
    } catch (e) {
      console.error(e)
      return reply({ok: false, error: 'server'}, 502, cors)
    }
  },
}

async function subscribe(env, email, tags) {
  const consent = {marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN', consentUpdatedAt: new Date().toISOString()}

  const created = await admin(env, `
    mutation ($input: CustomerInput!) {
      customerCreate(input: $input) { customer { id } userErrors { field message } }
    }`, {input: {email, tags, emailMarketingConsent: consent}})

  const errors = created.customerCreate.userErrors
  if (!errors.length) return
  if (!errors.some((e) => (e.field || []).includes('email'))) throw new Error(JSON.stringify(errors))

  // Already a customer (say, from an order): tag them and switch marketing on.
  const found = await admin(env, `
    query ($q: String!) { customers(first: 1, query: $q) { nodes { id } } }`, {q: `email:"${email}"`})
  const id = found.customers.nodes[0]?.id
  if (!id) throw new Error(`email taken but customer not found: ${JSON.stringify(errors)}`)

  await admin(env, `
    mutation ($id: ID!, $tags: [String!]!, $consent: CustomerEmailMarketingConsentUpdateInput!) {
      tagsAdd(id: $id, tags: $tags) { userErrors { message } }
      customerEmailMarketingConsentUpdate(input: $consent) { userErrors { message } }
    }`, {id, tags, consent: {customerId: id, emailMarketingConsent: consent}})
}

async function admin(env, query, variables, retried = false) {
  const res = await fetch(`https://${env.SHOPIFY_STORE}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Shopify-Access-Token': await token(env)},
    body: JSON.stringify({query, variables}),
  })
  // A token can be revoked or expire early; fetch a fresh one once.
  if (res.status === 401 && !retried) {
    cached = {token: '', expires: 0}
    return admin(env, query, variables, true)
  }
  const json = await res.json()
  if (!res.ok || json.errors) throw new Error(`Shopify ${res.status}: ${JSON.stringify(json.errors || json)}`)
  return json.data
}

async function token(env) {
  if (cached.token && Date.now() < cached.expires) return cached.token
  const res = await fetch(`https://${env.SHOPIFY_STORE}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({grant_type: 'client_credentials', client_id: env.SHOPIFY_CLIENT_ID, client_secret: env.SHOPIFY_CLIENT_SECRET}),
  })
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`)
  const {access_token, expires_in} = await res.json()
  // Refresh a few minutes early rather than racing the expiry.
  cached = {token: access_token, expires: Date.now() + (expires_in - 300) * 1000}
  return access_token
}

const reply = (data, status, headers) =>
  new Response(JSON.stringify(data), {status, headers: {...headers, 'Content-Type': 'application/json'}})
