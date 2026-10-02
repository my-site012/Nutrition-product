/* ============================================
   THEME.JS - NSNZ Nutrition Shopify Theme
   ============================================ */

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initCartDrawer();
  initSearchAutocomplete();
  initAddToCart();
  initWishlist();
  initBackToTop();
  initMobileSearchToggle();
  initGoalTabs();
  initScrollAnimations();
  initQuickView();
  initQtyControls();
  initNewsletterForm();
});

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('closeMenu');

  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Sub-menu toggles
  document.querySelectorAll('.mobile-nav .nav-parent').forEach(function (parent) {
    parent.addEventListener('click', function () {
      const li = this.closest('li');
      const subMenu = li.querySelector(':scope > .sub-menu');
      const isOpen = li.classList.contains('open');

      // Close siblings
      const siblings = li.parentElement.querySelectorAll(':scope > li.open');
      siblings.forEach(function (sib) {
        if (sib !== li) {
          sib.classList.remove('open');
          const sm = sib.querySelector(':scope > .sub-menu');
          if (sm) sm.classList.remove('open');
        }
      });

      li.classList.toggle('open', !isOpen);
      if (subMenu) subMenu.classList.toggle('open', !isOpen);
    });
  });
}

// ============================================
// CART DRAWER
// ============================================
function initCartDrawer() {
  const cartBtn = document.querySelector('.cart-icon');
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  const closeBtn = document.getElementById('closeCart');

  if (!drawer) return;

  function openCart() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartBtn && cartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openCart();
  });

  closeBtn && closeBtn.addEventListener('click', closeCart);
  overlay && overlay.addEventListener('click', closeCart);

  // Remove item
  document.querySelectorAll('.remove-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = this.dataset.key;
      updateCart(key, 0);
    });
  });
}

// ============================================
// QTY CONTROLS IN CART
// ============================================
function initQtyControls() {
  document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('qty-btn')) return;
    const action = e.target.dataset.action;
    const key = e.target.dataset.key;
    const qtyEl = e.target.parentElement.querySelector('.qty-value');
    let qty = parseInt(qtyEl.textContent);

    if (action === 'increase') qty++;
    else if (action === 'decrease') qty = Math.max(0, qty - 1);

    updateCart(key, qty);
  });
}

function updateCart(key, quantity) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify({ id: key, quantity: quantity })
  })
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      updateCartUI(cart);
    })
    .catch(console.error);
}

function updateCartUI(cart) {
  // Update count badges
  const countEls = document.querySelectorAll('#cartCount, #cartItemCount');
  countEls.forEach(function (el) {
    el.textContent = cart.item_count > 0 ? (el.id === 'cartCount' ? cart.item_count : '(' + cart.item_count + ')') : '';
  });

  // Reload cart drawer body via fetch
  fetch('/cart?view=drawer', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then(function (r) { return r.text(); })
    .catch(function () {
      // Fallback: reload page
      window.location.reload();
    });
}

// ============================================
// SEARCH AUTOCOMPLETE
// ============================================
function initSearchAutocomplete() {
  const input = document.getElementById('headerSearch');
  const suggestions = document.getElementById('searchSuggestions');
  if (!input || !suggestions) return;

  let debounceTimer;

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    const q = this.value.trim();

    if (q.length < 2) {
      suggestions.classList.remove('active');
      return;
    }

    debounceTimer = setTimeout(function () {
      fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          const products = data.resources.results.products || [];
          if (!products.length) { suggestions.classList.remove('active'); return; }

          suggestions.innerHTML = products.map(function (p) {
            const img = p.featured_image && p.featured_image.url
              ? '<img src="' + p.featured_image.url + '" alt="' + p.title + '" loading="lazy">'
              : '<div style="width:40px;height:40px;background:#1a1a1a;border-radius:4px"></div>';
            const price = p.price ? '<span class="suggestion-item-price">$' + (p.price / 100).toFixed(2) + '</span>' : '';
            return '<a class="suggestion-item" href="' + p.url + '">' + img + '<div class="suggestion-item-text"><div>' + p.title + '</div>' + price + '</div></a>';
          }).join('');

          suggestions.classList.add('active');
        })
        .catch(function () { suggestions.classList.remove('active'); });
    }, 280);
  });

  document.addEventListener('click', function (e) {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.classList.remove('active');
    }
  });
}

