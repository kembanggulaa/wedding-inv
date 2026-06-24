import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all GSAP animations
 */
export function initAnimations() {
  initHeroAnimations();
  initGuestSectionAnimations();
  initEventCardsAnimations();
  initCountdownAnimations();
  initLocationAnimations();
  initGalleryAnimations();
  initRSVPAnimations();
  initUcapanAnimations();
  initFooterAnimations();
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
  gsap.from('.hero-content', {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Guest section animations
 */
function initGuestSectionAnimations() {
  gsap.from('.section-guest .container', {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#guest-section',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Event cards animations with stagger
 */
function initEventCardsAnimations() {
  gsap.from('.event-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#event-details',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Countdown section animations
 */
function initCountdownAnimations() {
  gsap.from('.countdown-box', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#countdown',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Location section animations
 */
function initLocationAnimations() {
  gsap.from('.map-container', {
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#location',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Gallery section animations with parallax
 */
function initGalleryAnimations() {
  gsap.from('.gallery-item', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // Subtle parallax on scroll
  gsap.to('.gallery-item:first-child', {
    y: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
}

/**
 * RSVP section animations
 */
function initRSVPAnimations() {
  gsap.from('.rsvp-form', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#rsvp',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Ucapan section animations
 */
function initUcapanAnimations() {
  gsap.from('.ucapan-form', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#ucapan',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.ucapan-list-title', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.ucapan-list-title',
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Footer animations
 */
function initFooterAnimations() {
  gsap.from('.footer .container', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Open invitation animation - fade out overlay
 * @param {Function} callback - function to call after animation
 */
export function animateOpening(callback) {
  const overlay = document.getElementById('opening-overlay');

  gsap.to(overlay, {
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      overlay.style.display = 'none';
      if (callback) callback();
    }
  });
}
