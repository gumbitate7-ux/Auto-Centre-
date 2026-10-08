# Dino's Auto Body Repairs: website concept

A premium, single-page website concept for **Dino's Auto Body Repairs**: panel beating, spray painting, accident repairs and restorations. It is built to be shown to the business owner as a redesign concept, and to become the real site once the placeholder content is replaced.

> **Concept status.** Contact details, address, trading hours, social links and all imagery are **placeholders**. Nothing on the site claims reviews, awards, certifications, years in business or insurance partnerships. See [Going live](#going-live) for the replacement checklist.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript (strict)
- Plain CSS with design tokens (`src/styles/tokens.css`) and one stylesheet per component
- Self-hosted variable fonts: Archivo (display, slightly expanded) and Inter (text)
- No UI or animation libraries. Motion uses CSS transitions, one shared `requestAnimationFrame` scroll loop, `IntersectionObserver` and the View Transitions API (with fallback)
- `sharp` (dev only) for the responsive image pipeline

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
npm run images    # regenerate responsive images from assets/images/
```

The output in `dist/` is a static site and can be hosted anywhere: Netlify, Vercel, Cloudflare Pages, or any shared hosting.

## Project structure

```
assets/images/             High-resolution source images (edit these, then run `npm run images`)
public/images/             Generated AVIF/WebP variants (do not edit by hand)
public/                    favicon, touch icon, Open Graph image, robots.txt, sitemap.xml
scripts/optimize-images.mjs  Image pipeline (widths, formats, blur placeholders, manifest)
src/
  data/
    business.ts            ← All business details (name, phone, WhatsApp, email, address, hours, links)
    services.ts            Services shown in the grid, form and structured data
    content.ts             Section copy: hero slides, trust points, pillars, process, comparisons, projects
    images.generated.json  Image manifest written by the pipeline
  components/
    layout/                Header, MobileMenu, Footer, MobileActionBar
    sections/              Hero, TrustStrip, About, Services, WhyDinos, BeforeAfter, Gallery, Lightbox,
                           Process, CtaBand, QuoteSection, Contact, MapIllustration
    quote/                 Multi-step QuoteForm, fields, photo dropzone, validation model, context
    ui/                    Button, Icon, Picture, CompareSlider, Reveal, Logo
  hooks/                   Scrollspy, parallax, magnetic hover, dialog (focus trap / scroll lock), in-view
  lib/                     Shared scroll loop, quote submission
  styles/                  Design tokens and base styles
vite.config.ts             Injects SEO meta + LocalBusiness JSON-LD from business.ts at build time
```

## Going live

Work through this list before publishing the site as Dino's real website.

1. **Business details:** edit `src/data/business.ts`. Every value marked `PLACEHOLDER` needs replacing: phone, WhatsApp number, email, address, trading hours, Google Maps link, social profile URLs and the live domain (`siteUrl`). Then set `usesPlaceholderDetails: false` to remove the placeholder notice in the contact section. The page title, meta description, Open Graph tags and `AutoBodyShop` structured data are all generated from this file.
2. **Photography:** replace the concept renders with Dino's own photos.
   - Put high-resolution photos (2400px+ on the long edge) in `assets/images/` **using the same file names** (for example `hero-booth.jpg`, `svc-panel.jpg`, `ba-door-before.jpg` / `ba-door-after.jpg`).
   - Run `npm run images`.
   - Before/after pairs should be shot from the same position, with the same framing and lighting.
   - Update the alt text in `src/data/services.ts` and `src/data/content.ts` to describe the new photos.
   - Remove the "Concept renders…" notes in `BeforeAfter.tsx`, `Gallery.tsx` and `Lightbox.tsx`, and the concept line in `Footer.tsx`.
   - Regenerate `public/og-image.jpg` (1200×630) from a real photo.
3. **Projects:** edit `projects` in `src/data/content.ts` to reflect real jobs. Categories, filter counts and the masonry layout (balanced automatically by each card's `shape`) update on their own.
4. **Quote form:** set `VITE_QUOTE_ENDPOINT` (in `.env` or your host's environment settings) to any endpoint that accepts `multipart/form-data`, such as Formspree, Getform, Basin or your own API. Requests include all fields plus the uploaded photos. Without it, the form runs in **demo mode**: it shows the full flow but sends nothing, and says so on the success screen. Add `?simulate-error` to the URL to preview the error state.
5. **Map:** `MapIllustration.tsx` is a stylised placeholder. Once the address is confirmed, swap it for a Google Maps embed (`<iframe loading="lazy" …>`) or keep it and point `mapsUrl` at the workshop.
6. **Domain:** update `public/robots.txt` and `public/sitemap.xml`.

## Design notes

- **Palette:** light-to-mid greys with graphite (`#25282B`) for type and the two dark bands. A restrained warm metallic (`#9B907F`) is used only for small details such as the pillar numbers and required-field markers. All body text meets WCAG AA contrast.
- **Type:** Archivo at 104–125% width for display text gives an engineered, automotive character without looking like racing branding. Inter handles body copy and UI.
- **Motion:** used where it communicates quality: the hero media opens from inset to full-bleed as you scroll, imagery has subtle parallax, CTAs have a gentle magnetic pull and a brushed-metal sheen, sections reveal once, the process timeline fills on scroll, and gallery filtering animates via View Transitions. Everything respects `prefers-reduced-motion`.
- **Mobile:** not just a squashed desktop layout. The hero leads with the headline and two side-by-side CTAs, services become a swipeable carousel, the gallery shows four projects with a "Show all" button (keeping the quote form close), the timeline goes vertical, the contact section starts with Call / WhatsApp / Directions buttons, and a floating Call · WhatsApp · Get a Quote bar appears after the hero (it steps aside when the quote form or contact section is on screen).

## Accessibility

Semantic landmarks and a single `h1`, skip link, visible focus states, a keyboard-operable before/after slider (`role="slider"`, arrow keys, Home/End), and focus-trapped dialogs (mobile menu, project lightbox) that close on Escape and restore focus. The form uses real labels, inline errors linked with `aria-describedby`, moves focus to the first invalid field, and announces step changes. All images have descriptive alt text.

## Performance

Responsive AVIF/WebP images with intrinsic dimensions (no layout shift) and blurred placeholders, a preloaded hero image, lazy loading below the fold, self-hosted fonts, and only React as a runtime dependency. Scroll effects use one passive, frame-throttled listener and only animate `transform`, `opacity` and `clip-path`.

## Image credits

The concept imagery consists of 3D renders made in Blender for this demo, not photographs of Dino's work. The vehicle is the "Ferrari 458 Italia" 3D model by **vicent091036** (Sketchfab), as distributed with the [three.js examples](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf). Manufacturer badges were removed, and the paint, damage, primer and masking were created procedurally. The renders are placeholders intended to be replaced with Dino's own photography before launch.