// ============================================
// ADD TO CART
// ============================================
function initAddToCart() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-add-cart');
    if (!btn) return;

    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    e.preventDefault();
    btn.textContent = 'Adding...';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.style.background = '#22c55e';

        // Update cart count
        return fetch('/cart.js');
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('#cartCount').forEach(function (el) {
          el.textContent = cart.item_count;
        });
        showToast('Product added to cart! 🎉');

        setTimeout(function () {
          btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
          btn.style.background = '';
          btn.disabled = false;
        }, 2000);
      })
      .catch(function () {
        btn.textContent = 'Error. Try again.';
        btn.disabled = false;
        setTimeout(function () {
          btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
        }, 2000);
      });
  });
}

// ============================================
// WISHLIST (LocalStorage based)
// ============================================
function initWishlist() {
  let wishlist = JSON.parse(localStorage.getItem('nsnz_wishlist') || '[]');

  // Mark active wishlist cards on load
  wishlist.forEach(function (id) {
    const btn = document.querySelector('.card-wishlist[data-id="' + id + '"]');
    if (btn) btn.classList.add('active');
  });

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.card-wishlist');
    if (!btn) return;
    e.preventDefault();

    const id = btn.dataset.id;
    const idx = wishlist.indexOf(id);

    if (idx === -1) {
      wishlist.push(id);
      btn.classList.add('active');
      showToast('Added to Wishlist ❤️');
    } else {
      wishlist.splice(idx, 1);
      btn.classList.remove('active');
      showToast('Removed from Wishlist');
    }

    localStorage.setItem('nsnz_wishlist', JSON.stringify(wishlist));
  });
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// MOBILE SEARCH TOGGLE
// ============================================
function initMobileSearchToggle() {
  const mobileSearchIcon = document.querySelector('.header-icon.d-mobile-only');
  const bar = document.getElementById('mobileSearchBar');
  const closeBtn = document.getElementById('closeSearch');

  if (!mobileSearchIcon || !bar) return;

  mobileSearchIcon.addEventListener('click', function (e) {
    e.preventDefault();
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) {
      bar.querySelector('input') && bar.querySelector('input').focus();
    }
  });

  closeBtn && closeBtn.addEventListener('click', function () {
    bar.classList.remove('open');
  });
}

// ============================================
// GOAL TABS (Shop by Goal)
// ============================================
function initGoalTabs() {
  const tabs = document.querySelectorAll('.goal-tab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      const goal = this.dataset.goal;
      const panels = document.querySelectorAll('.goal-products');
      panels.forEach(function (p) {
        p.style.display = p.dataset.goal === goal ? 'grid' : 'none';
      });
    });
  });

  // Activate first tab
  if (tabs[0]) tabs[0].click();
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.product-card, .category-card, .review-card, .promo-banner').forEach(function (el) {
    observer.observe(el);
  });
}

// ============================================
// QUICK VIEW MODAL
// ============================================
function initQuickView() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-quick-view');
    if (!btn) return;
    e.preventDefault();

    const productUrl = btn.dataset.productUrl;
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    content.innerHTML = '<div style="padding:60px;text-align:center;"><i class="fas fa-spinner fa-spin" style="font-size:32px;color:var(--primary)"></i></div>';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    fetch(productUrl + '?view=quick_view')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        content.innerHTML = html;
      })
      .catch(function () {
        content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted)">Unable to load product.</div>';
      });
  });

  // Close quick view
  document.addEventListener('click', function (e) {
    if (e.target.id === 'quickViewModal' || e.target.closest('.quick-view-close')) {
      const modal = document.getElementById('quickViewModal');
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ============================================
// NEWSLETTER FORM
// ============================================
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (!email) return;

    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    // Shopify newsletter contact form
    fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'form_type=customer&utf8=✓&contact[email]=' + encodeURIComponent(email) + '&contact[tags]=newsletter'
    })
      .then(function () {
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#22c55e';
        showToast('Thank you for subscribing! 🎉');
      })
      .catch(function () {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
      });
  });
}

