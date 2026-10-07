import { esc, media, lines, pad2, icon, whatsappHref, waMessages } from "./_lib.js";

export default function WhyUs(cfg) {
  const w = cfg.why;
  return `
<section class="section why dark" id="why-us" aria-labelledby="why-title">
  <div class="why-grid container">
    <div class="why-media-wrap reveal">
      ${media(cfg, "whyUs", { sizes: "(min-width: 1024px) 45vw, 100vw", frameClass: "why-media", className: "parallax" })}
    </div>
    <div class="why-copy">
      <h2 class="display reveal" id="why-title">${lines(w.headline)}</h2>
      <p class="lead reveal">${esc(w.body)}</p>
      <ol class="why-points">
        ${w.points.map((p, i) => `
        <li class="reveal" style="--i:${i}">
          <span class="why-num">${pad2(i + 1)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.text)}</p>
        </li>`).join("")}
      </ol>
      <a class="btn btn-accent reveal" href="${whatsappHref(cfg, waMessages(cfg).problem)}" target="_blank" rel="noopener">${icon("whatsapp")}Ask us about your car</a>
    </div>
  </div>
</section>`;
}
