import { esc, icon, callAttrs, markSvg, whatsappHref, waMessages } from "./_lib.js";

/** Mark + wordmark lockup, as on the shop sign. */
export const Logo = (cfg, cls = "") => `
  <a class="logo ${cls}" href="#top" aria-label="${esc(cfg.business.name)}, back to top">
    ${markSvg()}
    <span class="logo-text">${esc(cfg.business.wordmark)}</span>
  </a>`;

export default function Navbar(cfg) {
  const links = cfg.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("");
  const menuLinks = cfg.nav.map((n) => `<li><a href="${n.href}" data-menu-link>${esc(n.label)}</a></li>`).join("");
  return `
<header class="nav" data-nav>
  <div class="nav-inner container">
    ${Logo(cfg)}
    <nav class="nav-links" aria-label="Main"><ul>${links}</ul></nav>
    <div class="nav-actions">
      <a class="btn btn-primary btn-sm nav-cta" href="#contact" data-quote>Get a quote</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-open>
        <span class="menu-btn-label">Menu</span>
        <span class="menu-btn-lines" aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
  </div>
</header>

<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden data-menu>
  <div class="menu-top container">
    ${Logo(cfg, "logo-menu")}
    <button class="menu-close" type="button" data-menu-close>
      <span>Close</span>${icon("close")}
    </button>
  </div>
  <nav class="menu-body container" aria-label="Mobile">
    <ol class="menu-links">${menuLinks}</ol>
  </nav>
  <div class="menu-foot container">
    <a class="btn btn-primary" href="#contact" data-quote data-menu-link>Get a quote</a>
    <div class="menu-foot-row">
      <a class="btn btn-ghost" href="${whatsappHref(cfg, waMessages(cfg).photos)}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp</a>
      <a class="btn btn-ghost" ${callAttrs(cfg)}>${icon("phone")}Call</a>
    </div>
    <p class="menu-place">${esc(cfg.business.tagline)}</p>
  </div>
</div>`;
}
