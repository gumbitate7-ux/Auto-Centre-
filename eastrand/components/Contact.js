import { esc, icon, callAttrs, whatsappHref, waMessages } from "./_lib.js";
import { addressLine, directionsHref } from "./Location.js";

export default function Contact(cfg) {
  const c = cfg.contact;
  const b = cfg.business;
  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="contact-grid container">
    <div class="contact-intro">
      <h2 class="display reveal" id="contact-title">${esc(c.headline)}</h2>
      <p class="lead reveal">${esc(c.body)}</p>
      <ul class="contact-ways reveal">
        <li><a href="${whatsappHref(cfg, waMessages(cfg).general)}" target="_blank" rel="noopener">
          <span class="cw-ico">${icon("whatsapp")}</span>
          <span><strong>WhatsApp</strong><span>Fastest way to reach us. Send photos too.</span></span>${icon("arrow", "cw-arrow")}</a></li>
        <li><a ${callAttrs(cfg)}>
          <span class="cw-ico">${icon("phone")}</span>
          <span><strong>Call</strong><span>${b.phoneDisplay ? esc(b.phoneDisplay) : "Speak to the workshop directly."}</span></span>${icon("arrow", "cw-arrow")}</a></li>
        <li><a href="${directionsHref(cfg)}" target="_blank" rel="noopener">
          <span class="cw-ico">${icon("pin")}</span>
          <span><strong>Location</strong><span>${esc(addressLine(cfg))}</span></span>${icon("arrow", "cw-arrow")}</a></li>
      </ul>
    </div>

    <form class="quote-form reveal" data-quote-form novalidate aria-labelledby="form-title">
      <h3 class="form-title" id="form-title">Request a quote</h3>
      <div class="field">
        <label for="f-name">Name</label>
        <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err">
        <p class="field-err" id="f-name-err" role="alert"></p>
      </div>
      <div class="field">
        <label for="f-phone">Phone</label>
        <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="f-phone-err" placeholder="e.g. 082 123 4567">
        <p class="field-err" id="f-phone-err" role="alert"></p>
      </div>
      <div class="field">
        <label for="f-vehicle">Vehicle make &amp; model</label>
        <input id="f-vehicle" name="vehicle" type="text" autocomplete="off" placeholder="e.g. 2018 Toyota Corolla">
      </div>
      <div class="field">
        <label for="f-service">Service required</label>
        <div class="select">
          <select id="f-service" name="service">
            ${c.serviceOptions.map((o) => `<option>${esc(o)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field field-full">
        <label for="f-message">Message <span class="opt">(optional)</span></label>
        <textarea id="f-message" name="message" rows="4" placeholder="What's the car doing? Any warning lights or noises?"></textarea>
      </div>
      <div class="form-foot field-full">
        <button class="btn btn-accent btn-lg" type="submit">Request a quote</button>
        <p class="form-note" data-form-note>Your request opens in WhatsApp, ready to send to the workshop.</p>
      </div>
    </form>
  </div>
</section>`;
}
