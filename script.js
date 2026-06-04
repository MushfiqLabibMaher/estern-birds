'use strict';

// ============================================================
// CONFIG
// ============================================================
const SUPABASE_URL      = 'https://xirusglqbsijqqzzzuqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcnVzZ2xxYnNpanFxenp6dXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTczODUsImV4cCI6MjA5NTY3MzM4NX0.9KcYAFaqnDu68seSR4RPWF13Z0g9DGipx5rDsXyXEQs';
const WHATSAPP_NUMBER   = '8801711667746';
// Your Cloudinary cloud name (found in your Cloudinary dashboard)
const CLOUDINARY_CLOUD  = 'ddanljhjx';

// ============================================================
// IMAGE URL HELPERS
// ============================================================

// Optimize any Cloudinary image URL for fast loading
// - f_auto  → WebP/AVIF automatically
// - q_auto  → best quality/size ratio
// - w_NNN   → resize to what we actually display
function optimizeUrl(url, width) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Don't double-insert transforms if already present
  if (url.includes('/upload/f_auto')) return url;
  const t = `f_auto,q_auto,w_${width},c_fill`;
  return url.replace('/upload/', `/upload/${t}/`);
}

// Build video URL from public_id
function videoUrl(id) {
  if (!id) return null;
  if (id.startsWith('http')) return id;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/${id}.mp4`;
}

// Build video thumbnail from public_id
function videoThumbUrl(id) {
  if (!id || id.startsWith('http')) return null;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/f_auto,q_auto,w_600,h_450,c_fill/so_0/${id}.jpg`;
}

// ============================================================
// FALLBACK DATA — shown when Supabase is unavailable
// Keep this in sync with your birds-data.json
// ============================================================
const FALLBACK_BIRDS = [
  {
    id: 1,
    name: 'Budgerigar Parrots',
    species: 'Budgerigar Parrots, Bangla',
    gender: 'Male',
    age: '6 Months',
    description: 'Highly intelligent and great as a companion bird.',
    image_url: 'https://res.cloudinary.com/ddanljhjx/image/upload/v1780116300/IMG_5514_co15h9.heic',
    video_url: null,
    fun_fact: '',
    price: 'BDT 250',
    emoji: '🐦'
  },
];

// ============================================================
// PAGE DETECTION
// ============================================================
const isFeaturedPage = !!document.getElementById('featured-grid');
const gridEl = document.getElementById('featured-grid') || document.getElementById('bird-grid');

