import { esc, img, icon, markSvg, whatsappHref, waMessages } from "./_lib.js";

// The shop's own sign is the hero: an oxide band with the mark and raised aluminium
// lettering runs along the foot of a full-bleed workshop photograph.
export default function Hero(cfg) {
  const h = cfg.hero;
  const b = cfg.business;
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero-media media" data-label="${esc(cfg.images.hero.alt)}">
    ${img(cfg, "hero", { eager: true, sizes: "100vw" })}
  </div>
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
