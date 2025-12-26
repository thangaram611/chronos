import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts',
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Chronos',
      short_name: 'Chronos',
      description: 'Take control of your time',
      theme_color: '#A380E6',
      background_color: '#A380E6',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'icons/icon-48x48.webp',
          sizes: '48x48',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-72x72.webp',
          sizes: '72x72',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-96x96.webp',
          sizes: '96x96',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-128x128.webp',
          sizes: '128x128',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-144x144.webp',
          sizes: '144x144',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-152x152.webp',
          sizes: '152x152',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-192x192.webp',
          sizes: '192x192',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-256x256.webp',
          sizes: '256x256',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-384x384.webp',
          sizes: '384x384',
          type: 'image/webp'
        },
        {
          src: 'icons/icon-512x512.webp',
          sizes: '512x512',
          type: 'image/webp'
        }
      ]
    },

    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})