// ============================================================
// SUPABASE
// ============================================================
async function fetchBirds() {
  try {
    if (window.supabase) {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client
        .from('birds')
        .select('id,name,species,gender,age,description,image_url,video_url,fun_fact,price,emoji')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
  } catch (e) { /* fall through */ }
  return FALLBACK_BIRDS;
}

// ============================================================
// UTILS
// ============================================================
function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function whatsappUrl(bird) {
  const msg = `Hi Estern Birds! I'm interested in the ${bird.name} (${bird.price ?? 'price enquiry'}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ============================================================
// CARD IMAGE — simple, works every time
// Show img immediately. Placeholder fades out when img loads.
// ============================================================
function setupCardImage(imgEl, placeholderEl) {
  // Image is already in the DOM and visible
  // Placeholder sits on top and fades away when image is ready

  function reveal() {
    imgEl.classList.add('is-loaded');
    if (placeholderEl) {
      placeholderEl.style.opacity = '0';
      setTimeout(() => { placeholderEl.style.display = 'none'; }, 300);
    }
  }

  // Already loaded (cached)
  if (imgEl.complete && imgEl.naturalWidth > 0) {
    reveal();
    return;
  }

  imgEl.addEventListener('load',  reveal, { once: true });
  imgEl.addEventListener('error', () => { imgEl.style.visibility = 'hidden'; }, { once: true });
}

// ============================================================
// BIRD CARD
// ============================================================
function createBirdCard(bird) {
  const emoji   = bird.emoji || '🐦';
  const price   = bird.price || 'Contact for price';
  const vUrl    = videoUrl(bird.video_url);
  const tUrl    = videoThumbUrl(bird.video_url);
  const hasVid  = !!vUrl;

  // Optimized card image (800px wide WebP)
  const imgSrc = tUrl || optimizeUrl(bird.image_url, 800) || '';

  const article = document.createElement('article');
  article.className = 'bird-card reveal';
  article.setAttribute('role', 'listitem');
  article.setAttribute('tabindex', '0');

  article.innerHTML = `
    <div class="bird-card__image-wrap">
      <img class="bird-card__image" src="${imgSrc}" alt="${sanitize(bird.name)}" loading="lazy" decoding="async" />
      <div class="bird-card__placeholder" aria-hidden="true">
        <span class="bird-card__placeholder-icon">${emoji}</span>
        <span class="bird-card__placeholder-text">Loading…</span>
      </div>
      ${hasVid ? '<span class="bird-card__video-badge">▶ Video</span>' : ''}
      <span class="bird-card__id">#${bird.id}</span>
      <span class="bird-card__badge">🪶 For Sale</span>
    </div>
    <div class="bird-card__body">
      <h3 class="bird-card__name">${sanitize(bird.name)}</h3>
      <p class="bird-card__species">${sanitize(bird.species)}</p>
      <div class="bird-card__meta">
        ${bird.gender ? `<span class="bird-card__meta-tag">${bird.gender==='Male'?'♂':bird.gender==='Female'?'♀':'⚥'} ${sanitize(bird.gender)}</span>` : ''}
        ${bird.age    ? `<span class="bird-card__meta-tag">🗓 ${sanitize(bird.age)}</span>` : ''}
      </div>
      <p class="bird-card__description">${sanitize(bird.description)}</p>
      <div class="bird-card__price-row">
        <span class="bird-card__price-label">Price</span>
        <span class="bird-card__price">${sanitize(price)}</span>
      </div>
      <div class="bird-card__footer">
        <button class="bird-card__btn">${hasVid ? '▶ Watch & Details' : 'View Details'} <span class="bird-card__btn-arrow">→</span></button>
        <a class="bird-card__whatsapp" href="${whatsappUrl(bird)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">💬</a>
      </div>
    </div>`;

  setupCardImage(
    article.querySelector('.bird-card__image'),
    article.querySelector('.bird-card__placeholder')
  );

  const open = () => showModal(bird);
  article.addEventListener('click', open);
  article.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); open(); } });
  return article;
}

// ============================================================
// RENDER
// ============================================================

// Store all birds globally so filters can re-run without re-fetching
let ALL_BIRDS = [];

function renderBirds(birds) {
  if (!gridEl) return;
  gridEl.innerHTML = '';
  if (!birds || !birds.length) {
    gridEl.innerHTML = '<div class="loading-state"><p>No birds available. Contact us on WhatsApp!</p></div>';
    return;
  }
  const show = isFeaturedPage ? birds.slice(0, 3) : birds;
  const sc = document.getElementById('stat-count');
  if (sc) sc.textContent = birds.length;
  show.forEach((bird, i) => {
    const card = createBirdCard(bird);
    card.style.transitionDelay = `${i * 80}ms`;
    gridEl.appendChild(card);
  });
  observeReveal();
}

// ============================================================
// FILTERS (birds.html only)
// ============================================================

const CATEGORY_KEYWORDS = {
  budgerigar:   ['budgerigar','budgie'],
  cockatiel:    ['cockatiel'],
  lovebird:     ['lovebird'],
  canary:       ['canary'],
  zebra_finch:  ['zebra finch', 'zebra'],
  java_sparrow: ['java sparrow', 'java'],
  african_grey: ['african grey', 'grey parrot'],
  cockatoo:     ['cockatoo'],
};

function getBirdCategory(bird) {
  const text = `${bird?.name ?? ''} ${bird?.species ?? ''}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return cat;
  }
  return 'other';
}

