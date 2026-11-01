# CLIMORA — Shopify theme

**The Future of Staying Cool.** A custom Shopify Online Store 2.0 theme for CLIMORA, a South African cooling-technology brand selling:

| Product | Handle | Template |
| --- | --- | --- |
| CLIMORA SolarFlow — solar-powered rechargeable fan | `climora-solarflow` | `product.solarflow` |
| CLIMORA IceSoft — cooling pillowcase | `climora-icesoft` | `product.icesoft` |
| CLIMORA FrostLayer — cooling mattress topper | `climora-frostlayer` | `product.frostlayer` |

The theme is built with Liquid, HTML, CSS and vanilla JavaScript only. It has no build step and no third-party JS dependencies.

- **Launch guide (start here):** [`docs/LAUNCH-GUIDE.md`](docs/LAUNCH-GUIDE.md). It covers products, collections, pages, menus, Yoco, Aramex, policies, test checkout and go-live.
- **Design system:** [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)
- **Draft policies:** [`docs/policies/`](docs/policies/). Paste these into Shopify Admin → Settings → Policies after legal review.

## Theme structure

```
assets/      climora.css (design system + components), climora.js (cart, variants, search, a11y), self-hosted fonts
config/      settings_schema.json (Brand, Colours, Typography, Contact & social, Delivery, Cart), settings_data.json
layout/      theme.liquid, password.liquid
locales/     en.default.json (all storefront strings)
sections/    climora-* (reusable, editor-configurable sections) and main-* (template sections), header/footer groups
snippets/    product-card, price, cart-line-items, delivery-note, icon, climora-art, meta-tags, pagination
templates/   index, product (+ solarflow/icesoft/frostlayer), collection (+ sleep-cooling/portable-cooling),
             list-collections, cart, search, page (+ about/contact/faq/shipping/returns), blog, article, 404, password, gift_card
```

## Preview locally

```bash
npm install -g @shopify/cli
shopify theme dev --store your-store.myshopify.com   # live-reloading preview
shopify theme check                                   # lint (currently 0 offenses)
shopify theme push --unpublished                      # upload as a new, unpublished theme
```
