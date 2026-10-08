# Eastrand Auto Repairs: concept website

A sales demo for Eastrand Auto Repairs (Kempton Park, East Rand). It's a static, dependency-free site generated from one config file.

**To view it:** open `dist/eastrand-demo.html` in a browser. It's a single file with everything inlined, so you can also send it as-is.

## How it's organised

```
site.config.js        All business details, copy, services, images. Edit this.
components/           One file per section (Navbar, Hero, Services, WhyUs, Gallery,
                      Testimonials, Contact, Footer, MobileCTA) plus Page.js which
                      assembles them.
src/styles.css        Design system and layout
src/main.js           Interactions (nav, menu, reveals, slider, lightbox, form)
build.mjs             Writes dist/index.html (+ assets/) and dist/eastrand-demo.html
tools/download-images.mjs   Copies the demo photos locally (optional)
```

After any edit: `node build.mjs` (Node 18 or newer, no install step).

## Before showing it to the owner

- **Page structure.** Hero, Services, Why us, Our work, Contact. Reviews appear automatically once real ones are added to `testimonials.items`; until then the section is hidden rather than filled with placeholders.
- **Demo note.** `demoNotes: true` adds one line to the footer saying this is a concept with demo photography. Set it to `false` once the real details are in.
- **Contact details are blank on purpose.** Nothing about the business was found online, so there's no phone number, WhatsApp number or street address. Until they're filled in:
  - **Call** buttons show a short "Demo" notice instead of dialling.
  - **WhatsApp** buttons open WhatsApp with the message pre-written and let you pick a chat. You can forward it to yourself to show the owner what a lead looks like.
  - The contact section shows "Kempton Park, East Rand, Gauteng" and **Get directions** searches for the business name.
- **Photos load from Unsplash** (free to use under the Unsplash License), so the page needs an internet connection. If a photo can't load, its frame shows a styled placeholder instead of a broken image. To make the demo work offline, run `node tools/download-images.mjs`, then `node build.mjs`.

## Making it the real site

Fill in `business` in `site.config.js` (phone, WhatsApp, email, address, hours, socials) and `seo.url`, then:

1. Replace demo photos with the workshop's own: put files in `assets/img/` and set `src: "assets/img/name.jpg"` on each image entry. The hero and gallery matter most.
2. Add real Google reviews to `testimonials.items`.
3. Confirm the services list with the owner.
4. Set `demoNotes: false`, rebuild, and upload the contents of `dist/` to any static host.

## Photos to take at the workshop

Free stock photography with South African (GP) plates isn't available, so the most local-looking result comes from 10 minutes with a phone at the workshop. Landscape, daylight or workshop lights on, no people's faces needed:

1. **Hero:** a customer car on the lift or in the bay, GP plate visible, shot low and wide.
2. **Why us:** a technician's hands at work under a bonnet or wheel arch.
3. **Gallery (4):** a bakkie (Hilux or Ranger) in for a service, a brake job with the wheel off, the diagnostic scanner plugged in, and a finished car ready for collection at the gate.
4. **Services (8):** one close-up per service. Oil, brakes, scanner, suspension, battery, gearbox, engine bay, aircon vent.

Blur or crop any customer's plate the owner doesn't want shown. Then drop the files in `assets/img/` and point each `images` entry in `site.config.js` at them.

## South African details

- `business.plate` draws a personalised Gauteng-style plate ("EASTRAND GP") in the hero. Change the text, or the province code if needed.
- The quote form has an optional registration field styled as a number plate. Whatever's typed is sent in the WhatsApp message in capitals.

## What the page does for leads

- One clear next step per section: book, WhatsApp or call.
- Services work as an index: hovering a service shows its photo; clicking it opens the quote form with that service selected.
- **Book a service** jumps to the quote form with "General servicing" selected; each service card pre-selects its own service.
- The quote form checks name and phone, then opens WhatsApp with the whole request written out.
- On phones, a bar with WhatsApp / Call / Book stays at the bottom once you scroll past the hero.
- `AutoRepair` structured data, title, description and Open Graph tags target Kempton Park and East Rand searches. The structured data only includes details that are actually filled in.
