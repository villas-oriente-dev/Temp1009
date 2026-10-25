import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: [
          'favicon.ico', 
          'apple-touch-icon.png', 
          'icon.svg', 
          'pwa-192x192.png', 
          'pwa-512x512.png', 
          'pwa-maskable-512x512.png', 
          'screenshot-mobile.png', 
          'screenshot-desktop.png',
          'manifest.json',
          'manifest.webmanifest',
          'sw.js'
        ],
        manifest: {
          id: '/',
          name: 'QR SOS Médico - Rescate y Emergencias',
          short_name: 'SOS Médico',
          description: 'Ficha médica de emergencia, llamada directa en 1 clic a familiares ICE, modo 100% offline y generador de códigos QR para casco y cartera.',
          theme_color: '#dc2626',
          background_color: '#0f172a',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'portrait',
          lang: 'es',
          dir: 'ltr',
          categories: ['medical', 'health', 'utilities'],
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
          ],
          screenshots: [
            {
              src: '/screenshot-mobile.png',
              sizes: '540x960',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Ficha Médica de Emergencia y Contactos ICE',
            },
            {
              src: '/screenshot-desktop.png',
              sizes: '960x540',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Generador de QR y Fichas de Rescate',
            },
          ],
          shortcuts: [
            {
              name: 'Ficha Médica SOS',
              short_name: 'Ficha SOS',
              description: 'Ver datos médicos de emergencia y contactos ICE',
              url: '/#emergency',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Generar QR Casco/Moto',
              short_name: 'Generar QR',
              description: 'Generar código QR y pegatinas',
              url: '/#qr',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Service-Worker-Allowed': '/',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
