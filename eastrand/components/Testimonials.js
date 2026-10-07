import { esc, icon, demoTag } from "./_lib.js";

export default function Testimonials(cfg) {
  const t = cfg.testimonials;
  // Markup is ready for real Google reviews: swap quote, name and meta in site.config.js.
  return `
<section class="section reviews" aria-labelledby="reviews-title">
  <div class="container">
    <div class="section-head split">
      <h2 class="display display-md reveal" id="reviews-title">${esc(t.headline)}</h2>
      <div class="section-aside reveal">${demoTag(cfg, t.demoNote)}</div>
    </div>
    <ul class="rev-grid">
      ${t.items.map((r, i) => `
      <li class="rev reveal${i === 0 ? " rev-lead" : ""}" style="--i:${i}">
        <figure>
          <span class="rev-stars" role="img" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</span>
          <blockquote><p>${esc(r.quote)}</p></blockquote>
          <figcaption><strong>${esc(r.name)}</strong><span>${esc(r.meta)}</span></figcaption>
        </figure>
      </li>`).join("")}
    </ul>
  </div>
</section>`;
}
