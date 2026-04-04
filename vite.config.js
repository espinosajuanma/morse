import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { LEVELS } from './src/utils/levels.js'

function createSitemap(baseUrl) {
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const urls = [
    { path: '/', priority: '1.00' },
    { path: '/practice', priority: '0.80' },
    ...LEVELS.map((_, index) => ({ path: `/reception/${index + 1}`, priority: '0.80' }))
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) =>
        `  <url>\n    <loc>${normalizedBase}${url.path}</loc>\n    <priority>${url.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appUrl = env.VITE_APP_URL || 'https://morse.com.ar'
  const sitemapXml = createSitemap(appUrl)

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'apple-touch-icon.png'],
        manifest: {
          name: 'MORSE',
          short_name: 'MORSE',
          description: 'Juego interactivo y práctica de código Morse',
          theme_color: '#f5e9d2',
          background_color: '#f5e9d2',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      }),
      {
        name: 'generate-sitemap',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: sitemapXml
          })
        }
      }
    ]
  }
})
