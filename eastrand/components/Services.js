import { esc, img, icon, lines, pad2 } from "./_lib.js";

// Desktop: an editorial index with one photo panel that follows the hovered/focused row.
// Mobile: the index alone, no images, so the list stays short.
export default function Services(cfg) {
  const s = cfg.services;
  return `
<section class="section services" id="services" aria-labelledby="services-title">
  <div class="container">
    <div class="svc-head">
      <h2 class="display reveal" id="services-title">${lines(s.headline)}</h2>
      <p class="lead reveal">${esc(s.intro)}</p>
    </div>
    <div class="svc-layout" data-svc>
      <div class="svc-preview" aria-hidden="true">
        ${s.items.map((it, i) => `<div class="svc-shot media${i === 0 ? " is-active" : ""}" data-label="${esc(cfg.images[it.image].alt)}" data-shot="${i}">${img(cfg, it.image, { sizes: "(min-width: 1024px) 40vw, 1px", maxWidth: 1280 })}</div>`).join("")}
      </div>
      <ol class="svc-list">
        ${s.items.map((it, i) => `
        <li>
          <a class="svc-row${i === 0 ? " is-active" : ""}" href="#contact" data-service="${esc(it.title)}" data-row="${i}">
            <span class="svc-num">${pad2(i + 1)}</span>
            <span class="svc-main"><span class="svc-title">${esc(it.title)}</span><span class="svc-text">${esc(it.text)}</span></span>
            ${icon("arrow", "svc-arrow")}
          </a>
        </li>`).join("")}
      </ol>
    </div>
  </div>
</section>`;
}
