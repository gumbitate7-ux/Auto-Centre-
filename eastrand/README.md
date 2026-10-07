# Eastrand Auto Repairs: concept website

A sales demo for Eastrand Auto Repairs (Kempton Park, East Rand). It's a static, dependency-free site generated from one config file.

**To view it:** open `dist/eastrand-demo.html` in a browser. It's a single file with everything inlined, so you can also send it as-is.

## How it's organised

```
site.config.js        All business details, copy, services, images. Edit this.
components/           One file per section (Navbar, Hero, TrustBar, Services, ServiceCard,
                      WhyUs, Process, Gallery, BeforeAfter, Testimonials, Location, Contact,
                      Footer, MobileCTA) plus Page.js which assembles them.
src/styles.css        Design system and layout
src/main.js           Interactions (nav, menu, reveals, slider, lightbox, form)
build.mjs             Writes dist/index.html (+ assets/) and dist/eastrand-demo.html
tools/download-images.mjs   Copies the demo photos locally (optional)
```

After any edit: `node build.mjs` (Node 18 or newer, no install step).

## Before showing it to the owner

- **Demo tags.** `demoNotes: true` shows small dashed "Demo" notes on placeholder content (services list, gallery photos, before/after, reviews). Leave them on so the owner knows what gets replaced, or set `demoNotes: false` for a cleaner walkthrough.
- **Contact details are blank on purpose.** Nothing about the business was found online, so there's no phone number, WhatsApp number or street address. Until they're filled in:
  - **Call** buttons show a short "Demo" notice instead of dialling.
  - **WhatsApp** buttons open WhatsApp with the message pre-written and let you pick a chat. You can forward it to yourself to show the owner what a lead looks like.
  - The location shows "Kempton Park, East Rand, Gauteng" and **Get directions** searches for the business name.
- **Photos load from Unsplash** (free to use under the Unsplash License), so the page needs an internet connection. If a photo can't load, its frame shows a styled placeholder instead of a broken image. To make the demo work offline, run `node tools/download-images.mjs`, then `node build.mjs`.

## Making it the real site

Fill in `business` in `site.config.js` (phone, WhatsApp, email, address, hours, socials) and `seo.url`, then:

1. Replace demo photos with the workshop's own: put files in `assets/img/` and set `src: "assets/img/name.jpg"` on each image entry. Hero, gallery and before/after matter most.
2. Replace the three placeholder reviews with real Google reviews.
3. Confirm the services list with the owner.
4. Set `demoNotes: false`, rebuild, and upload the contents of `dist/` to any static host.

## What the page does for leads

- Every section ends with one next step: book, WhatsApp or call.
- **Book a service** jumps to the quote form with "General servicing" selected; each service card pre-selects its own service.
- The quote form checks name and phone, then opens WhatsApp with the whole request written out.
- On phones, a bar with WhatsApp / Call / Book stays at the bottom once you scroll past the hero.
- `AutoRepair` structured data, title, description and Open Graph tags target Kempton Park and East Rand searches. The structured data only includes details that are actually filled in.
