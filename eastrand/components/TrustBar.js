import { esc } from "./_lib.js";

export default (cfg) => `
<section class="trust" aria-label="What to expect">
  <ul class="trust-list container">
    ${cfg.trust.map((t) => `<li><span class="trust-dot" aria-hidden="true"></span>${esc(t)}</li>`).join("")}
  </ul>
</section>`;
