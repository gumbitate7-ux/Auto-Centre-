# Eastern Auto Body: concept website

A sales demo for Eastern Auto Body (panel beating & spray painting), built around the shop's own sign. It's a static, dependency-free site generated from one config file.

**To view it:** open `dist/eastern-auto-body-demo.html` in a browser. It's a single file with everything inlined, so you can also send it as-is.

## The brand

| From the logo | On the site |
| --- | --- |
| Jade mark of slanted bars (3 × 2) | Redrawn as SVG in `components/_lib.js` (`markSvg`). The jade (`#559F7B`) is the action colour: every main button, step marker and highlight. |
| Wide capital wordmark | Mona Sans at 125% width, set as a one-line lockup on a light grey band under the hero photo, and in the nav and footer. |

Everything else is light greys, pastel sage and white, so the jade stands out. The logo is a redraw from a phone photo of the sign, not the original artwork. If the owner has the original vector (from the sign maker), swap it in.

## How it's organised

```
site.config.js        All business details, copy, services, images. Edit this.
components/           One file per section (Navbar, Hero, Services, Process, Gallery,
                      Testimonials, Contact, Footer, MobileCTA) plus Page.js which
                      assembles them, and _lib.js (helpers, icons, the logo mark).
src/styles.css        Design system and layout
src/main.js           Interactions (nav, menu, reveals, service photos, lightbox, form)
assets/img/           Local photos (put the workshop's own photos here)
build.mjs             Writes dist/index.html (+ assets/) and dist/eastern-auto-body-demo.html
tools/download-images.mjs   Copies the demo photos locally (optional)
```

After any edit: `node build.mjs` (Node 18 or newer, no install step).

## Before showing it to the owner

- **Contact details are blank unless confirmed.** Call buttons without a number show a short "Demo" notice instead of dialling; WhatsApp buttons open WhatsApp with the message written and let you pick a chat (forward one to yourself to show the owner what a lead looks like).
- **Photos load from Unsplash** (free to use under the Unsplash License), so the page needs an internet connection. If a photo can't load, backup workshop photos (`imageFallbacks`, or `fallbacks` per image) are tried in turn, then a styled placeholder. Under the hero photo sits a drawn booth-light panel, so the hero is never empty. To make the demo fully offline, run `node tools/download-images.mjs`, then `node build.mjs`.
- **Reviews** appear automatically once real ones are added to `testimonials.items`; until then the section is hidden.
- **Insurance wording.** The page invites insurance-claim quotes but makes no claim about insurer approvals. Confirm with the owner how they handle claims.

## Making it the real site

1. Fill in `business` in `site.config.js`: phone, WhatsApp, address, hours, socials, and `seo.url`.
2. Replace the demo photos with the workshop's own (see the shot list below).
3. Confirm the services list.
4. Set `demoNotes: false`, rebuild, and upload the contents of `dist/` to any static host.

## Photos to take at the workshop

Ten minutes with a phone beats any stock photo. Landscape, workshop lights on:

1. **Hero:** a car in the spray booth or on the floor mid-repair, shot low and wide.
2. **Services (8):** one close-up each: hammer and dolly on a panel, spray gun in the booth, a crash-damaged car, a scratch being flatted, a bumper repair, dent work, rust cut-out, polisher on paint.
3. **Our work (4):** before and after pairs work best. Blur any customer plates the owner doesn't want shown.

Drop the files in `assets/img/` and point each `images` entry in `site.config.js` at them (`src: "assets/img/name.jpg"`).

## What the page does for leads

- The hero says what the shop does in one line, with **Get a quote** and **WhatsApp photos** side by side.
- Services work as an index: hovering a service shows its photo; clicking it opens the quote form with that service selected.
- "How it works" walks through the photo-to-quote flow and has a separate insurance-claim WhatsApp message.
- The quote form checks name and phone, asks whether it's private or an insurance claim, takes the registration in a number-plate field, then opens WhatsApp with the whole request written out.
- On phones, a WhatsApp / Call / Get a quote bar stays at the bottom once you scroll past the hero.
- `AutoBodyShop` structured data, title, description and Open Graph tags. The structured data only includes details that are actually filled in.
