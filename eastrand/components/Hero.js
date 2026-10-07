import { esc, img, icon, lines, whatsappHref, waMessages } from "./_lib.js";

export default function Hero(cfg) {
  const h = cfg.hero;
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero-media media" data-label="${esc(cfg.images.hero.alt)}">
    ${img(cfg, "hero", { eager: true, sizes: "100vw" })}
  </div>
  <div class="hero-shade" aria-hidden="true"></div>
  <div class="hero-content container">
    <p class="eyebrow hero-eyebrow">${esc(h.eyebrow)}</p>
    <h1 class="hero-title" id="hero-title">${lines(h.headline)}</h1>
    <div class="hero-foot">
      <p class="hero-body">${esc(h.body)}</p>
      <div class="hero-ctas">
        <a class="btn btn-accent btn-lg" href="#contact" data-book>Book a service</a>
        <a class="btn btn-glass btn-lg" href="${whatsappHref(cfg, waMessages(cfg).general)}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp us</a>
      </div>
    </div>
    <ul class="hero-trust" aria-label="What to expect">
      ${cfg.trust.map((t) => `<li>${esc(t)}</li>`).join("")}
    </ul>
  </div>
</section>`;
}
