import { esc, media, demoTag, icon } from "./_lib.js";

export default function Gallery(cfg) {
  const g = cfg.gallery;
  const social = cfg.business.socials.instagram || cfg.business.socials.facebook;
  const seeMore = social
    ? `<a class="btn btn-outline-light" href="${esc(social)}" target="_blank" rel="noopener">See our work ${icon("arrow")}</a>`
    : `<button class="btn btn-outline-light" type="button" data-lightbox-open="0">See our work ${icon("expand")}</button>`;
  return `
<section class="section gallery dark" id="work" aria-labelledby="work-title">
  <div class="container">
    <div class="section-head split">
      <h2 class="display reveal" id="work-title">${esc(g.headline)}</h2>
      <div class="section-aside reveal">
        <p class="lead">${esc(g.intro)}</p>
        ${demoTag(cfg, g.demoNote)}
      </div>
    </div>
    <ul class="gal-grid">
      ${g.items.map((it, i) => `
      <li class="gal-item gal-${it.size} reveal" style="--i:${i % 3}">
        <button class="gal-btn" type="button" data-lightbox-open="${i}" aria-label="View larger: ${esc(it.caption)}">
          ${media(cfg, it.image, { sizes: "(min-width: 900px) 40vw, 100vw", maxWidth: 1920, frameClass: "gal-media" })}
          <span class="gal-cap">${esc(it.caption)}</span>
        </button>
      </li>`).join("")}
    </ul>
    <div class="section-cta on-dark reveal">${seeMore}</div>
  </div>

  <dialog class="lightbox" data-lightbox aria-label="Workshop photos">
    <div class="lb-frame">
      <figure class="lb-figure"><div class="lb-img media" data-label=""></div><figcaption class="lb-cap"></figcaption></figure>
      <button class="lb-btn lb-prev" type="button" data-lb-prev aria-label="Previous photo">${icon("chevLeft")}</button>
      <button class="lb-btn lb-next" type="button" data-lb-next aria-label="Next photo">${icon("chevRight")}</button>
      <button class="lb-close" type="button" data-lb-close aria-label="Close">${icon("close")}</button>
      <p class="lb-count" aria-live="polite"></p>
    </div>
  </dialog>
</section>`;
}
