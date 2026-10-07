// Shared helpers for the section components. Components are plain functions
// that take the site config and return an HTML string.

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const UNSPLASH_WIDTHS = [640, 960, 1280, 1920, 2560];
const unsplashUrl = (id, w) => `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;

/**
 * Responsive <img> from the central image config.
 * Local images (`src`) are used as-is; Unsplash ids get a srcset.
 */
export function img(cfg, key, { sizes = "100vw", eager = false, maxWidth = 2560, className = "" } = {}) {
  const entry = cfg.images[key];
  if (!entry) throw new Error(`Unknown image key "${key}" in site.config.js`);
  const style = entry.position ? ` style="object-position:${esc(entry.position)}"` : "";
  const loading = eager ? `loading="eager" fetchpriority="high"` : `loading="lazy"`;
  const cls = className ? ` class="${className}"` : "";
  if (entry.src) {
    return `<img${cls} src="${esc(entry.src)}" alt="${esc(entry.alt)}" ${loading} decoding="async"${style}>`;
  }
  const widths = UNSPLASH_WIDTHS.filter((w) => w <= maxWidth);
  const srcset = widths.map((w) => `${unsplashUrl(entry.unsplash, w)} ${w}w`).join(", ");
  return `<img${cls} src="${unsplashUrl(entry.unsplash, widths.at(-2) ?? widths[0])}" srcset="${srcset}" sizes="${sizes}" alt="${esc(entry.alt)}" ${loading} decoding="async"${style}>`;
}

/** Image inside a frame that shows a designed placeholder if the photo can't load. */
export const media = (cfg, key, opts = {}) =>
  `<div class="media${opts.frameClass ? " " + opts.frameClass : ""}" data-label="${esc(cfg.images[key].alt)}">${img(cfg, key, opts)}</div>`;

// ---------- Contact links ----------
export function whatsappHref(cfg, message) {
  const n = cfg.business.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}
export const callAttrs = (cfg) =>
  cfg.business.phoneE164 ? `href="tel:${esc(cfg.business.phoneE164)}"` : `href="#contact" data-demo-call`;

export const waMessages = (cfg) => ({
  general: `Hi ${cfg.business.name}, I'd like to ask about my car.\n\nMy car: \nWhat's happening: `,
  booking: `Hi ${cfg.business.name}, I'd like to book a service.\n\nMy car: \nPreferred day: `,
  problem: `Hi ${cfg.business.name}, something's wrong with my car.\n\nMy car: \nWhat I'm noticing: `,
});

// ---------- Icons (1.5px stroke, 24px grid) ----------
const paths = {
  arrow: `<path d="M7 17 17 7M9 7h8v8"/>`,
  arrowDown: `<path d="M12 5v14M6 13l6 6 6-6"/>`,
  phone: `<path d="M5 4h3.5l1.5 4-2 1.2a10.5 10.5 0 0 0 6.8 6.8L16 14l4 1.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z"/>`,
  pin: `<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>`,
  calendar: `<rect x="4" y="5.5" width="16" height="14.5" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>`,
  close: `<path d="M6 6l12 12M18 6 6 18"/>`,
  chevLeft: `<path d="M15 5 8 12l7 7"/>`,
  chevRight: `<path d="m9 5 7 7-7 7"/>`,
  star: `<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5Z" fill="currentColor" stroke="none"/>`,
  expand: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
};
export const icon = (name, cls = "") =>
  name === "whatsapp"
    ? `<svg class="ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.89.9-2.98-.2-.31a8.2 8.2 0 1 1 6.84 3.73Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43l-.75-1.8c-.2-.47-.4-.4-.55-.41h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z"/></svg>`
    : `<svg class="ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

export const pad2 = (n) => String(n).padStart(2, "0");

/** Section heading split into lines, each line revealed in sequence. */
export const lines = (arr) => arr.map((l) => `<span class="line"><span>${esc(l)}</span></span>`).join("");

/** A Gauteng-style personalised number plate, drawn in HTML/CSS. */
export const plate = (cfg, cls = "") => {
  const pl = cfg.business.plate;
  return `<span class="plate${cls ? " " + cls : ""}" role="img" aria-label="Number plate reading ${esc(pl.text)} ${esc(pl.province)}">
    <span class="plate-chars" aria-hidden="true">${esc(pl.text)}<span class="plate-gap"></span>${esc(pl.province)}</span>
    <span class="plate-region" aria-hidden="true">${esc(pl.region)}</span>
  </span>`;
};
