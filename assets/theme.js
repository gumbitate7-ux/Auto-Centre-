/* Homeward theme scripts. No dependencies. */
(function () {
  'use strict';

  var config = window.Homeward || { routes: {}, delivery: {} };
  var routes = config.routes || {};

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ------------------------------------------------------------------
     Focus trap helpers for drawers
  ------------------------------------------------------------------ */
  var lastFocused = null;

  function openLayer(layer, focusTarget) {
    lastFocused = document.activeElement;
    layer.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    var target = focusTarget || layer.querySelector('button, a, input');
    if (target) target.focus();
  }

  function closeLayer(layer) {
    layer.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    $$('[data-mobile-nav]:not([hidden]), [data-cart-drawer]:not([hidden])').forEach(function (layer) {
      if (layer.matches('[data-mobile-nav]')) setMenu(false);
      else closeLayer(layer);
    });
  });

  /* ------------------------------------------------------------------
     Announcement bar (rotates on mobile)
  ------------------------------------------------------------------ */
  $$('[data-announcement]').forEach(function (bar) {
    var messages = $$('.announcement__message', bar);
    if (messages.length < 2) return;
    var index = 0;
    setInterval(function () {
      if (window.matchMedia('(min-width: 990px)').matches) return;
      messages[index].classList.remove('is-active');
      index = (index + 1) % messages.length;
      messages[index].classList.add('is-active');
    }, 4500);
  });

  /* ------------------------------------------------------------------
     Mobile menu
  ------------------------------------------------------------------ */
  var mobileNav = $('[data-mobile-nav]');
  var menuToggle = $('[data-menu-toggle]');

  function setMenu(open) {
    if (!mobileNav) return;
    if (open) openLayer(mobileNav, $('[data-menu-close].header-icon', mobileNav));
    else closeLayer(mobileNav);
    if (menuToggle) menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      setMenu(true);
    });
  }

  $$('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      setMenu(false);
    });
  });

  if (mobileNav) {
    $$('a', mobileNav).forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.getAttribute('href').indexOf('#') !== -1) setMenu(false);
      });
    });
  }

  /* ------------------------------------------------------------------
     Cart (drawer + page) via the Ajax Cart API and Section Rendering API
  ------------------------------------------------------------------ */
  var drawer = $('[data-cart-drawer]');

  function sectionUrl() {
    return (routes.root || '/') + '?section_id=cart-drawer';
  }

  function updateCount(count) {
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
    $$('[data-cart-toggle]').forEach(function (el) {
      el.setAttribute('aria-label', 'Cart, ' + count + ' items');
    });
  }

  function renderDrawer(html) {
    if (!drawer || !html) return;
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var fresh = doc.querySelector('[data-cart-drawer-contents]');
    var current = $('[data-cart-drawer-contents]', drawer);
    if (fresh && current) current.replaceWith(fresh);
    bindDrawer();
  }

  function refreshDrawer() {
    return fetch(sectionUrl())
      .then(function (r) {
        return r.text();
      })
      .then(renderDrawer);
  }

  function openDrawer() {
    if (!drawer) {
      window.location.href = routes.cart || '/cart';
      return;
    }
    openLayer(drawer, $('.cart-drawer__panel', drawer));
  }

  function bindDrawer() {
    if (!drawer) return;
    $$('[data-cart-close]', drawer).forEach(function (el) {
      el.onclick = function () {
        closeLayer(drawer);
      };
    });
  }

  function changeLine(line, quantity, onDone) {
    if (drawer) drawer.classList.add('is-busy');
    return fetch((routes.cartChange || '/cart/change') + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: Number(line), quantity: Number(quantity), sections: 'cart-drawer' })
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (cart) {
        updateCount(cart.item_count);
        if (cart.sections) renderDrawer(cart.sections['cart-drawer']);
        if (onDone) onDone(cart);
      })
      .finally(function () {
        if (drawer) drawer.classList.remove('is-busy');
      });
  }

  // Quantity buttons inside cart line items (drawer and cart page)
  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-cart-qty]');
    if (!btn) return;
    event.preventDefault();
    var onPage = btn.closest('[data-cart-page]');
    changeLine(btn.getAttribute('data-cart-line'), btn.getAttribute('data-cart-qty'), function () {
      if (onPage) window.location.reload();
    });
  });

  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-cart-input]');
    if (!input) return;
    changeLine(input.getAttribute('data-cart-line'), Math.max(0, parseInt(input.value, 10) || 0), function () {
      window.location.reload();
    });
  });

  // Header cart icon opens the drawer
  $$('[data-cart-toggle]').forEach(function (el) {
    el.addEventListener('click', function (event) {
      if (config.cartType !== 'drawer' || !drawer) return;
      event.preventDefault();
      openDrawer();
    });
  });

  bindDrawer();

  /* ------------------------------------------------------------------
     Product forms: Ajax add to cart
  ------------------------------------------------------------------ */
  $$('[data-product-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (config.cartType !== 'drawer' || !drawer || !window.fetch) return;
      event.preventDefault();

      var buttons = $$('[name="add"]').filter(function (b) {
        return b.form === form;
      });
      var error = $('[data-form-error]', form);
      buttons.forEach(function (b) {
        b.classList.add('is-loading');
        b.setAttribute('aria-busy', 'true');
      });
      if (error) error.hidden = true;

      var data = new FormData(form);
      data.append('sections', 'cart-drawer');
      data.append('sections_url', window.location.pathname);

      fetch((routes.cartAdd || '/cart/add') + '.js', {
        method: 'POST',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: data
      })
        .then(function (r) {
          return r.json().then(function (json) {
            return { ok: r.ok, json: json };
          });
        })
        .then(function (res) {
          if (!res.ok) {
            if (error) {
              error.textContent = res.json.description || res.json.message || 'Something went wrong. Please try again.';
              error.hidden = false;
            }
            return;
          }
          var sections = res.json.sections || {};
          if (sections['cart-drawer']) renderDrawer(sections['cart-drawer']);
          return fetch((routes.cart || '/cart') + '.js')
            .then(function (r) {
              return r.json();
            })
            .then(function (cart) {
              updateCount(cart.item_count);
              if (!sections['cart-drawer']) return refreshDrawer();
            })
            .then(openDrawer);
        })
        .catch(function () {
          form.submit();
        })
        .finally(function () {
          buttons.forEach(function (b) {
            b.classList.remove('is-loading');
            b.removeAttribute('aria-busy');
          });
        });
    });
  });

  /* ------------------------------------------------------------------
     Quantity steppers in product forms
  ------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var step = event.target.closest('[data-qty-step]');
    if (!step) return;
    var wrap = step.closest('[data-qty]');
    var input = wrap && $('[data-qty-input]', wrap);
    if (!input) return;
    var min = parseInt(input.min, 10) || 1;
    var max = parseInt(input.max, 10) || 99;
    var next = (parseInt(input.value, 10) || min) + parseInt(step.getAttribute('data-qty-step'), 10);
    input.value = Math.min(max, Math.max(min, next));
  });

  /* ------------------------------------------------------------------
     Variant picker
  ------------------------------------------------------------------ */
  function formatMoney(cents) {
    var amount = cents / 100;
    var whole = amount % 1 === 0;
    return 'R' + amount.toLocaleString('en-ZA', {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2
    }).replace(/ /g, ' ');
  }

  $$('[data-variant-picker]').forEach(function (picker) {
    var json = $('[data-variants]', picker);
    if (!json) return;
    var variants = JSON.parse(json.textContent);
    var section = picker.closest('[data-product-section]') || document;
    var form = document.getElementById(picker.getAttribute('data-form-id'));

    picker.addEventListener('change', function () {
      var selected = $$('.variant-picker__input:checked', picker).map(function (input) {
        return input.value;
      });
      $$('[data-option-label]', picker).forEach(function (label, i) {
        label.textContent = selected[i] || '';
      });
      var variant = variants.find(function (v) {
        return v.options.every(function (opt, i) {
          return opt === selected[i];
        });
      });
      var addButtons = $$('[name="add"]').filter(function (b) {
        return b.form === form;
      });
      if (!variant) {
        addButtons.forEach(function (b) {
          b.disabled = true;
        });
        return;
      }
      if (form) $('[data-variant-id]', form).value = variant.id;
      $$('[data-price]', section).forEach(function (el) {
        el.textContent = formatMoney(variant.price);
      });
      $$('[data-add-price]', section).forEach(function (el) {
        el.textContent = '· ' + formatMoney(variant.price);
      });
      $$('[data-add-label]', section).forEach(function (el) {
        el.textContent = variant.available ? 'Add to cart' : 'Sold out';
      });
      addButtons.forEach(function (b) {
        b.disabled = !variant.available;
      });
      if (variant.featured_media) {
        var slide = $('[data-media-id="' + variant.featured_media.id + '"]', section);
        if (slide) showSlide(slide.closest('[data-gallery]'), $$('[data-gallery-slide]', slide.closest('[data-gallery]')).indexOf(slide));
      }
      if (section.matches && section.matches('.product-section')) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());
      }
    });
  });

  /* ------------------------------------------------------------------
     Gallery
  ------------------------------------------------------------------ */
  function showSlide(gallery, index) {
    if (!gallery || index < 0) return;
    var viewport = $('[data-gallery-viewport]', gallery);
    var slides = $$('[data-gallery-slide]', gallery);
    var thumbs = $$('[data-gallery-thumb]', gallery);
    if (!slides[index]) return;
    viewport.scrollTo({ left: slides[index].offsetLeft - viewport.offsetLeft, behavior: 'smooth' });
    thumbs.forEach(function (t, i) {
      t.classList.toggle('is-active', i === index);
    });
  }

  $$('[data-gallery]').forEach(function (gallery) {
    var viewport = $('[data-gallery-viewport]', gallery);
    var thumbs = $$('[data-gallery-thumb]', gallery);
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        showSlide(gallery, parseInt(thumb.getAttribute('data-gallery-thumb'), 10));
      });
    });
    var ticking = false;
    viewport.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var index = Math.round(viewport.scrollLeft / viewport.clientWidth);
        thumbs.forEach(function (t, i) {
          t.classList.toggle('is-active', i === index);
        });
        ticking = false;
      });
    });
  });

  /* ------------------------------------------------------------------
     Sticky add-to-cart bar
  ------------------------------------------------------------------ */
  var stickyBar = $('[data-sticky-buy]');
  var mainButtons = $('[data-main-buy-buttons]');
  if (stickyBar && mainButtons && 'IntersectionObserver' in window) {
    stickyBar.hidden = false;
    new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      stickyBar.classList.toggle('is-visible', show);
      document.body.classList.toggle('has-sticky-buy', show);
    }).observe(mainButtons);
  }

  /* ------------------------------------------------------------------
     Delivery estimate (South African time, skips weekends + public holidays)
  ------------------------------------------------------------------ */
  var delivery = config.delivery || {};
  var holidays = (delivery.holidays || []).map(function (d) {
    return String(d).trim();
  });

  function saNow() {
    // SAST is UTC+2 all year (no daylight saving)
    var now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 2 * 3600000);
  }

  function ymd(date) {
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + m + '-' + d;
  }

  function isWorkingDay(date) {
    var day = date.getDay();
    return day !== 0 && day !== 6 && holidays.indexOf(ymd(date)) === -1;
  }

  function addWorkingDays(date, count) {
    var d = new Date(date.getTime());
    var added = 0;
    while (added < count) {
      d.setDate(d.getDate() + 1);
      if (isWorkingDay(d)) added++;
    }
    return d;
  }

  function nextWorkingDay(date) {
    var d = new Date(date.getTime());
    do {
      d.setDate(d.getDate() + 1);
    } while (!isWorkingDay(d));
    return d;
  }

  function fmtDay(date) {
    return date.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function renderEstimate() {
    var boxes = $$('[data-delivery-estimate]');
    if (!boxes.length) return;
    var cutoff = Number(delivery.cutoff) || 13;
    var min = Number(delivery.min) || 2;
    var max = Math.max(min, Number(delivery.max) || 4);
    var now = saNow();
    var dispatch;
    var dispatchText;

    if (isWorkingDay(now) && now.getHours() < cutoff) {
      dispatch = now;
      var cutoffTime = new Date(now.getTime());
      cutoffTime.setHours(cutoff, 0, 0, 0);
      var mins = Math.max(1, Math.round((cutoffTime - now) / 60000));
      var h = Math.floor(mins / 60);
      var m = mins % 60;
      var left = (h ? h + ' hr' + (h > 1 ? 's' : '') + ' ' : '') + m + ' min';
      dispatchText = 'Order within <strong>' + left + '</strong> and we dispatch it <strong>today</strong>.';
    } else {
      dispatch = nextWorkingDay(now);
      var label = fmtDay(dispatch);
      var tomorrow = new Date(now.getTime());
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (ymd(dispatch) === ymd(tomorrow)) label = 'tomorrow';
      dispatchText = 'Order now and we dispatch it <strong>' + label + '</strong>.';
    }

    var from = addWorkingDays(dispatch, min);
    var to = addWorkingDays(dispatch, max);
    var windowText = 'Estimated delivery: <strong>' + fmtDay(from) + ' – ' + fmtDay(to) + '</strong> (main centres).';

    boxes.forEach(function (box) {
      var d = $('[data-delivery-dispatch]', box);
      var w = $('[data-delivery-window]', box);
      if (d) d.innerHTML = dispatchText;
      if (w) w.innerHTML = windowText;
    });
  }

  renderEstimate();
  setInterval(renderEstimate, 60000);

  /* ------------------------------------------------------------------
     Track order form: send the waybill to the courier's tracking page
  ------------------------------------------------------------------ */
  $$('[data-track-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = $('[data-track-input]', form);
      var waybill = (input.value || '').replace(/\s+/g, '');
      if (!waybill) return;
      window.open(form.getAttribute('data-track-url') + encodeURIComponent(waybill), '_blank', 'noopener');
    });
  });
})();
