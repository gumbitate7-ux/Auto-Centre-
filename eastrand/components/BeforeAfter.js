import { esc, img, demoTag } from "./_lib.js";

export default function BeforeAfter(cfg) {
  const b = cfg.beforeAfter;
  const samePhoto = (cfg.images.before.unsplash ?? cfg.images.before.src) === (cfg.images.after.unsplash ?? cfg.images.after.src);
  return `
<section class="section ba" id="results" aria-labelledby="ba-title">
  <div class="ba-grid container">
    <div class="ba-copy">
      <p class="label reveal">${esc(b.label)}</p>
      <h2 class="display display-md reveal" id="ba-title">${esc(b.title)}</h2>
      <dl class="ba-facts reveal">
        <div><dt>Vehicle</dt><dd>${esc(b.vehicle)}</dd></div>
        <div><dt>The problem</dt><dd>${esc(b.problem)}</dd></div>
        <div><dt>The work</dt><dd>${esc(b.work)}</dd></div>
        <div><dt>The result</dt><dd>${esc(b.result)}</dd></div>
      </dl>
      ${demoTag(cfg, b.demoNote)}
    </div>
    <div class="ba-stage reveal${samePhoto ? " ba-demo" : ""}" data-ba style="--pos:50%">
      <div class="ba-layer ba-after media" data-label="${esc(cfg.images.after.alt)}">${img(cfg, "after", { sizes: "(min-width: 1000px) 58vw, 100vw", maxWidth: 1920 })}</div>
      <div class="ba-layer ba-before media" data-label="${esc(cfg.images.before.alt)}">${img(cfg, "before", { sizes: "(min-width: 1000px) 58vw, 100vw", maxWidth: 1920 })}</div>
      <span class="ba-tag ba-tag-before" aria-hidden="true">Before</span>
      <span class="ba-tag ba-tag-after" aria-hidden="true">After</span>
      <span class="ba-handle" aria-hidden="true"><span class="ba-knob"><svg viewBox="0 0 24 24"><path d="M9 6 3 12l6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>
      <label class="sr-only" for="ba-range">Drag to compare before and after</label>
      <input class="ba-range" id="ba-range" type="range" min="0" max="100" value="50" data-ba-range>
    </div>
  </div>
</section>`;
}
