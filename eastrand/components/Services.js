import { esc, lines, demoTag } from "./_lib.js";
import ServiceCard from "./ServiceCard.js";

export default function Services(cfg) {
  const s = cfg.services;
  return `
<section class="section services" id="services" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head split">
      <h2 class="display reveal" id="services-title">${lines(s.headline)}</h2>
      <div class="section-aside reveal">
        <p class="lead">${esc(s.intro)}</p>
        ${demoTag(cfg, s.demoNote)}
      </div>
    </div>
    <ul class="svc-grid">
      ${s.items.map((item, i) => ServiceCard(cfg, item, i)).join("")}
    </ul>
    <div class="section-cta reveal">
      <p>Not sure what it needs?</p>
      <a class="btn btn-dark" href="#contact" data-book>Book an inspection</a>
    </div>
  </div>
</section>`;
}
