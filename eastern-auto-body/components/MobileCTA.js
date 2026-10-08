import { icon, callAttrs, whatsappHref, waMessages } from "./_lib.js";

export default (cfg) => `
<nav class="mcta" aria-label="Quick contact" data-mcta>
  <a class="mcta-btn" href="${whatsappHref(cfg, waMessages(cfg).photos)}" target="_blank" rel="noopener">${icon("whatsapp")}<span>WhatsApp</span></a>
  <a class="mcta-btn" ${callAttrs(cfg)}>${icon("phone")}<span>Call</span></a>
  <a class="mcta-btn mcta-primary" href="#contact" data-quote><span>Get a quote</span></a>
</nav>
<div class="toast" role="status" aria-live="polite" data-toast></div>`;
