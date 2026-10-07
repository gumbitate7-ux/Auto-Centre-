import { esc, pad2, icon, whatsappHref, waMessages } from "./_lib.js";

export default function Process(cfg) {
  const p = cfg.process;
  return `
<section class="section process dark" id="process" aria-labelledby="process-title">
  <div class="container">
    <h2 class="display display-md reveal" id="process-title">${esc(p.headline)}</h2>
    <div class="process-track" data-progress>
      <span class="process-line" aria-hidden="true"><span></span></span>
      <ol class="process-steps">
        ${p.steps.map((s, i) => `
        <li class="reveal" style="--i:${i}">
          <span class="process-num">${pad2(i + 1)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </li>`).join("")}
      </ol>
    </div>
    <div class="section-cta on-dark reveal">
      <p>Start with step one. It takes a minute.</p>
      <a class="btn btn-accent" href="${whatsappHref(cfg, waMessages(cfg).problem)}" target="_blank" rel="noopener">${icon("whatsapp")}Tell us what's wrong</a>
    </div>
  </div>
</section>`;
}
