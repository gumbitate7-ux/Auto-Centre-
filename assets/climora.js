/*
 * CLIMORA theme script — vanilla JS, no dependencies.
 * Progressive enhancement: every feature here has a working no-JS fallback
 * (native Shopify forms, links and <details>).
 */
(() => {
  'use strict';

  const C = window.Climora || { routes: {}, strings: {} };
  const routes = C.routes || {};
  const strings = C.strings || {};
  const DRAWER_SECTION = 'climora-cart-drawer';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Utilities                                                           */
  /* ------------------------------------------------------------------ */
  const debounce = (fn, wait = 250) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  const formatMoney = (cents) => {
    const format = C.moneyFormat || 'R {{amount}}';
    const value = Number(cents || 0);
    const fmt = (n, decimals, thousands = ',', dec = '.') => {
      const fixed = (n / 100).toFixed(decimals);
      const [whole, frac] = fixed.split('.');
      const withSep = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return frac ? withSep + dec + frac : withSep;
    };
    const match = format.match(/\{\{\s*(\w+)\s*\}\}/);
    const key = match ? match[1] : 'amount';
    let out;
    switch (key) {
      case 'amount_no_decimals': out = fmt(value, 0); break;
      case 'amount_with_comma_separator': out = fmt(value, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': out = fmt(value, 0, '.', ','); break;
      case 'amount_with_space_separator': out = fmt(value, 2, ' ', ','); break;
      case 'amount_no_decimals_with_space_separator': out = fmt(value, 0, ' ', ','); break;
      case 'amount_with_apostrophe_separator': out = fmt(value, 2, "'", '.'); break;
      default: out = fmt(value, 2);
    }
    return format.replace(/\{\{\s*\w+\s*\}\}/, out);
  };

  const parseHTML = (html) => new DOMParser().parseFromString(html, 'text/html');

  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...(options.headers || {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.status) {
      const err = new Error(data.description || data.message || strings.error || 'Error');
      err.data = data;
      throw err;
    }
    return data;
  };

  const toast = (() => {
    let timer;
    return (message) => {
      const el = $('[data-toast]');
      if (!el) return;
      $('[data-toast-text]', el).textContent = message;
      el.classList.add('is-visible');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('is-visible'), 2800);
    };
  })();

  /* ------------------------------------------------------------------ */
  /* Overlays: drawers + search (focus trap, Esc, scroll lock)           */
  /* ------------------------------------------------------------------ */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let activeOverlay = null;
  let lastFocus = null;

  const openOverlay = (el, opener) => {
    if (!el) return;
    if (activeOverlay && activeOverlay !== el) closeOverlay(activeOverlay, false);
    lastFocus = opener || document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    $$(`[aria-controls="${el.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    activeOverlay = el;
    const target = $('[data-predictive-input]', el) || $('.drawer__panel', el) || el;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  };

  const closeOverlay = (el = activeOverlay, restore = true) => {
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    $$(`[aria-controls="${el.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (activeOverlay === el) activeOverlay = null;
    if (!activeOverlay) document.body.classList.remove('is-locked');
    if (restore && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  };

  document.addEventListener('keydown', (e) => {
    if (!activeOverlay) return;
    if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); return; }
    if (e.key !== 'Tab') return;
    const items = $$(FOCUSABLE, activeOverlay).filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !activeOverlay.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-drawer-open]');
    if (opener) { e.preventDefault(); openOverlay(document.getElementById(opener.dataset.drawerOpen), opener); return; }

    const cartOpener = e.target.closest('[data-cart-open]');
    if (cartOpener && C.cartType !== 'page' && !document.querySelector('[data-cart-page]')) {
      e.preventDefault();
      openOverlay($('#CartDrawer'), cartOpener);
      return;
    }

    const searchOpener = e.target.closest('[data-search-open]');
    if (searchOpener) { e.preventDefault(); openOverlay($('#SearchModal'), searchOpener); return; }

    if (e.target.closest('[data-drawer-close], [data-search-close]')) {
      e.preventDefault();
      closeOverlay();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Header                                                              */
  /* ------------------------------------------------------------------ */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Cart: rendering + count                                             */
  /* ------------------------------------------------------------------ */
  const cartPage = () => $('[data-cart-page]');

  const sectionsToRender = () => {
    const ids = [DRAWER_SECTION];
    const page = cartPage();
    if (page && page.dataset.sectionId) ids.push(page.dataset.sectionId);
    return ids;
  };

  const updateCount = (count) => {
    $$('[data-cart-count-bubble]').forEach((b) => {
      const prev = b.dataset.count;
      b.dataset.count = String(count);
      b.textContent = count > 0 ? String(count) : '';
      if (String(prev) !== String(count)) {
        b.classList.remove('is-bumped');
        void b.offsetWidth; // restart animation
        b.classList.add('is-bumped');
      }
    });
    $$('[data-cart-open]').forEach((a) => {
      const label = a.getAttribute('aria-label') || '';
      a.setAttribute('aria-label', label.replace(/\d+/, count));
    });
  };

  const renderSections = (sections) => {
    if (!sections) return;
    if (sections[DRAWER_SECTION]) {
      const doc = parseHTML(sections[DRAWER_SECTION]);
      const fresh = $('[data-cart-drawer-inner]', doc);
      const current = $('[data-cart-drawer-inner]');
      if (fresh && current) {
        current.replaceWith(fresh);
        updateCount(Number(fresh.dataset.cartCount || 0));
      }
    }
    const page = cartPage();
    if (page && sections[page.dataset.sectionId]) {
      const doc = parseHTML(sections[page.dataset.sectionId]);
      const fresh = $('[data-cart-page-inner]', doc);
      const current = $('[data-cart-page-inner]', page);
      if (fresh && current) current.replaceWith(fresh);
    }
  };

  const showCartError = (scope, message) => {
    const box = $('[data-cart-error]', scope) || $('[data-cart-error]');
    if (!box) { toast(message); return; }
    $('[data-cart-error-text]', box).textContent = message;
    box.hidden = false;
  };

  const changeLine = async (itemEl, quantity) => {
    const line = Number(itemEl.dataset.line);
    const scope = itemEl.closest('[data-cart-drawer], [data-cart-page]') || document;
    const focusKey = itemEl.dataset.key;
    const inDrawer = !!itemEl.closest('[data-cart-drawer]');
    itemEl.classList.add('is-updating');
    try {
      const data = await fetchJSON(routes.cartChange, {
        method: 'POST',
        body: JSON.stringify({ line, quantity, sections: sectionsToRender(), sections_url: window.location.pathname })
      });
      renderSections(data.sections);
      // Restore focus to the same line (or the drawer panel if removed)
      const container = inDrawer ? $('#CartDrawer') : cartPage();
      const sameLine = container && $(`[data-key="${CSS.escape(focusKey)}"] [data-line-quantity]`, container);
      if (sameLine) sameLine.focus({ preventScroll: true });
      else if (inDrawer) $('.drawer__panel', container)?.focus({ preventScroll: true });
      const requested = quantity;
      const updated = data.items?.find((i) => i.key === focusKey);
      if (updated && updated.quantity < requested) {
        showCartError(container || scope, strings.error);
      }
    } catch (err) {
      itemEl.classList.remove('is-updating');
      showCartError(scope, err.message || strings.error);
    }
  };

  // Quantity steppers (product form + cart lines)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-qty-minus], [data-qty-plus]');
    if (!btn) return;
    const wrap = btn.closest('[data-qty]');
    const input = wrap && $('input', wrap);
    if (!input) return;
    const min = input.min !== '' ? Number(input.min) : 0;
    const max = input.max !== '' ? Number(input.max) : Infinity;
    const step = btn.hasAttribute('data-qty-plus') ? 1 : -1;
    const next = Math.min(max, Math.max(min, (Number(input.value) || 0) + step));
    if (next === Number(input.value)) return;
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.addEventListener('change', debounce((e) => {
    const input = e.target.closest('[data-line-quantity]');
    if (!input) return;
    const item = input.closest('[data-cart-item]');
    if (item) changeLine(item, Math.max(0, Number(input.value) || 0));
  }, 300));

  document.addEventListener('click', (e) => {
    const remove = e.target.closest('[data-line-remove]');
    if (!remove) return;
    const item = remove.closest('[data-cart-item]');
    if (!item) return;
    e.preventDefault();
    changeLine(item, 0);
  });

  // Order note (cart page)
  document.addEventListener('input', debounce((e) => {
    const note = e.target.closest('[data-cart-note]');
    if (!note) return;
    fetchJSON(routes.cart + '/update.js', { method: 'POST', body: JSON.stringify({ note: note.value }) }).catch(() => {});
  }, 600));

  /* ------------------------------------------------------------------ */
  /* Add to cart                                                         */
  /* ------------------------------------------------------------------ */
  const afterAdd = (data, opener) => {
    if (C.cartType === 'page') { window.location.href = routes.cart; return; }
    renderSections(data.sections);
    if (cartPage()) { toast(strings.added); return; }
    openOverlay($('#CartDrawer'), opener);
  };

  const setLoading = (btn, loading) => {
    if (!btn) return;
    btn.classList.toggle('is-loading', loading);
    btn.setAttribute('aria-busy', loading ? 'true' : 'false');
  };

  const showFormError = (form, message) => {
    const box = $('[data-form-error]', form);
    if (!box) { toast(message); return; }
    $('[data-form-error-text]', box).textContent = message;
    box.classList.add('is-visible');
  };
  const clearFormError = (form) => $('[data-form-error]', form)?.classList.remove('is-visible');

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-product-form]');
    if (!form) return;
    e.preventDefault();
    const btn = $('[data-add-button]', form) || form.querySelector('[type="submit"]');
    if (btn?.disabled) return;
    clearFormError(form);
    setLoading(btn, true);
    try {
      const fd = new FormData(form);
      fd.append('sections', sectionsToRender().join(','));
      fd.append('sections_url', window.location.pathname);
      const res = await fetch(routes.cartAdd, { method: 'POST', body: fd, headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
      const data = await res.json();
      if (!res.ok || data.status) throw new Error(data.description || data.message || strings.error);
      afterAdd(data, btn);
    } catch (err) {
      showFormError(form, err.message || strings.error);
    } finally {
      setLoading(btn, false);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Curated sets (bundles) — add multiple items, live total             */
  /* ------------------------------------------------------------------ */
  const bundleSelectedPrice = (el) => {
    if (el.tagName === 'SELECT') return Number(el.selectedOptions[0]?.dataset.price || 0);
    return Number(el.dataset.price || 0);
  };

  document.addEventListener('change', (e) => {
    const select = e.target.closest('[data-bundle] select[data-bundle-variant]');
    if (!select) return;
    const form = select.closest('[data-bundle]');
    const item = select.closest('.bundle__item');
    const linePrice = item && $('[data-bundle-line-price]', item);
    if (linePrice) linePrice.textContent = formatMoney(bundleSelectedPrice(select));
    const total = $$('[data-bundle-variant]', form).reduce((sum, el) => sum + bundleSelectedPrice(el), 0);
    const totalEl = $('[data-bundle-total]', form);
    if (totalEl) totalEl.textContent = formatMoney(total);
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-bundle]');
    if (!form) return;
    e.preventDefault();
    const btn = $('[data-add-button]', form);
    clearFormError(form);
    setLoading(btn, true);
    const items = $$('[data-bundle-variant]', form).map((el) => ({ id: Number(el.value), quantity: 1 }));
    try {
      const data = await fetchJSON(routes.cartAdd, {
        method: 'POST',
        body: JSON.stringify({ items, sections: sectionsToRender(), sections_url: window.location.pathname })
      });
      afterAdd(data, btn);
    } catch (err) {
      showFormError(form, err.message || strings.error);
    } finally {
      setLoading(btn, false);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Product page: variant picker, gallery, sticky add-to-cart           */
  /* ------------------------------------------------------------------ */
  const initProduct = (root) => {
    const section = root.closest('[data-product-section]') || root;
    if (section.dataset.ready) return;
    section.dataset.ready = 'true';

    const form = $('form[data-product-form="main"]', section);
    const picker = $('[data-variant-picker]', section);
    const jsonEl = picker && $('[data-product-json]', picker);
    const product = jsonEl ? JSON.parse(jsonEl.textContent) : null;
    const idInput = form && $('[data-variant-id]', form);
    const addBtn = form && $('[data-main-add]', form);
    const addLabel = addBtn && $('[data-add-label]', addBtn);
    const priceWrap = $('[data-price-wrapper]', $(`#Price-${section.dataset.sectionId}`) || section);
    const stickyPrice = $('[data-sticky-price]');
    const track = $('[data-gallery-track]', section);

    /* Gallery */
    const thumbs = $$('[data-thumb]', section);
    const dots = $$('.gallery__dots span', section);
    const slides = track ? $$('.gallery__slide', track) : [];
    const goToMedia = (mediaId, smooth = true) => {
      const slide = slides.find((s) => s.dataset.mediaId === String(mediaId));
      if (!slide || !track) return;
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
    };
    thumbs.forEach((t) => t.addEventListener('click', () => goToMedia(t.dataset.thumb)));
    if (track && slides.length > 1 && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = slides.indexOf(entry.target);
          thumbs.forEach((t, i) => t.setAttribute('aria-current', i === idx ? 'true' : 'false'));
          dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
          slides.forEach((s, i) => { if (i !== idx) s.querySelectorAll('video').forEach((v) => v.pause()); });
        });
      }, { root: track, threshold: 0.6 });
      slides.forEach((s) => io.observe(s));
    }
    if (track) {
      track.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        track.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * track.clientWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    }

    /* Variants */
    if (product && picker && form) {
      const getSelected = () => {
        const values = [];
        $$('[data-option-index]', picker).forEach((group) => {
          const idx = Number(group.dataset.optionIndex);
          if (group.tagName === 'SELECT') values[idx] = group.value;
          else {
            const checked = $('input:checked', group);
            values[idx] = checked ? checked.value : null;
          }
        });
        return values;
      };

      const updateAvailability = (selected) => {
        $$('fieldset[data-option-index]', picker).forEach((group) => {
          const idx = Number(group.dataset.optionIndex);
          $$('input', group).forEach((input) => {
            const candidate = selected.slice();
            candidate[idx] = input.value;
            const available = product.variants.some((v) => v.available && v.options.every((opt, i) => opt === candidate[i]));
            input.classList.toggle('is-unavailable', !available);
          });
          const label = $('[data-option-selected]', group);
          if (label) label.textContent = selected[idx] || '';
        });
      };

      const onChange = () => {
        const selected = getSelected();
        const variant = product.variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
        updateAvailability(selected);
        clearFormError(form);

        if (!variant) {
          if (addBtn) addBtn.disabled = true;
          if (addLabel) addLabel.textContent = strings.unavailable;
          form.classList.add('is-unavailable');
          return;
        }
        form.classList.remove('is-unavailable');
        idInput.value = variant.id;
        idInput.dispatchEvent(new Event('change', { bubbles: true }));
        if (addBtn) addBtn.disabled = !variant.available;
        if (addLabel) addLabel.textContent = variant.available ? strings.addToCart : strings.soldOut;

        if (priceWrap) {
          const priceEl = $('[data-price]', priceWrap);
          const compareEl = $('[data-compare-price]', priceWrap);
          if (priceEl) priceEl.textContent = formatMoney(variant.price);
          if (compareEl) {
            const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
            compareEl.hidden = !onSale;
            compareEl.textContent = onSale ? formatMoney(variant.compare_at_price) : '';
          }
        }
        if (stickyPrice) stickyPrice.textContent = formatMoney(variant.price);
        if (variant.featured_media) goToMedia(variant.featured_media.id);

        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());
      };

      picker.addEventListener('change', onChange);
      updateAvailability(getSelected());
      // Show the selected variant's image on load
      const initial = product.variants.find((v) => String(v.id) === String(idInput.value));
      if (initial && initial.featured_media) goToMedia(initial.featured_media.id, false);
    }

    /* Sticky add-to-cart (mobile) */
    const sticky = $('[data-sticky-atc]');
    if (sticky && addBtn && 'IntersectionObserver' in window) {
      const stickyBtn = $('[data-sticky-add]', sticky);
      const io = new IntersectionObserver(([entry]) => {
        const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        sticky.classList.toggle('is-visible', show);
        sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
        if (stickyBtn) stickyBtn.tabIndex = show ? 0 : -1;
      });
      io.observe(addBtn);
      stickyBtn?.addEventListener('click', () => {
        if (addBtn.disabled) { addBtn.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }); return; }
        form.requestSubmit ? form.requestSubmit(addBtn) : addBtn.click();
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /* Predictive search                                                   */
  /* ------------------------------------------------------------------ */
  const initPredictive = () => {
    const form = $('[data-predictive-form]');
    if (!form || !routes.predictiveSearch) return;
    const input = $('[data-predictive-input]', form);
    const target = $('[data-predictive-target]');
    const initial = target ? target.innerHTML : '';
    let controller;

    const search = debounce(async () => {
      const q = input.value.trim();
      if (!q) { target.innerHTML = initial; input.setAttribute('aria-expanded', 'false'); return; }
      controller?.abort();
      controller = new AbortController();
      try {
        const url = `${routes.predictiveSearch}?q=${encodeURIComponent(q)}&section_id=predictive-search&resources[type]=product,collection,page,query&resources[limit]=4&resources[options][unavailable_products]=last`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(res.statusText);
        const html = await res.text();
        const fresh = $('#predictive-search-results', parseHTML(html));
        if (fresh) {
          target.innerHTML = fresh.innerHTML;
          input.setAttribute('aria-expanded', 'true');
        }
      } catch (err) {
        if (err.name !== 'AbortError') target.innerHTML = initial;
      }
    }, 280);

    input.addEventListener('input', search);
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const links = $$('a', target);
      if (!links.length) return;
      e.preventDefault();
      const idx = links.indexOf(document.activeElement);
      const next = e.key === 'ArrowDown' ? links[Math.min(links.length - 1, idx + 1)] : links[Math.max(0, idx - 1)];
      next.focus();
    });
    target.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const links = $$('a', target);
      const idx = links.indexOf(document.activeElement);
      if (idx === -1) return;
      e.preventDefault();
      if (e.key === 'ArrowUp' && idx === 0) { input.focus(); return; }
      const next = e.key === 'ArrowDown' ? links[Math.min(links.length - 1, idx + 1)] : links[idx - 1];
      next.focus();
    });
  };

  /* ------------------------------------------------------------------ */
  /* Collection sort, reveal-on-scroll                                   */
  /* ------------------------------------------------------------------ */
  document.addEventListener('change', (e) => {
    const select = e.target.closest('[data-sort-select]');
    if (!select) return;
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', select.value);
    url.searchParams.delete('page');
    window.location.href = url.toString();
  });

  const initReveal = (ctx = document) => {
    const els = $$('[data-reveal]:not(.is-revealed)', ctx);
    if (!els.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-revealed')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  };

  /* ------------------------------------------------------------------ */
  /* Init + theme editor support                                         */
  /* ------------------------------------------------------------------ */
  const init = (ctx = document) => {
    $$('[data-product-section]', ctx).forEach(initProduct);
    initReveal(ctx);
  };

  init();
  initPredictive();

  document.addEventListener('shopify:section:load', (e) => {
    init(e.target);
    if (e.target.querySelector('[data-predictive-form]')) initPredictive();
  });
  document.addEventListener('shopify:section:unload', () => { if (activeOverlay) closeOverlay(activeOverlay, false); });
})();
