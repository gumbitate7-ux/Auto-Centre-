import { esc, markSvg } from "./_lib.js";
import { addressLine } from "./Contact.js";
import Navbar from "./Navbar.js";
import Hero from "./Hero.js";
import Credentials from "./Credentials.js";
import Services from "./Services.js";
import Process from "./Process.js";
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
    "@type": "AutoBodyShop",
    name: b.name,
    description: cfg.seo.description,
    ...(b.areaServed?.length && { areaServed: b.areaServed }),
    ...(b.socials.facebook && { sameAs: [b.socials.facebook, b.socials.instagram].filter(Boolean) }),
    address: {
      "@type": "PostalAddress",
      ...(b.address.street && { streetAddress: [b.address.street, b.address.suburb].filter(Boolean).join(", ") }),
      ...((b.address.city || b.address.suburb) && { addressLocality: b.address.city || b.address.suburb }),
      ...(b.address.province && { addressRegion: b.address.province }),
      ...(b.address.postalCode && { postalCode: b.address.postalCode }),
      addressCountry: "ZA",
    },
    ...(b.phoneE164 && { telephone: b.phoneE164 }),
    ...(b.email && { email: b.email }),
    ...(b.credentials?.established && { foundingDate: b.credentials.established }),
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
<meta name="theme-color" content="#1A100C">
${s.url ? `<link rel="canonical" href="${esc(s.url)}">` : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.business.name)}">
<meta property="og:title" content="${esc(cfg.business.name)}: ${esc(cfg.business.tagline)}">
<meta property="og:description" content="${esc(s.description)}">
<meta property="og:locale" content="en_ZA">
${s.url ? `<meta property="og:url" content="${esc(s.url)}">` : ""}
${cfg.business.address.province === "Gauteng" ? `<meta name="geo.region" content="ZA-GP">` : ""}
${addressLine(cfg) ? `<meta name="geo.placename" content="${esc(addressLine(cfg))}">` : ""}
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -31 114 114"><rect x="-14" y="-31" width="114" height="114" rx="16" fill="#6E3A2B"/>${markSvg("").replace(/<svg[^>]*>|<\/svg>/g, "").replace(/<polygon/g, '<polygon fill="#47A877"')}</svg>`)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://unsplash.com">
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,300..800&family=Barlow+Condensed:wght@600&display=swap" rel="stylesheet">
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
${Credentials(cfg)}
${Services(cfg)}
${Process(cfg)}
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
