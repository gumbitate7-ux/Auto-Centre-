// Auto Centre Panel Beaters — concept site
// Every call to action ends in a pre-filled WhatsApp message to the workshop.

(() => {
  // Change this one number to send leads somewhere else (international format, digits only).
  const WHATSAPP_NUMBER = "27826655966";
  const SHOP = "Auto Centre";

  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  const presets = {
    general: `Hi ${SHOP}, I'd like a quote for my car. I'll send photos of the damage in this chat.\n\nMy car: `,
    insurance: `Hi ${SHOP}, I need a quote for an insurance claim.\n\nClaim number: \nInsurer: \nMy car: \n\nI'll send photos of the damage in this chat.`,
  };

  // Static WhatsApp buttons get real hrefs, so they work even before JS events and on long-press.
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const key = el.dataset.wa;
    const text = presets[key] ??
      `Hi ${SHOP}, I'd like a quote for ${key.toLowerCase()}.\n\nMy car: \n\nI'll send photos in this chat.`;
    el.href = waLink(text);
    el.target = "_blank";
    el.rel = "noopener";
  });

  // ---------- Damage picker ----------
  const car = document.getElementById("car");
  const picked = document.getElementById("picked");
  const selected = new Set();
  const panels = [...car.querySelectorAll(".panel")];

  panels.forEach((g) => {
    const name = g.dataset.panel;
    g.setAttribute("role", "checkbox");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-checked", "false");
    g.setAttribute("aria-label", name);
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = name;
    g.prepend(title);

    g.addEventListener("click", () => toggle(name));
    g.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(name); }
    });
  });

  function toggle(name) {
    selected.has(name) ? selected.delete(name) : selected.add(name);
    render();
  }

  function render() {
    panels.forEach((g) => g.setAttribute("aria-checked", String(selected.has(g.dataset.panel))));
    picked.replaceChildren();
    if (!selected.size) {
      const li = document.createElement("li");
      li.className = "picked-empty";
      li.textContent = "None yet. Tap the car, or skip this and just send photos.";
      picked.append(li);
      return;
    }
    selected.forEach((name) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Remove ${name}`);
      btn.innerHTML = `<span></span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
      btn.firstChild.textContent = name;
      btn.addEventListener("click", () => toggle(name));
      li.append(btn);
      picked.append(li);
    });
  }

  // ---------- Quote request ----------
  const form = document.getElementById("quote");
  const foot = document.getElementById("quote-foot");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const damage = [...form.querySelectorAll("#damage input:checked")].map((i) => i.value);
    const model = form.querySelector("#car-model").value.trim();
    const name = form.querySelector("#cust-name").value.trim();
    const payer = form.querySelector('input[name="payer"]:checked').value;

    const lines = [`Hi ${SHOP}, I'd like a quote please.`, ""];
    if (name) lines.push(`Name: ${name}`);
    lines.push(`Car: ${model || "(I'll tell you in the chat)"}`);
    if (damage.length) lines.push(`Damage: ${damage.join(", ")}`);
    if (selected.size) lines.push(`Panels: ${[...selected].join(", ")}`);
    lines.push(`Payment: ${payer}`);
    if (payer === "Insurance claim") lines.push("Claim number: ");
    lines.push("", "I'll send photos of the damage in this chat.");

    const url = waLink(lines.join("\n"));
    const win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url;

    foot.textContent = "Your quote request is ready in WhatsApp. Add your photos there and press send.";
    foot.classList.add("is-sent");
  });

  // ---------- Open now (Johannesburg time) ----------
  // Sunday = 0. Times in minutes after midnight.
  const HOURS = { 0: [480, 840], 1: [450, 1080], 2: [450, 1080], 3: [450, 1080], 4: [450, 1080], 5: [450, 1080], 6: [480, 840] };
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmt = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Johannesburg", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    const now = Number(parts.hour) * 60 + Number(parts.minute);
    const [open, close] = HOURS[day];
    const status = document.getElementById("open-status");

    if (now >= open && now < close) {
      status.textContent = `Open now, until ${fmt(close)} today`;
      status.classList.add("is-open");
    } else {
      const nextDay = now < open ? day : (day + 1) % 7;
      const when = nextDay === day ? "today" : nextDay === (day + 1) % 7 ? "tomorrow" : DAY_NAMES[nextDay];
      status.textContent = `Closed now. Opens ${when} at ${fmt(HOURS[nextDay][0])}. WhatsApp us anyway and we'll reply first thing.`;
    }

    document.querySelectorAll(".hours tr[data-days]").forEach((tr) => {
      if (tr.dataset.days.split(",").map(Number).includes(day)) tr.classList.add("is-today");
    });
  } catch { /* Leave the static hours text in place. */ }
})();
