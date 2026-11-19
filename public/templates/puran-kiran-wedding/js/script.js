// Wedding date and venue settings — update these values when the final details are confirmed.
const WEDDING_DATE = new Date('2026-11-21T09:00:00+05:30');
const MAP_QUERY = 'Surjan Niwas, Kareda Buzurg, Niwai, Tonk, Rajasthan';
const RSVP_URL = ''; // Add a WhatsApp link, Google Form link, or RSVP page URL here.

window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('done'), 500));

// Scroll reveal animation.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(el);
});

// Gentle falling petals in the hero section.
const petalField = document.getElementById('petalField');
for (let i = 0; i < 24; i++) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${9 + Math.random() * 12}s`;
  petal.style.animationDelay = `${-Math.random() * 18}s`;
  petal.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
  petal.style.opacity = `${0.2 + Math.random() * 0.45}`;
  petalField.appendChild(petal);
}

// Countdown to the wedding ceremony.
function updateCountdown() {
  const remaining = WEDDING_DATE.getTime() - Date.now();
  const values = remaining <= 0
    ? [0, 0, 0, 0]
    : [Math.floor(remaining / 86400000), Math.floor((remaining % 86400000) / 3600000), Math.floor((remaining % 3600000) / 60000), Math.floor((remaining % 60000) / 1000)];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => document.getElementById(id).textContent = String(values[i]).padStart(2, '0'));
}
updateCountdown();
setInterval(updateCountdown, 1000);


// Animated popups for each wedding function.
const eventModal = document.getElementById('eventModal');
const eventCards = document.querySelectorAll('.event-card');
const eventModalTitle = document.getElementById('eventModalTitle');
const eventModalDate = document.getElementById('eventModalDate');
const eventModalDescription = document.getElementById('eventModalDescription');
const eventModalTime = document.getElementById('eventModalTime');
const eventModalDirections = document.getElementById('eventModalDirections');
const closeEventModalButton = document.getElementById('closeEventModal');
let lastFocusedEvent = null;

function openEventPopup(card) {
  eventModalDate.textContent = card.querySelector('.event-date')?.textContent.trim() || '';
  eventModalTitle.textContent = card.querySelector('h3')?.textContent.trim() || 'Wedding celebration';
  eventModalDescription.textContent = card.querySelector('.event-details > p:not(.event-date)')?.textContent.trim() || '';
  eventModalTime.textContent = card.querySelector('.event-meta span')?.textContent.replace('◷', '').trim() || '';
  eventModalDirections.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
  lastFocusedEvent = card;
  eventModal.classList.add('open');
  eventModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeEventModalButton.focus();
}
function closeEventPopup() {
  eventModal.classList.remove('open');
  eventModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedEvent) lastFocusedEvent.focus();
}
eventCards.forEach((card) => {
  card.setAttribute('aria-haspopup', 'dialog');
  card.addEventListener('click', () => openEventPopup(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openEventPopup(card); }
  });
});
closeEventModalButton.addEventListener('click', closeEventPopup);
eventModal.addEventListener('click', (event) => { if (event.target === eventModal) closeEventPopup(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && eventModal.classList.contains('open')) closeEventPopup(); });

// Invitation video modal.
const modal = document.getElementById('videoModal');
const inviteVideo = document.getElementById('inviteVideo');
function closeVideo() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); inviteVideo.pause(); }
document.getElementById('playInvite').addEventListener('click', () => {
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  inviteVideo.play().catch(() => {});
});
document.getElementById('closeModal').addEventListener('click', closeVideo);
modal.addEventListener('click', (event) => { if (event.target === modal) closeVideo(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeVideo(); });

// Mobile navigation.
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

// RSVP destination is intentionally configurable; prevent a dead link until supplied.
const rsvpButton = document.getElementById('rsvpButton');
rsvpButton.addEventListener('click', (event) => {
  if (!RSVP_URL) {
    event.preventDefault();
    alert('Please contact the hosts directly to confirm your presence. The RSVP link can be added in js/script.js.');
  } else {
    rsvpButton.href = RSVP_URL;
    rsvpButton.target = '_blank';
    rsvpButton.rel = 'noopener';
  }
});

// Subtle pointer glow on desktop.
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (window.matchMedia('(pointer:fine)').matches) {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});
