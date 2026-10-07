import { esc, media, icon, pad2 } from "./_lib.js";

export default function ServiceCard(cfg, s, i) {
  return `
  <li class="svc reveal" style="--i:${i % 4}">
    <a class="svc-link" href="#contact" data-service="${esc(s.title)}">
      ${media(cfg, s.image, { sizes: "(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw", maxWidth: 1280, frameClass: "svc-media" })}
      <span class="svc-num">${pad2(i + 1)}</span>
      <span class="svc-body">
        <span class="svc-title">${esc(s.title)}</span>
        <span class="svc-text">${esc(s.text)}</span>
        <span class="svc-cta">Enquire ${icon("arrow")}</span>
      </span>
    </a>
  </li>`;
}
