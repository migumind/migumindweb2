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
});
