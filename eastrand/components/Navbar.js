import { esc, icon, callAttrs, whatsappHref, waMessages } from "./_lib.js";

export const Logo = (cfg, cls = "") => `
  <a class="logo ${cls}" href="#top" aria-label="${esc(cfg.business.name)}, back to top">
    <svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M11 12h18M11 20h13M11 28h18" stroke="currentColor" stroke-width="3" stroke-linecap="square"/>
    </svg>
    <span class="logo-text"><span class="logo-main">${esc(cfg.business.wordmark[0])}</span><span class="logo-sub">${esc(cfg.business.wordmark[1])}</span></span>
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
      <a class="btn btn-accent btn-sm nav-book" href="#contact" data-book>Book a service</a>
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
    <a class="btn btn-accent" href="#contact" data-book data-menu-link>${icon("calendar")}Book a service</a>
    <div class="menu-foot-row">
      <a class="btn btn-ghost" href="${whatsappHref(cfg, waMessages(cfg).general)}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp</a>
      <a class="btn btn-ghost" ${callAttrs(cfg)}>${icon("phone")}Call</a>
    </div>
    <p class="menu-place">${esc(cfg.business.address.suburb)}, ${esc(cfg.business.address.region)}</p>
  </div>
</div>`;
}
