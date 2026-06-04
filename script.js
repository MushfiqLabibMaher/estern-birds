/* ============================================================
   Estern Birds — script.js  v4.0
   Works on both index.html (featured preview) and birds.html (full list)
   Cloudinary video support added
   ============================================================ */

'use strict';

// ============================================================
// CONFIGURATION
// ============================================================

const SUPABASE_URL      = 'https://xirusglqbsijqqzzzuqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcnVzZ2xxYnNpanFxenp6dXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTczODUsImV4cCI6MjA5NTY3MzM4NX0.9KcYAFaqnDu68seSR4RPWF13Z0g9DGipx5rDsXyXEQs';
const WHATSAPP_NUMBER   = '8801711667746';
const CLOUDINARY_CLOUD  = '859984872331155';

// ============================================================
// CLOUDINARY HELPERS
// ============================================================

/**
 * Build a full Cloudinary video URL.
 * Pass either a full URL or just the public_id (e.g. "birds/blue_jay_video")
 */
function cloudinaryVideoUrl(videoUrl) {
  if (!videoUrl) return null;
  if (videoUrl.startsWith('http')) return videoUrl;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/${videoUrl}.mp4`;
}

/**
 * Build a thumbnail image from a Cloudinary video public_id.
 * Grabs the first frame, resized to 600x450.
 */
function cloudinaryThumbUrl(videoUrl) {
  if (!videoUrl || videoUrl.startsWith('http')) return null;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_0,w_600,h_450,c_fill,f_jpg/${videoUrl}.jpg`;
}

// ============================================================
// FALLBACK DATA
// ============================================================

const FALLBACK_BIRDS = [
  {
    id: 1, name: 'Blue Jay', species: 'Cyanocitta cristata',
    description: 'A bold and striking bird known for its vivid blue plumage and loud, assertive calls. Highly intelligent and great as a companion bird.',
    image_url: 'public/images/birds/blue-jay.jpg', video_url: null,
    fun_fact: 'Blue Jays can mimic the calls of hawks to scare away other birds from a food source.',
    price: 'BDT 2,500', emoji: '🔵',
  },
  {
    id: 2, name: 'Northern Cardinal', species: 'Cardinalis cardinalis',
    description: 'One of the most recognizable birds, the male Northern Cardinal dazzles with brilliant red plumage.',
    image_url: 'public/images/birds/cardinal.jpg', video_url: null,
    fun_fact: 'Unlike most songbirds, female Northern Cardinals also sing — often while sitting on the nest.',
    price: 'BDT 3,200', emoji: '❤️',
  },
  {
    id: 3, name: 'Ruby-throated Hummingbird', species: 'Archilochus colubris',
    description: 'These tiny aerial acrobats can hover in place and even fly backwards, beating their wings up to 80 times per second.',
    image_url: 'public/images/birds/hummingbird.jpg', video_url: null,
    fun_fact: "A Ruby-throated Hummingbird's heart beats up to 1,260 times per minute during flight.",
    price: 'BDT 4,800', emoji: '💚',
  },
  {
    id: 4, name: 'American Goldfinch', species: 'Spinus tristis',
    description: 'Often called the "wild canary," the male American Goldfinch transforms into brilliant lemon-yellow in spring and summer.',
    image_url: 'public/images/birds/goldfinch.jpg', video_url: null,
    fun_fact: 'Goldfinches are strict vegetarians, feeding almost exclusively on seeds.',
    price: 'BDT 1,800', emoji: '💛',
  },
  {
    id: 5, name: 'Painted Bunting', species: 'Passerina ciris',
    description: 'Arguably the most colorful bird in the world — a mosaic of vivid blue, green, and red.',
    image_url: 'public/images/birds/painted-bunting.jpg', video_url: null,
    fun_fact: 'Painted Buntings are called "nonpareil" — French for "without equal."',
    price: 'BDT 6,500', emoji: '🎨',
  },
  {
    id: 6, name: 'Bald Eagle', species: 'Haliaeetus leucocephalus',
    description: 'A powerful raptor with a wingspan reaching up to 8 feet. Majestic and commanding.',
    image_url: 'public/images/birds/bald-eagle.jpg', video_url: null,
    fun_fact: 'Bald Eagles build the largest nests of any North American bird — some weigh over a ton.',
    price: 'Contact for price', emoji: '🦅',
  },
];

// ============================================================
// PAGE DETECTION
// ============================================================

const isFeaturedPage = !!document.getElementById('featured-grid');
const gridEl         = document.getElementById('featured-grid') || document.getElementById('bird-grid');

// ============================================================
// DOM REFERENCES
// ============================================================

