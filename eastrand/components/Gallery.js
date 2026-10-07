import { esc, media, icon } from "./_lib.js";

export default function Gallery(cfg) {
  const g = cfg.gallery;
  const social = cfg.business.socials.instagram || cfg.business.socials.facebook;
  const seeMore = social
    ? `<a class="link-cta" href="${esc(social)}" target="_blank" rel="noopener">See our work ${icon("arrow")}</a>`
    : `<button class="link-cta" type="button" data-lightbox-open="0">See our work ${icon("arrow")}</button>`;
  return `
<section class="section gallery dark" id="work" aria-labelledby="work-title">
  <div class="container">
    <div class="gal-head">
      <h2 class="display reveal" id="work-title">${esc(g.headline)}</h2>
      <div class="reveal">${seeMore}</div>
    </div>
    <ul class="gal-grid">
      ${g.items.map((it, i) => `
      <li class="gal-item reveal" style="--i:${i}">
        <button class="gal-btn" type="button" data-lightbox-open="${i}" aria-label="View larger: ${esc(it.caption)}">
          ${media(cfg, it.image, { sizes: i === 0 ? "(min-width: 760px) 50vw, 100vw" : "(min-width: 760px) 25vw, 50vw", maxWidth: 1920, frameClass: "gal-media" })}
          <span class="gal-cap">${esc(it.caption)}</span>
        </button>
      </li>`).join("")}
    </ul>
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
