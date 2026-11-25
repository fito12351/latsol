import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'assets/figures/*.png'],
      manifest: {
        name: 'latsol — CBT PSAS XII SMAN 6 Purworejo',
        short_name: 'latsol',
        description: 'Aplikasi latihan soal & simulasi CBT PSAS 1 Kelas XII MIPA 2025/2026',
        theme_color: '#654CE5',
        background_color: '#F2EFE4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
      }
    })
  ],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096
  }
});