const modalOverlay     = document.getElementById('modal-overlay');
const modalClose       = document.getElementById('modal-close');
const modalMediaWrap   = document.getElementById('modal-media-wrap');
const modalImage       = document.getElementById('modal-image');
const modalVideo       = document.getElementById('modal-video');
const modalPlaceholder = document.getElementById('modal-placeholder');
const modalId          = document.getElementById('modal-id');
const modalName        = document.getElementById('modal-bird-name');
const modalSpecies     = document.getElementById('modal-species');
const modalMeta        = document.getElementById('modal-meta');
const modalDesc        = document.getElementById('modal-description');
const modalFunFact     = document.getElementById('modal-fun-fact');
const modalPrice       = document.getElementById('modal-price');
const modalWhatsapp    = document.getElementById('modal-whatsapp');
const statCount        = document.getElementById('stat-count');
const footerYear       = document.getElementById('footer-year');

// ============================================================
// SUPABASE FETCH
// ============================================================

async function fetchBirds() {
  try {
    if (window.supabase) {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client
        .from('birds')
        .select('id, name, species, gender, age, description, image_url, video_url, fun_fact, price, emoji')
        .order('id', { ascending: true });

      if (error) { console.warn('Supabase error:', error.message); return FALLBACK_BIRDS; }
      if (data && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('Supabase unavailable, using fallback:', err.message);
  }
  return FALLBACK_BIRDS;
}

// ============================================================
// UTILITIES
// ============================================================

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/**
 * Auto-fix Cloudinary .heic URLs — browsers can't display heic.
 * Inserts f_jpg transformation so Cloudinary converts on the fly.
 */
function fixImageUrl(url) {
  if (!url) return url;
  if (url.includes('res.cloudinary.com') && url.toLowerCase().includes('.heic')) {
    return url.replace('/upload/', '/upload/f_jpg/');
  }
  return url;
}

function handleImageLoad(imgEl, placeholderEl) {
  if (!imgEl.src || imgEl.src === window.location.href) {
    imgEl.style.display = 'none';
    placeholderEl.style.display = 'flex';
    return;
  }
  imgEl.addEventListener('load', () => { placeholderEl.style.display = 'none'; imgEl.style.display = 'block'; });
  imgEl.addEventListener('error', () => { imgEl.style.display = 'none'; placeholderEl.style.display = 'flex'; });
}

function buildWhatsAppUrl(bird) {
  const msg = `Hi Estern Birds! I'm interested in the ${bird.name} (${bird.price ?? 'price enquiry'}). Please let me know more details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ============================================================
// CREATE BIRD CARD
// ============================================================

function createBirdCard(bird) {
  const emoji    = bird.emoji || '🐦';
  const price    = bird.price || 'Contact for price';
  const videoUrl = cloudinaryVideoUrl(bird.video_url);
  const thumbUrl = cloudinaryThumbUrl(bird.video_url);
  const hasVideo = !!videoUrl;

  const article = document.createElement('article');
  article.className = 'bird-card reveal';
  article.setAttribute('role', 'listitem');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${bird.name} — ${bird.species}`);

  // Use video thumbnail as card image if available
  const cardImageSrc = thumbUrl || fixImageUrl(sanitize(bird.image_url));

  article.innerHTML = `
    <div class="bird-card__image-wrap">
      <img class="bird-card__image" src="${cardImageSrc}"
           alt="${sanitize(bird.name)}" loading="lazy" style="display:none" />
      <div class="bird-card__placeholder">
        <span class="bird-card__placeholder-icon" aria-hidden="true">${emoji}</span>
        <span class="bird-card__placeholder-text">Photo coming soon</span>
      </div>
      ${hasVideo ? '<span class="bird-card__video-badge" aria-label="Video available">▶ Video</span>' : ''}
      <span class="bird-card__id" aria-label="Bird ID">#${bird.id}</span>
      <span class="bird-card__badge" aria-hidden="true">🪶 For Sale</span>
    </div>
    <div class="bird-card__body">
      <h3 class="bird-card__name">${sanitize(bird.name)}</h3>
      <p class="bird-card__species">${sanitize(bird.species)}</p>
      <div class="bird-card__meta">
        ${bird.gender ? `<span class="bird-card__meta-tag">${bird.gender === 'Male' ? '♂' : bird.gender === 'Female' ? '♀' : '⚥'} ${sanitize(bird.gender)}</span>` : ''}
        ${bird.age    ? `<span class="bird-card__meta-tag">🗓 ${sanitize(bird.age)}</span>` : ''}
      </div>
      <p class="bird-card__description">${sanitize(bird.description)}</p>
      <div class="bird-card__price-row">
        <span class="bird-card__price-label">Price</span>
        <span class="bird-card__price">${sanitize(price)}</span>
      </div>
      <div class="bird-card__footer">
        <button class="bird-card__btn" aria-label="View details for ${sanitize(bird.name)}">
          ${hasVideo ? '▶ Watch & Details' : 'View Details'}
          <span class="bird-card__btn-arrow" aria-hidden="true">→</span>
        </button>
        <a class="bird-card__whatsapp"
           href="${buildWhatsAppUrl(bird)}"
           target="_blank" rel="noopener"
           aria-label="Order ${sanitize(bird.name)} on WhatsApp"
           onclick="event.stopPropagation()">💬</a>
      </div>
    </div>
  `;

  const imgEl = article.querySelector('.bird-card__image');
  const placeholderEl = article.querySelector('.bird-card__placeholder');
  handleImageLoad(imgEl, placeholderEl);

  const openModal = () => showModal(bird);
  article.addEventListener('click', openModal);
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });

  return article;
}

