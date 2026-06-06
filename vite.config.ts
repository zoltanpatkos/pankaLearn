import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        navigateFallback: '/',
      },
      manifest: {
        name: 'PankaLearn',
        short_name: 'PankaLearn',
        description: 'Panka személyes tanulóappja',
        lang: 'hu',
        theme_color: '#7c3aed',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    https: {
      key: readFileSync('./192.168.0.243+2-key.pem'),
      cert: readFileSync('./192.168.0.243+2.pem'),
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
    https: {
      key: readFileSync('./192.168.0.243+2-key.pem'),
      cert: readFileSync('./192.168.0.243+2.pem'),
    },
  },
})
