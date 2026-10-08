import { esc, icon, lines, pad2, whatsappHref, waMessages } from "./_lib.js";

// How a panel-beating job runs, ending in the two ways to start one.
export default function Process(cfg) {
  const p = cfg.process;
  return `
<section class="section process dark" id="how-it-works" aria-labelledby="process-title">
  <div class="container">
    <div class="process-head">
      <h2 class="display reveal" id="process-title">${lines(p.headline)}</h2>
      <p class="lead reveal">${esc(p.intro)}</p>
    </div>
    <ol class="steps">
      ${p.steps.map((s, i) => `
      <li class="step reveal" style="--i:${i}">
        <span class="step-num">${pad2(i + 1)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </li>`).join("")}
    </ol>
    <div class="process-foot reveal">
      <div class="claim">
        <h3>${esc(p.insurance.title)}</h3>
        <p>${esc(p.insurance.text)}</p>
      </div>
      <div class="process-ctas">
        <a class="btn btn-primary" href="${whatsappHref(cfg, waMessages(cfg).photos)}" target="_blank" rel="noopener">${icon("whatsapp")}Send photos</a>
        <a class="btn btn-ghost" href="${whatsappHref(cfg, waMessages(cfg).insurance)}" target="_blank" rel="noopener">Insurance quote</a>
      </div>
    </div>
  </div>
</section>`;
}
