import { getGuestBySlug } from './api.js';
import { getUrlParam, showElement, hideElement } from './utils.js';
import { initAnimations, animateOpening } from './animations.js';
import { initRSVP } from './rsvp.js';
import { initUcapan } from './ucapan.js';

// ============================================
// CONFIGURATION
// ============================================

// Wedding date for countdown (YYYY, MM-1, DD, HH, MM)
const WEDDING_DATE = new Date(2026, 5, 30, 8, 0, 0);

// ============================================
// STATE
// ============================================

let currentGuest = {
  nama: 'Tamu Undangan',
  slug: null
};

let isMusicPlaying = false;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Get guest from URL
  const slug = getUrlParam('to');

  if (slug) {
    await loadGuestData(slug);
  }

  // Update guest name displays
  updateGuestDisplays();

  // Initialize opening overlay
  initOpeningOverlay();

  // Initialize countdown
  initCountdown();

  // Initialize music controls
  initMusicControls();
});

// ============================================
// GUEST DATA
// ============================================

async function loadGuestData(slug) {
  try {
    const result = await getGuestBySlug(slug);

    if (result.success && result.data) {
      currentGuest = {
        nama: result.data.nama || 'Tamu Undangan',
        slug: slug
      };
    }
  } catch (error) {
    console.error('Error loading guest:', error);
  }
}

function updateGuestDisplays() {
  // Overlay guest name
  const overlayName = document.getElementById('guest-name-overlay');
  if (overlayName) {
    overlayName.textContent = currentGuest.nama;
  }

  // Section guest name
  const sectionName = document.getElementById('guest-name');
  if (sectionName) {
    sectionName.textContent = currentGuest.nama;
  }
}

// ============================================
// OPENING OVERLAY
// ============================================

function initOpeningOverlay() {
  const overlay = document.getElementById('opening-overlay');
  const openBtn = document.getElementById('open-invitation-btn');
  const mainContent = document.getElementById('main-content');
  const musicControls = document.getElementById('music-controls');

  if (!openBtn) return;

  openBtn.addEventListener('click', () => {
    // Animate overlay out
    animateOpening(() => {
      // Show main content
      mainContent.classList.remove('hidden');

      // Show music controls
      showElement(musicControls);

      // Start music
      playMusic();

      // Initialize animations after content is visible
      setTimeout(() => {
        initAnimations();

        // Initialize RSVP and Ucapan after animations
        initRSVP(currentGuest.slug, currentGuest.nama);
        initUcapan(currentGuest.nama);
      }, 100);
    });
  });
}

// ============================================
// COUNTDOWN TIMER
// ============================================

function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================================
// MUSIC CONTROLS
// ============================================

function initMusicControls() {
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const audio = document.getElementById('wedding-audio');

  if (!musicToggle || !audio) return;

  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      audio.pause();
      musicIcon.textContent = '🔇';
      isMusicPlaying = false;
    } else {
      audio.play().catch(e => console.log('Audio play failed:', e));
      musicIcon.textContent = '🔊';
      isMusicPlaying = true;
    }
  });
}

function playMusic() {
  const audio = document.getElementById('wedding-audio');
  const musicIcon = document.getElementById('music-icon');

  if (!audio) return;

  audio.volume = 0.5;
  audio.play()
    .then(() => {
      isMusicPlaying = true;
      if (musicIcon) musicIcon.textContent = '🔊';
    })
    .catch(e => {
      console.log('Audio autoplay blocked:', e);
      isMusicPlaying = false;
      if (musicIcon) musicIcon.textContent = '🔇';
    });
}