// ============================================================
// RENDER BIRDS
// ============================================================

function renderBirds(allBirds) {
  if (!gridEl) return;
  gridEl.innerHTML = '';

  if (!allBirds || allBirds.length === 0) {
    gridEl.innerHTML = `<div class="loading-state"><p>No birds available right now. Contact us on WhatsApp!</p></div>`;
    return;
  }

  const birdsToShow = isFeaturedPage ? allBirds.slice(0, 3) : allBirds;
  if (statCount) statCount.textContent = allBirds.length;

  birdsToShow.forEach((bird, index) => {
    const card = createBirdCard(bird);
    card.style.transitionDelay = `${index * 80}ms`;
    gridEl.appendChild(card);
  });

  observeRevealElements();
}

// ============================================================
// MODAL — with video player
// ============================================================

function showModal(bird) {
  if (!modalOverlay) return;

  const emoji    = bird.emoji || '🐦';
  const price    = bird.price || 'Contact for price';
  const videoUrl = cloudinaryVideoUrl(bird.video_url);
  const hasVideo = !!videoUrl;

  modalName.textContent    = bird.name;
  modalSpecies.textContent = bird.species;
  modalDesc.textContent    = bird.description;
  modalPrice.textContent   = price;
  modalWhatsapp.href       = buildWhatsAppUrl(bird);

  // Show/hide fun fact block
  const funFactBlock = document.getElementById('modal-fun-fact-block');
  if (funFactBlock) {
    if (bird.fun_fact && bird.fun_fact.trim() !== '') {
      modalFunFact.textContent = bird.fun_fact;
      funFactBlock.style.display = 'flex';
    } else {
      funFactBlock.style.display = 'none';
    }
  }

  // ID badge
  if (modalId) modalId.textContent = `#${bird.id}`;

  // Gender + Age tags
  if (modalMeta) {
    modalMeta.innerHTML = '';
    if (bird.gender) {
      const icon = bird.gender === 'Male' ? '♂' : bird.gender === 'Female' ? '♀' : '⚥';
      const t = document.createElement('span');
      t.className = 'modal__meta-tag';
      t.textContent = `${icon} ${bird.gender}`;
      modalMeta.appendChild(t);
    }
    if (bird.age) {
      const t = document.createElement('span');
      t.className = 'modal__meta-tag';
      t.textContent = `🗓 ${bird.age}`;
      modalMeta.appendChild(t);
    }
  }

  // --- Media: show video if available, otherwise image ---
  if (hasVideo && modalVideo) {
    // Show video player
    modalVideo.src = videoUrl;
    modalVideo.style.display = 'block';
    modalVideo.load();
    if (modalImage) modalImage.style.display = 'none';
    if (modalPlaceholder) modalPlaceholder.style.display = 'none';
  } else {
    // Show image
    if (modalVideo) { modalVideo.pause(); modalVideo.src = ''; modalVideo.style.display = 'none'; }
    if (modalImage) {
      modalImage.src = fixImageUrl(bird.image_url);
      modalImage.alt = bird.name;
      modalImage.style.display = 'none';
    }
    if (modalPlaceholder) {
      modalPlaceholder.textContent = emoji;
      modalPlaceholder.style.display = 'flex';
    }
    if (modalImage && modalPlaceholder) handleImageLoad(modalImage, modalPlaceholder);
  }

  modalOverlay.classList.add('is-open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modalClose && modalClose.focus(), 50);
}

function closeModal() {
  if (!modalOverlay) return;
  // Stop video when closing
  if (modalVideo) { modalVideo.pause(); modalVideo.src = ''; }
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-open')) closeModal();
});

// ============================================================
// SCROLL-REVEAL
// ============================================================

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

function observeRevealElements() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => revealObserver.observe(el));
}

// ============================================================
// INIT
// ============================================================

async function init() {
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  const birds = await fetchBirds();
  renderBirds(birds);
  observeRevealElements();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
