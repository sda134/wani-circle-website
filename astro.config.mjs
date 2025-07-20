// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// Load environment variables
const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable full server-side rendering
  adapter: node({
    mode: 'standalone'
  }),
  
  server: {
    host: '0.0.0.0',    // すべてのIPv4アドレスでリッスン
    port: 4321
  },

  integrations: [tailwind()],
  
  vite: {
    define: {
      'process.env.ADMIN_PASSWORD': JSON.stringify(env.ADMIN_PASSWORD),
      'process.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN),
      'process.env.GITHUB_REPO_OWNER': JSON.stringify(env.GITHUB_REPO_OWNER),
      'process.env.GITHUB_REPO_NAME': JSON.stringify(env.GITHUB_REPO_NAME),
    }
  }
});