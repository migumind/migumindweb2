// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

export default defineConfig({
  site: 'https://migumind.com',
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
    }),
  ],
  vite: {
    // Pre-bundle the globe's libraries when the dev server starts. Found late,
    // they trigger a mid-session re-bundle and the page 504s on stale copies.
    optimizeDeps: {include: ['d3-geo', 'topojson-client']},
  },
});
