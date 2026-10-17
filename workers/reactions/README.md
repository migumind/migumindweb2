# Reactions Worker

Stores the emoji reactions on the contact page's community gallery. Runs on Cloudflare
Workers with a D1 database (both free tier). One reaction per visitor per emoji per
drawing; visitors are tracked only as a salted hash of their IP address.

## Setup

```bash
cd workers/reactions
npx wrangler login
npx wrangler d1 create migumind-reactions        # paste the printed database_id into wrangler.toml
npx wrangler d1 execute migumind-reactions --remote --file=schema.sql
npx wrangler secret put SALT                     # any long random string
npx wrangler deploy
```

Then set `PUBLIC_REACTIONS_ENDPOINT` to the Worker URL that `deploy` prints: in `.env`
for local dev, and in `.github/workflows/deploy.yml` (build `env`) for the live site.
Until it's set, the live gallery shows the stamps without reaction buttons.

The emoji list lives in two places that must match: `EMOJI` in `src/index.js` and
`REACTIONS` in `src/lib/reactions.ts`.
