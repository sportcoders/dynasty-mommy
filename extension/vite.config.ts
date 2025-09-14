import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

import manifestChrome from './manifest-chrome.config.js';
import manifestFirefox from './manifest-firefox.config.js';

const platform = process.env.PLATFORM || 'chrome';
const manifest = platform === 'firefox' ? manifestFirefox : manifestChrome;
const outDir = platform === 'firefox' ? 'dist/firefox' : 'dist/chrome';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  build: {
    outDir,
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
});