// ============================================
// TOAST HELPER
// ============================================
function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3500);
}

// ============================================
// PRODUCT PAGE SPECIFIC
// ============================================
if (document.querySelector('.product-page')) {
  initProductPage();
}

function initProductPage() {
  // Image gallery
  const thumbs = document.querySelectorAll('.product-thumb');
  const mainImg = document.getElementById('mainProductImg');

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      if (mainImg) mainImg.src = this.dataset.src;
    });
  });

  // Variant selector
  const variantSelects = document.querySelectorAll('.variant-option');
  variantSelects.forEach(function (opt) {
    opt.addEventListener('click', function () {
      const group = this.dataset.group;
      document.querySelectorAll('.variant-option[data-group="' + group + '"]').forEach(function (o) {
        o.classList.remove('active');
      });
      this.classList.add('active');
      updateVariantSelection();
    });
  });
}

function updateVariantSelection() {
  const selected = {};
  document.querySelectorAll('.variant-option.active').forEach(function (opt) {
    selected[opt.dataset.group] = opt.dataset.value;
  });

  // Match to variant JSON
  const variantData = window.__variantData;
  if (!variantData) return;

  const match = variantData.find(function (v) {
    return Object.keys(selected).every(function (key, i) {
      return v.options[i] === selected[key];
    });
  });

  if (match) {
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
      addBtn.dataset.variantId = match.id;
      if (!match.available) {
        addBtn.textContent = 'Sold Out';
        addBtn.disabled = true;
      } else {
        addBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
        addBtn.disabled = false;
      }
    }
    // Update price
    const priceEl = document.getElementById('productPrice');
    if (priceEl && match.price) {
      priceEl.textContent = '$' + (match.price / 100).toFixed(2);
    }
  }
}

// ============================================
// COLLECTION PAGE - FILTER & SORT
// ============================================
function initCollectionFilters() {
  const filterToggles = document.querySelectorAll('.filter-group-header');
  filterToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const group = this.closest('.filter-group');
      group.classList.toggle('open');
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      const url = new URL(window.location);
      url.searchParams.set('sort_by', this.value);
      window.location = url.toString();
    });
  }
}

if (document.querySelector('.collection-page')) {
  initCollectionFilters();
}

// ============================================
// COUNTDOWN TIMER (for flash sales)
// ============================================
function initCountdown(targetDate, elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  function tick() {
    const now = new Date().getTime();
    const distance = new Date(targetDate).getTime() - now;

    if (distance < 0) { el.innerHTML = 'Sale Ended'; return; }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    el.innerHTML =
      '<span class="cd-unit"><span class="cd-num">' + String(hours).padStart(2, '0') + '</span><span class="cd-label">HRS</span></span>' +
      '<span class="cd-sep">:</span>' +
      '<span class="cd-unit"><span class="cd-num">' + String(minutes).padStart(2, '0') + '</span><span class="cd-label">MIN</span></span>' +
      '<span class="cd-sep">:</span>' +
      '<span class="cd-unit"><span class="cd-num">' + String(seconds).padStart(2, '0') + '</span><span class="cd-label">SEC</span></span>';
  }

  tick();
  setInterval(tick, 1000);
}

// Init countdown if element exists
const cdEl = document.querySelector('[data-countdown]');
if (cdEl) {
  initCountdown(cdEl.dataset.countdown, cdEl.id);
}
