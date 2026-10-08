import { esc } from "./_lib.js";

// Manufacturer approvals and trade memberships, straight under the sign.
// Renders nothing if the config has none, so it never shows unverified claims.
export default function Credentials(cfg) {
  const c = cfg.business.credentials;
  if (!c || (!c.approvedFor?.length && !c.memberships?.length)) return "";
  return `
<section class="creds" aria-label="Approvals and memberships">
  <div class="creds-inner container">
    ${c.approvedFor?.length ? `<div class="creds-group">
      <p class="creds-label">Approved repairer for</p>
      <ul class="creds-list">${c.approvedFor.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
    </div>` : ""}
    ${c.memberships?.length || c.established ? `<ul class="creds-list creds-members">${[c.established ? `Since ${c.established}` : "", ...(c.memberships || [])].filter(Boolean).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
  </div>
</section>`;
}
