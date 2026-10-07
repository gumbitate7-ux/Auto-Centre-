import { esc } from "./_lib.js";
import { addressLine } from "./Contact.js";
import Navbar from "./Navbar.js";
import Hero from "./Hero.js";
import Services from "./Services.js";
import WhyUs from "./WhyUs.js";
import Gallery from "./Gallery.js";
import Testimonials from "./Testimonials.js";
import Contact from "./Contact.js";
import Footer from "./Footer.js";
import MobileCTA from "./MobileCTA.js";

function schema(cfg) {
  const b = cfg.business;
  // Only fields the config actually holds are included; nothing is invented.
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: b.name,
    description: cfg.seo.description,
    areaServed: ["Kempton Park", "East Rand", "Gauteng"],
    address: {
      "@type": "PostalAddress",
      ...(b.address.street && { streetAddress: b.address.street }),
      addressLocality: b.address.suburb,
      addressRegion: "Gauteng",
      ...(b.address.postalCode && { postalCode: b.address.postalCode }),
      addressCountry: "ZA",
    },
    ...(b.phoneE164 && { telephone: b.phoneE164 }),
    ...(b.email && { email: b.email }),
    ...(cfg.seo.url && { url: cfg.seo.url }),
    makesOffer: cfg.services.items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })),
  };
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

export default function Page(cfg, { css, js, inline }) {
  const s = cfg.seo;
  const styles = inline ? `<style>${css}</style>` : `<link rel="stylesheet" href="assets/styles.css">`;
  const script = inline ? `<script>${js}</script>` : `<script src="assets/main.js" defer></script>`;
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(s.title)}</title>
<meta name="description" content="${esc(s.description)}">
<meta name="theme-color" content="#0B0B0B">
${s.url ? `<link rel="canonical" href="${esc(s.url)}">` : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.business.name)}">
<meta property="og:title" content="${esc(cfg.business.name)}: car servicing and repairs in Kempton Park">
<meta property="og:description" content="${esc(s.description)}">
<meta property="og:locale" content="en_ZA">
${s.url ? `<meta property="og:url" content="${esc(s.url)}">` : ""}
<meta name="geo.region" content="ZA-GP">
<meta name="geo.placename" content="${esc(addressLine(cfg))}">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0B0B0B"/><path d="M11 12h18M11 20h13M11 28h18" stroke="#D99A2E" stroke-width="3.5"/></svg>')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://unsplash.com">
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&display=swap" rel="stylesheet">
<script>
  // Runs before images load: any photo that fails gets its frame's designed placeholder.
  document.documentElement.classList.add("js");
  addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG") { var m = t.closest(".media"); if (m) m.classList.add("is-missing"); }
  }, true);
</script>
${styles}
<script type="application/ld+json">
${schema(cfg)}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${Navbar(cfg)}
<main id="main">
${Hero(cfg)}
${Services(cfg)}
${WhyUs(cfg)}
${Gallery(cfg)}
${Testimonials(cfg)}
${Contact(cfg)}
</main>
${Footer(cfg)}
${MobileCTA(cfg)}
<script>window.SITE = ${JSON.stringify({
    name: cfg.business.name,
    whatsapp: cfg.business.whatsapp.replace(/\D/g, ""),
    phone: cfg.business.phoneE164,
    gallery: cfg.gallery.items.map((it) => ({ caption: it.caption, image: cfg.images[it.image] })),
  }).replace(/</g, "\\u003c")};</script>
${script}
</body>
</html>
`;
}
