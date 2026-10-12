# Signup Worker

Takes signups from the site's forms and adds them to Shopify as customers subscribed to
email marketing, tagged `newsletter` (and `print-club-waitlist` for the print club form).
Runs on Cloudflare Workers so the Shopify credentials never touch this public repo.

## Setup

1. **Shopify app** — in the [Dev Dashboard](https://dev.shopify.com), create an app in the same
   organisation as the store. On its version, add the Admin API scopes `read_customers` and
   `write_customers`, release the version, then install the app on the store. Copy the Client ID
   and Client secret from the app's Settings.
2. **Store address** — put the store's `something.myshopify.com` address in `wrangler.toml`
   (`SHOPIFY_STORE`).
3. **Deploy** (needs a free Cloudflare account):

   ```bash
   cd workers/signup
   npx wrangler login
   npx wrangler secret put SHOPIFY_CLIENT_ID
   npx wrangler secret put SHOPIFY_CLIENT_SECRET
   npx wrangler deploy
   ```

4. **Connect the site** — set `PUBLIC_SIGNUP_ENDPOINT` to the Worker URL that `deploy` prints:
   in `.env` for local dev, and in `.github/workflows/deploy.yml` (build `env`) for the live site.
   Until it's set, the live site shows no signup forms.

## Tags

| Form | Tags |
|---|---|
| Popup, Shop → Drops | `newsletter`, `source:popup` / `source:shop-drops` |
| Shop → Print club | `newsletter`, `print-club-waitlist`, `source:shop-printclub` |

In Shopify, filter customers by tag to build segments for Shopify Email.
