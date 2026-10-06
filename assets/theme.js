/* Escale Boutique — theme.js (no dependencies) */
(() => {
  'use strict';

  const T = window.theme || { routes: {}, strings: {} };
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const root = (T.routes.root || '/').replace(/\/$/, '') + '/';

  /* ---------- Announcement rotator ---------- */
  $$('[data-rotator]').forEach((wrap) => {
    const msgs = $$('.announcement__msg', wrap);
    if (msgs.length < 2) return;
    let i = 0;
    setInterval(() => {
      msgs[i].classList.remove('is-active');
      i = (i + 1) % msgs.length;
      msgs[i].classList.add('is-active');
    }, 5000);
  });

  /* ---------- Mobile drawer: lock scroll + position below header ---------- */
  const drawer = $('[data-drawer]');
  if (drawer) {
    drawer.addEventListener('toggle', () => {
      const header = $('[data-header]');
      if (header) document.documentElement.style.setProperty('--drawer-top', `${header.getBoundingClientRect().bottom}px`);
      document.body.style.overflow = drawer.open ? 'hidden' : '';
    });
  }

  /* ---------- Desktop mega menu: hover + click outside ---------- */
  $$('[data-hover-menu]').forEach((d) => {
    const li = d.parentElement;
    li.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) d.open = true; });
    li.addEventListener('mouseleave', () => { if (window.matchMedia('(hover: hover)').matches) d.open = false; });
  });
  document.addEventListener('click', (e) => {
    $$('[data-hover-menu][open]').forEach((d) => { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('[data-hover-menu][open]').forEach((d) => { d.open = false; d.querySelector('summary').focus(); });
    closeCart();
    closeFacets();
  });

  /* ---------- Predictive search ---------- */
  $$('[data-predictive-search]').forEach((form) => {
    const input = $('input[type="search"]', form);
    const results = $('[data-predictive-results]', form);
    if (!input || !results || !T.routes.predictiveSearch) return;
    let controller;

    const close = () => { results.hidden = true; input.setAttribute('aria-expanded', 'false'); };
    const search = debounce(async () => {
      const q = input.value.trim();
      if (q.length < 2) return close();
      controller?.abort();
      controller = new AbortController();
      try {
        const url = `${T.routes.predictiveSearch}?q=${encodeURIComponent(q)}&section_id=predictive-search&resources[type]=product,collection,query&resources[limit]=6&resources[options][fields]=title,product_type,variants.sku,vendor,tag`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return close();
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const content = doc.querySelector('[data-predictive-content]');
        if (!content) return close();
        results.innerHTML = content.outerHTML;
        results.hidden = false;
        input.setAttribute('aria-expanded', 'true');
      } catch (err) { if (err.name !== 'AbortError') close(); }
    }, 220);

    input.addEventListener('input', search);
    input.addEventListener('focus', () => { if (results.innerHTML.trim()) { results.hidden = false; } });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
    input.addEventListener('keydown', (e) => {
      const links = $$('a', results);
      if (!links.length || results.hidden) return;
      const idx = links.findIndex((a) => a.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        links.forEach((a) => a.removeAttribute('aria-selected'));
        const next = e.key === 'ArrowDown' ? (idx + 1) % links.length : (idx - 1 + links.length) % links.length;
        links[next].setAttribute('aria-selected', 'true');
        links[next].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && idx > -1) {
        e.preventDefault();
        window.location.href = links[idx].href;
      }
    });
  });

  /* ---------- Cart drawer ---------- */
  const cartDrawerEl = () => $('[data-cart-drawer]');
  let lastFocus;

  function openCart() {
    const el = cartDrawerEl();
    if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('.cart-drawer__panel', el)?.focus();
  }
  function closeCart() {
    const el = cartDrawerEl();
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  }

  async function refreshCart(open = false) {
    try {
      const res = await fetch(`${root}?sections=cart-drawer`);
      const data = await res.json();
      const html = data['cart-drawer'];
      if (html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const fresh = doc.querySelector('[data-cart-drawer]');
        const current = cartDrawerEl();
        if (fresh && current) {
          if (current.classList.contains('is-open') || open) fresh.classList.add('is-open');
          fresh.setAttribute('aria-hidden', fresh.classList.contains('is-open') ? 'false' : 'true');
          current.replaceWith(fresh);
        }
      }
      const cart = await (await fetch(`${T.routes.cart}.js`)).json();
      $$('[data-cart-count]').forEach((c) => { c.textContent = cart.item_count; c.classList.toggle('is-empty', cart.item_count === 0); });
      if (open) openCart();
    } catch (e) { /* keep page usable */ }
  }

  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-cart-toggle]');
    if (toggle && cartDrawerEl() && !document.body.classList.contains('template-cart')) {
      e.preventDefault();
      openCart();
      return;
    }
    if (e.target.closest('[data-cart-close]')) { closeCart(); return; }

    const qtyBtn = e.target.closest('[data-cart-drawer] [data-qty-change]');
    if (qtyBtn) {
      const line = qtyBtn.closest('[data-key]');
      line?.classList.add('is-loading');
      fetch(`${T.routes.cartChange}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: line.dataset.key, quantity: Number(qtyBtn.dataset.qtyChange) })
      }).then(() => refreshCart()).catch(() => line?.classList.remove('is-loading'));
    }
  });

  /* ---------- Add to cart (AJAX) ---------- */
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-product-form]');
    if (!form || e.submitter?.name === 'checkout') return;
    if (!cartDrawerEl()) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]') || e.submitter;
    const error = form.querySelector('[data-form-error]');
    btn?.classList.add('is-loading');
    if (error) error.hidden = true;
    try {
      const res = await fetch(`${T.routes.cartAdd}.js`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: new FormData(form)
      });
      const data = await res.json();
      if (!res.ok || data.status) {
        if (error) { error.textContent = data.description || data.message || T.strings.error; error.hidden = false; }
        return;
      }
      await refreshCart(true);
    } catch (err) {
      if (error) { error.textContent = T.strings.error; error.hidden = false; }
    } finally {
      btn?.classList.remove('is-loading');
    }
  });

  /* ---------- Quantity steppers ---------- */
  document.addEventListener('click', (e) => {
    const step = e.target.closest('[data-qty-step]');
    if (!step) return;
    const input = step.parentElement.querySelector('input[type="number"]');
    if (!input) return;
    const min = Number(input.min || 1);
    input.value = Math.max(min, Number(input.value || 1) + Number(step.dataset.qtyStep));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---------- Product page: gallery, variants, sticky ATC ---------- */
  $$('[data-product-section]').forEach((section) => {
    const gallery = $('[data-gallery]', section);
    const showMedia = (id) => {
      if (!gallery || !id) return;
      $$('[data-media-id]', gallery).forEach((s) => s.classList.toggle('is-active', s.dataset.mediaId === String(id)));
      $$('[data-thumb]', gallery).forEach((t) => t.classList.toggle('is-active', t.dataset.thumb === String(id)));
    };
    gallery?.addEventListener('click', (e) => {
      const thumb = e.target.closest('[data-thumb]');
      if (thumb) showMedia(thumb.dataset.thumb);
    });

    const json = $('[data-variants-json]', section);
    const picker = $('[data-variant-picker]', section);
    if (json && picker) {
      const variants = JSON.parse(json.textContent);
      const idInput = $('[data-variant-id]', section);
      const addBtn = $('[data-add-button]', section);
      const addLabel = $('[data-add-label]', section);
      const stock = $('[data-stock]', section);
      const sku = $('[data-sku]', section);
      const stickyPrice = $('[data-sticky-price]', section);
      const stickyAdd = $('[data-sticky-add]', section);
      const addText = addLabel ? addLabel.textContent.trim() : T.strings.addToCart;

      const update = () => {
        const selected = $$('fieldset', picker).map((fs) => $('input:checked', fs)?.value);
        $$('fieldset', picker).forEach((fs, i) => { const out = $(`[data-option-selected="${i}"]`, fs); if (out) out.textContent = selected[i] || ''; });
        const variant = variants.find((v) => v.options.every((o, i) => o === selected[i]));
        const available = !!(variant && variant.available);
        if (variant) idInput.value = variant.id;
        if (addBtn) addBtn.disabled = !available;
        if (stickyAdd) stickyAdd.disabled = !available;
        if (addLabel) addLabel.textContent = !variant ? T.strings.unavailable : available ? addText : T.strings.soldOut;
        if (stock) stock.innerHTML = available
          ? `<span class="stock__dot"></span>${T.strings.inStock}`
          : `<span class="stock__dot stock__dot--out"></span>${T.strings.outOfStock}`;
        if (!variant) return;
        if (sku && variant.sku) sku.textContent = variant.sku;
        if (variant.featured_media) showMedia(variant.featured_media.id);

        // Re-render price + keep URL shareable/canonical-friendly
        const url = `${section.dataset.productUrl}?variant=${variant.id}`;
        window.history.replaceState({}, '', url);
        fetch(`${url}&section_id=${section.dataset.sectionId}`)
          .then((r) => r.text())
          .then((html) => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const fresh = doc.querySelector('[data-price-wrap]');
            const current = $('[data-price-wrap]', section);
            if (fresh && current) current.innerHTML = fresh.innerHTML;
            const freshStock = doc.querySelector('[data-stock]');
            if (freshStock && stock) stock.innerHTML = freshStock.innerHTML;
            const freshSticky = doc.querySelector('[data-sticky-price]');
            if (freshSticky && stickyPrice) stickyPrice.textContent = freshSticky.textContent;
          })
          .catch(() => {});
      };
      picker.addEventListener('change', update);
    }

    const sticky = $('[data-sticky-atc]', section);
    const buy = $('[data-add-button]', section);
    if (sticky && buy && 'IntersectionObserver' in window) {
      sticky.hidden = false;
      new IntersectionObserver(([entry]) => {
        sticky.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      }).observe(buy);
    }
  });

  /* ---------- Product recommendations ---------- */
  $$('[data-recommendations]').forEach((el) => {
    if (el.children.length && el.querySelector('.grid')) return;
    const load = () => fetch(el.dataset.url).then((r) => r.text()).then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-recommendations]');
      if (fresh && fresh.innerHTML.trim()) el.innerHTML = fresh.innerHTML;
    }).catch(() => {});
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '400px' });
      io.observe(el);
    } else load();
  });

  /* ---------- Facets (filters) ---------- */
  const facetsDrawer = $('[data-facets-drawer]');
  function closeFacets() { facetsDrawer?.classList.remove('is-open'); document.body.style.overflow = ''; }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-facets-open]')) { facetsDrawer?.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    if (e.target.closest('[data-facets-close]')) closeFacets();
  });
  const facetsForm = $('[data-facets-form]');
  if (facetsForm) {
    const isDesktop = () => window.matchMedia('(min-width: 990px)').matches;
    const submit = () => {
      // strip empty params so URLs stay clean & crawl-friendly
      const params = new URLSearchParams(new FormData(facetsForm));
      for (const [k, v] of [...params.entries()]) if (v === '') params.delete(k);
      window.location.href = `${facetsForm.action}?${params.toString()}`;
    };
    facetsForm.addEventListener('change', (e) => {
      if (e.target.type === 'number') return;
      if (isDesktop() || e.target.name === 'sort_by') submit();
    });
    facetsForm.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    $$('input[type="number"]', facetsForm).forEach((i) => i.addEventListener('change', debounce(() => { if (isDesktop()) submit(); }, 600)));
  }
  $$('[data-sort]').forEach((s) => s.addEventListener('change', () => {
    if (facetsForm) {
      let hidden = facetsForm.querySelector('input[name="sort_by"]');
      if (!hidden) { hidden = document.createElement('input'); hidden.type = 'hidden'; hidden.name = 'sort_by'; facetsForm.appendChild(hidden); }
      hidden.value = s.value;
      facetsForm.requestSubmit();
    } else {
      const u = new URL(window.location.href); u.searchParams.set('sort_by', s.value); window.location.href = u.toString();
    }
  }));

  /* ---------- Account: orders tabs ---------- */
  $$('[data-orders]').forEach((wrap) => {
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-orders-filter]');
      if (!btn) return;
      const f = btn.dataset.ordersFilter;
      $$('[data-orders-filter]', wrap).forEach((b) => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
      $$('[data-order-state]', wrap).forEach((row) => { row.hidden = f !== 'all' && row.dataset.orderState !== f; });
    });
  });

  /* ---------- Addresses: toggles, confirm, country → province ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toggle-target]');
    if (!t) return;
    const target = document.getElementById(t.dataset.toggleTarget);
    if (target) target.hidden = !target.hidden;
  });
  $$('form[data-confirm]').forEach((f) => f.addEventListener('submit', (e) => { if (!window.confirm(f.dataset.confirm)) e.preventDefault(); }));
  $$('[data-country-select]').forEach((country) => {
    const province = document.getElementById(country.dataset.provinceTarget);
    const fill = () => {
      const opt = country.options[country.selectedIndex];
      const list = opt ? JSON.parse(opt.dataset.provinces || '[]') : [];
      province.innerHTML = list.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
      province.closest('label').hidden = list.length === 0;
      if (province.dataset.default) province.value = province.dataset.default;
    };
    if (country.dataset.default) country.value = country.dataset.default;
    country.addEventListener('change', () => { province.dataset.default = ''; fill(); });
    fill();
  });
})();
