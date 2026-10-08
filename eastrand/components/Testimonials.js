import { esc, icon } from "./_lib.js";

// Renders nothing until real reviews are added to site.config.js.
export default function Testimonials(cfg) {
  const t = cfg.testimonials;
  if (!t.items.length) return "";
  return `
<section class="section reviews" aria-labelledby="reviews-title">
  <div class="container">
    <h2 class="display display-md reveal" id="reviews-title">${esc(t.headline)}</h2>
    <ul class="rev-grid">
      ${t.items.map((r, i) => `
      <li class="rev reveal" style="--i:${i}">
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
