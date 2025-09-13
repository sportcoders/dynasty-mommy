import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import manifest from './manifest.config.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true,
      }
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 3000
    },
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
});
