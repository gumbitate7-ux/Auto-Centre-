// Eastern Auto Body — interactions. No dependencies.
(() => {
  const SITE = window.SITE || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const waLink = (text) => `https://wa.me/${SITE.whatsapp || ""}?text=${encodeURIComponent(text)}`;
  const imageUrl = (image, w = 1920) =>
    image.src ? image.src : `https://unsplash.com/photos/${image.unsplash}/download?force=true&w=${w}`;

  // ---------- Toast ----------
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 4200);
  }

  // Call buttons without a configured number explain themselves instead of dialling nowhere.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-demo-call]");
    if (!a) return;
    e.preventDefault();
    toast("Demo: this button calls the workshop once its number is added.");
  });

  // ---------- Nav: transparent over the hero, solid once scrolling ----------
  const nav = $("[data-nav]");
  const hero = $(".hero");
  const mcta = $("[data-mcta]");
  const navLinks = $$(".nav-links a");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle("is-solid", y > 24);
      mcta?.classList.toggle("is-on", y > hero.offsetHeight * 0.55 && !document.body.classList.contains("is-locked"));

      // Scroll spy
      const mark = y + innerHeight * 0.35;
      let current = null;
      sections.forEach((s) => { if (s.getBoundingClientRect().top + y <= mark) current = s; });
      navLinks.forEach((a) => a.setAttribute("aria-current", String(current && a.getAttribute("href") === "#" + current.id)));

      parallax();
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  // ---------- Mobile menu ----------
  const menu = $("[data-menu]");
  const openBtn = $("[data-menu-open]");
  $$(".menu-links li a").forEach((a, i) => a.style.setProperty("--d", i));

  function openMenu() {
    menu.hidden = false;
    menu.classList.add("is-open");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    mcta?.classList.remove("is-on");
    $("[data-menu-close]").focus();
  }
  function closeMenu(returnFocus = true) {
    menu.classList.remove("is-open");
    menu.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    if (returnFocus) openBtn.focus();
    onScroll();
  }
  openBtn.addEventListener("click", openMenu);
  $("[data-menu-close]").addEventListener("click", () => closeMenu());
  $$("[data-menu-link]", menu).forEach((a) => a.addEventListener("click", () => closeMenu(false)));
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
    if (e.key !== "Tab") return;
    const f = $$("a, button", menu).filter((el) => el.offsetParent !== null);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  });

  // ---------- Quote buttons + service rows prefill the form ----------
  const form = $("[data-quote-form]");
  const serviceSelect = $("#f-service");
  const pickService = (name) => {
    const opt = [...serviceSelect.options].find((o) => o.text === name);
    if (opt) serviceSelect.value = opt.value;
  };
  document.addEventListener("click", (e) => {
    const svc = e.target.closest("[data-service]");
    if (svc) pickService(svc.dataset.service);
  });

  // ---------- Scroll reveal ----------
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
  $$(".reveal").forEach((el) => revealIO.observe(el));

  // ---------- Subtle parallax on the "why us" photo ----------
  const para = $(".parallax");
  function parallax() {
    if (!para || reduceMotion) return;
    const r = para.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const progress = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1..1 around centre
    para.style.transform = `translate3d(0, ${(progress * -6).toFixed(2)}%, 0)`;
  }

  // ---------- Services: photo panel follows the hovered or focused row ----------
  const svc = $("[data-svc]");
  if (svc) {
    const rows = $$("[data-row]", svc);
    const shots = $$("[data-shot]", svc);
    const tag = $("[data-preview-tag]", svc);
    const activate = (i) => {
      rows.forEach((r, k) => r.classList.toggle("is-active", k === i));
      shots.forEach((s, k) => s.classList.toggle("is-active", k === i));
      if (tag) tag.textContent = $(".svc-title", rows[i]).textContent;
    };
    rows.forEach((r, i) => {
      r.addEventListener("mouseenter", () => activate(i));
      r.addEventListener("focus", () => activate(i));
    });
  }

  // ---------- Gallery lightbox ----------
  const lb = $("[data-lightbox]");
  if (lb && SITE.gallery?.length) {
    const frame = $(".lb-img", lb);
    const cap = $(".lb-cap", lb);
    const count = $(".lb-count", lb);
    let idx = 0;
    const show = (i) => {
      idx = (i + SITE.gallery.length) % SITE.gallery.length;
      const item = SITE.gallery[idx];
      frame.classList.remove("is-missing", "is-swapping");
      frame.dataset.label = item.image.alt;
      const im = new Image();
      im.alt = item.image.alt;
      im.decoding = "async";
      im.onerror = () => frame.classList.add("is-missing");
      im.src = imageUrl(item.image);
      frame.replaceChildren(im);
      void frame.offsetWidth;
      frame.classList.add("is-swapping");
      cap.textContent = item.caption;
      count.textContent = `${idx + 1} / ${SITE.gallery.length}`;
    };
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-lightbox-open]");
      if (!t) return;
      show(Number(t.dataset.lightboxOpen));
      lb.showModal();
    });
    $("[data-lb-prev]", lb).addEventListener("click", () => show(idx - 1));
    $("[data-lb-next]", lb).addEventListener("click", () => show(idx + 1));
    $("[data-lb-close]", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-frame")) lb.close(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let sx = null;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 48) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  // ---------- Quote form → WhatsApp ----------
  if (form) {
    const note = $("[data-form-note]", form);
    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Enter your name so we know who to ask for."),
      phone: (v) => (v.replace(/\D/g, "").length >= 9 ? "" : "Enter a phone number we can call you back on, e.g. 082 123 4567."),
    };
    const check = (input) => {
      const msg = rules[input.name]?.(input.value) ?? "";
      input.setAttribute("aria-invalid", String(!!msg));
      $("#" + input.id + "-err").textContent = msg;
      return !msg;
    };
    ["name", "phone"].forEach((n) => {
      const input = form.elements[n];
      input.addEventListener("blur", () => { if (input.value) check(input); });
      input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true") check(input); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = ["name", "phone"].map((n) => form.elements[n]).filter((i) => !check(i));
      if (invalid.length) { invalid[0].focus(); return; }
      const f = form.elements;
      const val = (el) => el.value.trim();
      const lines = [
        `Hi ${SITE.name}, I'd like a quote please.`,
        "",
        `Name: ${val(f.name)}`,
        `Phone: ${val(f.phone)}`,
        val(f.vehicle) ? `Vehicle: ${val(f.vehicle)}` : null,
        val(f.reg) ? `Registration: ${val(f.reg).toUpperCase()}` : null,
        `Work needed: ${f.service.value}`,
        `Payment: ${f.payer.value}`,
        f.payer.value === "Insurance claim" ? "Insurer and claim number: " : null,
        val(f.message) ? `\n${val(f.message)}` : null,
        "",
        "I'll send photos of the damage in this chat.",
      ].filter((l) => l !== null);
      const url = waLink(lines.join("\n"));
      const win = window.open(url, "_blank", "noopener");
      if (!win) location.href = url;
      note.textContent = "Your request is ready in WhatsApp. Attach a few photos of the damage, then press send.";
      note.classList.add("is-done");
    });
  }

  onScroll();
})();
