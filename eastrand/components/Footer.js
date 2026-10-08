import { esc } from "./_lib.js";
import { Logo } from "./Navbar.js";
import { addressLine } from "./Contact.js";

export default function Footer(cfg) {
  const b = cfg.business;
  return `
<footer class="footer dark">
  <div class="container footer-inner">
    ${Logo(cfg)}
    <nav aria-label="Footer"><ul>${cfg.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("")}</ul></nav>
    <div class="footer-base">
      <p>© ${new Date().getFullYear()} ${esc(b.name)}. Auto repairs and car servicing in ${esc(addressLine(cfg))}.</p>
      ${b.phoneDisplay ? `<p><a href="tel:${esc(b.phoneE164)}">${esc(b.phoneDisplay)}</a></p>` : ""}
      ${cfg.demoNotes ? `<p class="footer-demo">Concept website for ${esc(b.name)}. Demo photography from Unsplash; services and contact details to be confirmed.</p>` : ""}
    </div>
  </div>
</footer>`;
}
