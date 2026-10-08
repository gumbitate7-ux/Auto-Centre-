import { esc, img, icon, markSvg, whatsappHref, waMessages } from "./_lib.js";

// The logo lockup (jade mark + wide wordmark) runs along the foot of the hero on a
// light grey band, under a full-bleed workshop photograph.
//
// Above it, a workshop photograph (hero.visual = "photo"). Underneath the photo sits a dark
// lacquered panel under booth lights, whose reflections start bent around a dent and pull
// straight on load. It shows if the photo can't load (or with hero.visual = "reflection"),
// so the hero is never empty. main.js draws the curves.
const Reflection = () => `
  <div class="hero-media hero-panel" aria-hidden="true">
    <svg class="reflections" viewBox="0 0 1600 900" preserveAspectRatio="none" data-reflections>
      <defs>
        <!-- userSpaceOnUse: a perfectly straight line has a zero-height box, which would blank a bounding-box gradient -->
        <linearGradient id="refl" gradientUnits="userSpaceOnUse" x1="0" x2="1600" y1="0" y2="0">
          <stop offset="0" stop-color="#FFF0E2" stop-opacity="0"/>
          <stop offset=".3" stop-color="#FFF0E2" stop-opacity=".18"/>
          <stop offset=".72" stop-color="#FFF0E2" stop-opacity=".9"/>
          <stop offset="1" stop-color="#FFF0E2" stop-opacity="0"/>
        </linearGradient>
        <filter id="tube" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
    </svg>
  </div>`;
export default function Hero(cfg) {
  const h = cfg.hero;
  const b = cfg.business;
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  ${Reflection()}
  ${h.visual === "photo" ? `<div class="hero-media media hero-photo" data-label="${esc(cfg.images.hero.alt)}">
    ${img(cfg, "hero", { eager: true, sizes: "100vw" })}
  </div>` : ""}
  <div class="hero-shade" aria-hidden="true"></div>

  <div class="hero-content container">
    <p class="eyebrow hero-eyebrow">${esc(h.eyebrow)}</p>
    <p class="hero-lead">${esc(h.statement)}</p>
    <div class="hero-foot">
      <p class="hero-body">${esc(h.body)}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary btn-lg" href="#contact" data-quote>Get a quote</a>
        <a class="btn btn-glass btn-lg" href="${whatsappHref(cfg, waMessages(cfg).photos)}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp photos</a>
      </div>
    </div>
  </div>

  <div class="sign">
    <div class="sign-inner container">
      ${markSvg("sign-mark")}
      <h1 class="sign-text" id="hero-title"><span class="sr-only">${esc(b.name)}: ${esc(b.tagline)}</span><span aria-hidden="true">${(() => { const [first, ...rest] = b.wordmark.split(" "); return `<span class="sw">${esc(first)}</span> <span class="sw">${esc(rest.join(" "))}</span>`; })()}</span></h1>
    </div>
  </div>
</section>`;
}