function filterAndRender() {
  if (!gridEl || isFeaturedPage) return;

  const search   = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
  const catChip  = document.querySelector('.filters__chip--active[data-filter="category"]');
  const genChip  = document.querySelector('.filters__chip--active.filters__chip--secondary[data-filter="gender"]');
  const category = catChip?.dataset.value || 'all';
  const gender   = genChip?.dataset.value || 'all';

  let filtered = ALL_BIRDS.filter(bird => {
    // Text search
    if (search) {
      const haystack = `${bird.name ?? ''} ${bird.species ?? ''} ${bird.description ?? ''}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    // Category
    if (category !== 'all' && getBirdCategory(bird) !== category) return false;
    // Gender
    if (gender !== 'all' && (bird.gender ?? '').toLowerCase() !== gender.toLowerCase()) return false;
    return true;
  });

  // Show/hide no-results
  const noResults = document.getElementById('filter-no-results');
  const countEl   = document.getElementById('filter-result-count');

  gridEl.innerHTML = '';

  if (filtered.length === 0) {
    if (noResults) noResults.hidden = false;
    if (countEl)   countEl.textContent = '0 birds match your filters';
  } else {
    if (noResults) noResults.hidden = true;
    if (countEl)   countEl.textContent = `Showing ${filtered.length} of ${ALL_BIRDS.length} birds`;
    filtered.forEach((bird, i) => {
      const card = createBirdCard(bird);
      card.style.transitionDelay = `${i * 60}ms`;
      gridEl.appendChild(card);
    });
    observeReveal();
  }
}

function initFilters() {
  const searchEl = document.getElementById('filter-search');
  const clearBtn = document.getElementById('filter-search-clear');
  const resetBtn = document.getElementById('filter-reset');

  if (!searchEl) return; // not on birds page

  // Search input
  searchEl.addEventListener('input', () => {
    if (clearBtn) clearBtn.hidden = searchEl.value === '';
    filterAndRender();
  });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchEl.value = '';
      clearBtn.hidden = true;
      searchEl.focus();
      filterAndRender();
    });
  }

  // Category + gender chips
  document.querySelectorAll('.filters__chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.filter;
      // Deactivate siblings in same group
      document.querySelectorAll(`.filters__chip[data-filter="${group}"]`).forEach(c => {
        c.classList.remove('filters__chip--active');
      });
      chip.classList.add('filters__chip--active');
      filterAndRender();
    });
  });

  // Reset all
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchEl.value = '';
      if (clearBtn) clearBtn.hidden = true;
      document.querySelectorAll('.filters__chip[data-filter="category"]').forEach((c, i) => {
        c.classList.toggle('filters__chip--active', i === 0);
      });
      document.querySelectorAll('.filters__chip[data-filter="gender"]').forEach((c, i) => {
        c.classList.toggle('filters__chip--active', i === 0);
      });
      filterAndRender();
    });
  }
}

// ============================================================
// MODAL — simple and bulletproof
// ============================================================
const overlay = document.getElementById('modal-overlay');

function showModal(bird) {
  if (!overlay) return;

  const emoji  = bird.emoji || '🐦';
  const price  = bird.price || 'Contact for price';
  const vUrl   = videoUrl(bird.video_url);
  const hasVid = !!vUrl;

  // Fill text fields
  setText('modal-id',        `#${bird.id}`);
  setText('modal-bird-name', bird.name);
  setText('modal-species',   bird.species);
  setText('modal-description', bird.description);
  setText('modal-price',     price);

  // Fun fact
  const ffBlock = document.getElementById('modal-fun-fact-block');
  const ffText  = document.getElementById('modal-fun-fact');
  if (ffBlock) {
    if (bird.fun_fact && bird.fun_fact.trim()) {
      if (ffText) ffText.textContent = bird.fun_fact;
      ffBlock.style.display = 'flex';
    } else {
      ffBlock.style.display = 'none';
    }
  }

  // WhatsApp link
  const wa = document.getElementById('modal-whatsapp');
  if (wa) wa.href = whatsappUrl(bird);

  // Gender / Age tags
  const metaEl = document.getElementById('modal-meta');
  if (metaEl) {
    metaEl.innerHTML = '';
    if (bird.gender) metaEl.insertAdjacentHTML('beforeend', `<span class="modal__meta-tag">${bird.gender==='Male'?'♂':bird.gender==='Female'?'♀':'⚥'} ${sanitize(bird.gender)}</span>`);
    if (bird.age)    metaEl.insertAdjacentHTML('beforeend', `<span class="modal__meta-tag">🗓 ${sanitize(bird.age)}</span>`);
  }

  // ---- Media area ----
  const mediaWrap = document.getElementById('modal-media-wrap');
  if (mediaWrap) {
    if (hasVid) {
      // Show video
      mediaWrap.innerHTML = `
        <video controls playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover;background:#000">
          <source src="${vUrl}" type="video/mp4">
        </video>
        <button class="modal__close" id="modal-close" aria-label="Close">✕</button>`;
    } else {
      // Show image — always visible, no display:none tricks
      const imgSrc = optimizeUrl(bird.image_url, 1200) || '';
      mediaWrap.innerHTML = `
        <img id="modal-image"
             src="${imgSrc}"
             alt="${sanitize(bird.name)}"
             style="width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity 0.3s"
             onerror="this.style.display='none'" />
        <div id="modal-placeholder" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:6rem;background:linear-gradient(135deg,#c8e6c9,#a8d4f5)">${emoji}</div>
        <button class="modal__close" id="modal-close" aria-label="Close">✕</button>`;

      const img = document.getElementById('modal-image');
      const ph  = document.getElementById('modal-placeholder');

      function showImg() {
        img.style.opacity = '1';
        if (ph) ph.style.display = 'none';
      }

      if (img.complete && img.naturalWidth > 0) {
        showImg();
      } else {
        img.addEventListener('load', showImg, { once: true });
      }
    }

    // Re-attach close button (we just replaced innerHTML)
    const newClose = document.getElementById('modal-close');
    if (newClose) newClose.addEventListener('click', closeModal);
  }

  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function closeModal() {
  if (!overlay) return;
  // Stop any video
  const v = overlay.querySelector('video');
  if (v) { v.pause(); v.src = ''; }
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay?.classList.contains('is-open')) closeModal(); });

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

function observeReveal() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => revealObs.observe(el));
}

// ============================================================
// INIT
// ============================================================
async function init() {
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();
  const birds = await fetchBirds();
  ALL_BIRDS = birds;
  if (isFeaturedPage) {
    renderBirds(birds);
  } else {
    initFilters();
    filterAndRender();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
