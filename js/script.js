document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Project filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !matches);
    });
  });
});

// Video modal
const modal = document.getElementById('videoModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalVideo = document.getElementById('modalVideo');

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    return null;
  } catch {
    return null;
  }
}

function toEmbedUrl(url) {
  const youtubeId = getYouTubeId(url);
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`;

  try {
    const u = new URL(url);
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

// Set real video thumbnails as previews on project cards
projectCards.forEach((card) => {
  const youtubeId = getYouTubeId(card.dataset.video);
  if (!youtubeId) return;

  const thumb = card.querySelector('.project-thumb');
  const img = document.createElement('img');
  img.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  img.alt = '';
  img.loading = 'lazy';
  thumb.prepend(img);
});

function openModal(videoUrl) {
  modalVideo.innerHTML = '';
  const embedUrl = videoUrl ? toEmbedUrl(videoUrl) : null;

  if (embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    modalVideo.appendChild(iframe);
  } else {
    modalVideo.textContent = 'Agrega el link de este video en data-video del proyecto para que se reproduzca aquí.';
  }

  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  modalVideo.innerHTML = '';
}

projectCards.forEach((card) => {
  card.addEventListener('click', () => openModal(card.dataset.video));
});

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
