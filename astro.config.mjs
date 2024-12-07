// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',    // すべてのIPv4アドレスでリッスン
    port: 4321
  },

  integrations: [tailwind()]
});