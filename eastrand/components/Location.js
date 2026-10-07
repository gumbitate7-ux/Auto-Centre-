import { esc, icon, lines, callAttrs, whatsappHref, waMessages } from "./_lib.js";

export const addressLine = (cfg) => {
  const a = cfg.business.address;
  return [a.street, a.suburb, a.region, a.postalCode].filter(Boolean).join(", ");
};
export const directionsHref = (cfg) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.business.name + " " + addressLine(cfg))}`;

export default function Location(cfg) {
  const l = cfg.location;
  const hours = cfg.business.hours;
  return `
<section class="section location dark" id="location" aria-labelledby="loc-title">
  <div class="loc-grid container">
    <div class="loc-copy">
      <h2 class="display reveal" id="loc-title">${lines(l.headline)}</h2>
      <p class="lead reveal">${esc(l.body)}</p>
      <address class="loc-address reveal">${icon("pin")}<span>${esc(addressLine(cfg))}</span></address>
      ${hours.length ? `<dl class="loc-hours reveal">${hours.map((h) => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join("")}</dl>` : ""}
      <div class="loc-actions reveal">
        <a class="btn btn-accent" href="${directionsHref(cfg)}" target="_blank" rel="noopener">${icon("pin")}Get directions</a>
        <a class="btn btn-ghost" ${callAttrs(cfg)}>${icon("phone")}Call the workshop</a>
        <a class="btn btn-ghost" href="${whatsappHref(cfg, waMessages(cfg).general)}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp the workshop</a>
      </div>
    </div>
    <figure class="loc-map reveal" aria-label="Map of Kempton Park and the East Rand">
      <svg viewBox="0 0 600 600" role="img" aria-labelledby="map-title">
        <title id="map-title">Stylised map showing the workshop in Kempton Park, East Rand</title>
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#D99A2E" stop-opacity=".22"/><stop offset="1" stop-color="#D99A2E" stop-opacity="0"/></radialGradient>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="#F4F3EF" stroke-opacity=".05"/></pattern>
        </defs>
        <rect width="600" height="600" fill="url(#map-grid)"/>
        <g fill="none" stroke="#F4F3EF" stroke-linecap="round">
          <path class="road road-major" d="M-20 470C120 430 220 420 300 330S470 150 640 120"/>
          <path class="road road-major" d="M40 -20C90 120 170 230 300 330S520 520 560 640"/>
          <path class="road" d="M-20 250C110 260 200 290 300 330s230 30 330 10"/>
          <path class="road" d="M210 -20c10 120 40 230 90 350"/>
          <path class="road road-minor" d="M0 380c120-10 230 10 340 70s170 90 280 70"/>
          <path class="road road-minor" d="M420 -20c-20 140-30 250-30 330s20 200 60 310"/>
          <path class="road road-minor" d="M-20 130c150 20 280 60 420 40s180-40 220-60"/>
        </g>
        <circle cx="300" cy="330" r="150" fill="url(#map-glow)"/>
        <g class="map-label" fill="#F4F3EF" font-family="inherit" opacity=".45">
          <text x="250" y="60">Tembisa</text>
          <text x="40" y="120">Midrand</text>
          <text x="40" y="520">Edenvale</text>
          <text x="440" y="400">OR Tambo</text>
          <text x="250" y="575">Boksburg</text>
          <text x="480" y="530">Benoni</text>
        </g>
        <g class="map-pin" transform="translate(300 330)">
          <circle r="34" class="pin-pulse" fill="#D99A2E" fill-opacity=".18"/>
          <circle r="9" fill="#D99A2E"/>
          <circle r="3.5" fill="#0B0B0B"/>
        </g>

      </svg>
      <p class="map-card"><strong>${esc(cfg.business.name)}</strong><span>${esc(cfg.business.address.suburb)}</span></p>
    </figure>
  </div>
</section>`;
}
