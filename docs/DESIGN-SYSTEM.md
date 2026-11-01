# CLIMORA design system

**Direction:** futuristic luxury technology, premium consumer electronics and modern climate technology. The look is cool and precise without feeling cold. It combines lots of white space, Ice Blue fields, Midnight Navy type, silver details and *restrained* Electric Ice lighting.

All tokens live at the top of `assets/climora.css` (`:root`). The five brand colours can also be changed in **Theme settings → Colours**.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--c-navy` Midnight Navy | `#182A40` | Primary text, primary buttons, focus states |
| `--c-charcoal` Deep Charcoal | `#111820` | Footer, announcement bar, dark gradients |
| `--c-ice` Ice Blue | `#EAF5FF` | Light section fields, hover fills |
| `--c-mist` | `#F5FAFF` | Alternating section background, cards on mist |
| `--c-electric` Electric Ice Blue | `#78C8F5` | Accent lighting, illustrations, focus ring, accents on dark only |
| `--c-silver` | `#BFCBD5` | Details, dividers, sold-out states |
| `--c-text-muted` | `#51637A` | Secondary text (6.1:1 on white) |
| `--c-link` | `#1F6FA3` | Eyebrows and links on light backgrounds (5.3:1 on white) |

Electric Ice is never used for body text on white because its contrast is too low. It is used only for light, glow, icons and text on dark navy.

**Gradients:** `--g-ice-radial` (light hero/section field with a soft electric glow), `--g-night` (midnight panels: AirTech, brand story, product stage), `--g-silver` (optional light stage).

## Typography

- **Sora** (headings, eyebrows, buttons): geometric, technical, slightly futuristic.
- **Manrope** (body): highly legible and warm.
- Both fonts are self-hosted variable fonts (`assets/*.woff2`, SIL OFL) and preloaded. They use `font-display: swap`.

| Token | Size |
| --- | --- |
| `--fs-display` | clamp(2.5rem → 5rem): hero only |
| `--fs-h1` / `--fs-h2` / `--fs-h3` | clamp(2.1→4rem) / clamp(1.9→3rem) / clamp(1.25→1.5rem) |
| `--fs-lead` | clamp(1.06→1.25rem) |
| Eyebrow | 12px Sora 600, uppercase, 0.2em tracking, leading rule |

## Space, shape and elevation

- 4px spacing scale (`--s-1` … `--s-20`); sections use `--section-y: clamp(64px, 9vw, 128px)`.
- Container 1320px plus a fluid gutter (`clamp(16px, 4vw, 40px)`).
- Radii: 10 / 16 / 24 / 32px plus pill buttons.
- Shadows: `--sh-1` (hairline), `--sh-2` (cards), `--sh-3` (lifted/hover), `--sh-glow` (button hover: a subtle electric halo).

## Components

- **Buttons:** pill, 52px tall, uppercase Sora. Variants are primary (navy), secondary (outline), light (on dark) and ghost-light. Hover lifts by 1px with an electric glow. Loading shows a spinner, and disabled is 45% opacity.
- **Product card:** ice-gradient media with a floor shadow, category tag, title, two-line description, price, and quick add (single-variant products) or "Choose options".
- **Stage:** midnight panel with concentric rings, a breathing glow and floating spec labels, used for hero product imagery.
- **Category tiles:** SleepTech (ice) and AirTech (midnight), deliberately contrasting.
- **Accordions:** native `<details>` with an animated plus/minus.
- **Notes:** the delivery message component, edited once in Theme settings → Delivery.

## Breakpoints

`600px` (small tablet), `750px` (tablet), `990px` (desktop layout and sticky gallery), `1100px` (full desktop navigation).

## Motion

The page uses 160/280/600ms durations with `cubic-bezier(.2,.7,.2,1)`. Effects are kept subtle: fade-up reveals on scroll, a slow fan rotation and a floating product on the hero stage. All motion is disabled under `prefers-reduced-motion` and in the theme editor.

## Illustrations

`snippets/climora-art.liquid` contains line-art illustrations of each product (fan, pillow, topper, orbit, logo mark). They are shown automatically wherever no photography has been uploaded yet. Once you add real product photos in Shopify, those photos replace the illustrations automatically.
