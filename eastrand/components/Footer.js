import { esc } from "./_lib.js";
import { Logo } from "./Navbar.js";
import { addressLine } from "./Location.js";

export default function Footer(cfg) {
  const b = cfg.business;
  const year = new Date().getFullYear();
  return `
<footer class="footer dark">
  <div class="container">
    <div class="footer-top">
      ${Logo(cfg)}
      <p class="footer-line">${esc(b.positioning)}</p>
    </div>
    <div class="footer-cols">
      <nav aria-label="Footer"><ul>${cfg.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
      <ul class="footer-services">${cfg.services.items.slice(0, 5).map((s) => `<li><a href="#services">${esc(s.title)}</a></li>`).join("")}</ul>
      <div class="footer-contact">
        <p>${esc(addressLine(cfg))}</p>
        ${b.phoneDisplay ? `<p><a href="tel:${esc(b.phoneE164)}">${esc(b.phoneDisplay)}</a></p>` : ""}
        ${b.email ? `<p><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></p>` : ""}
        ${b.hours.map((h) => `<p>${esc(h.days)}: ${esc(h.time)}</p>`).join("")}
      </div>
    </div>
    <div class="footer-base">
      <p>© ${year} ${esc(b.name)}. Auto repairs and car servicing in Kempton Park and the East Rand.</p>
      ${cfg.demoNotes ? `<p class="footer-demo">Concept website designed for ${esc(b.name)}. Demo photography from Unsplash.</p>` : ""}
    </div>
  </div>
</footer>`;
}
