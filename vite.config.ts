import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { business } from './src/data/business'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Injects SEO values (title, description, canonical, Open Graph) and
 * LocalBusiness structured data from src/data/business.ts, so the
 * business details live in exactly one place.
 */
function seo(): Plugin {
  const title = `${business.name} | Panel Beating, Spray Painting & Accident Repairs`
  const description = `${business.name}: professional auto body repairs, panel beating, spray painting, dent and bumper repairs, accident repairs and full vehicle restorations. Request a quote online, call or WhatsApp.`
  const url = business.siteUrl.replace(/\/$/, '')
  const a = business.address

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AutoBodyShop',
    name: business.name,
    description: business.summary,
    url,
    image: `${url}/og-image.jpg`,
    telephone: business.phone.international,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.province,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    openingHours: business.hours.flatMap((h) => ('schema' in h && h.schema ? [h.schema] : [])),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Auto body repair services',
      itemListElement: [
        'Accident Repairs',
        'Panel Beating',
        'Spray Painting',
        'Dent Repairs',
        'Bumper Repairs',
        'Full Vehicle Restoration',
      ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  }

  return {
    name: 'dinos-seo',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SEO_TITLE%', escapeHtml(title))
        .replaceAll('%SEO_DESCRIPTION%', escapeHtml(description))
        .replaceAll('%SEO_URL%', escapeHtml(url))
        .replaceAll('%SEO_NAME%', escapeHtml(business.name))
        .replace(
          '<!--%SEO_JSONLD%-->',
          `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`,
        )
    },
  }
}

/**
 * `npm run build` → dist/ for hosting.
 * `npm run build:local` → local-site/: relative paths with JS, CSS and fonts
 * inlined into index.html, so the site opens by double-clicking the file
 * (file://) with no server. Images stay alongside in images/.
 */
export default defineConfig(({ mode }) => {
  const local = mode === 'offline'
  return {
    base: local ? './' : '/',
    plugins: [react(), seo(), ...(local ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: {
      target: 'es2022',
      cssCodeSplit: false,
      outDir: local ? 'local-site' : 'dist',
    },
  }
})
