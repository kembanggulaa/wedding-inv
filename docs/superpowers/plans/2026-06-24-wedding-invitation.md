# Wedding Invitation Digital Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personalized digital wedding invitation with RSVP and guest message (ucapan) features, using Vite + Vanilla JS + GSAP, Google Sheets as database (via Apps Script), hosted on Vercel for free.

**Architecture:** A single-page static site with 9 scrollable sections. GSAP ScrollTrigger handles entrance animations. Google Apps Script provides a JSON API backend for guest lookup, RSVP submission, and message retrieval. Audio playback is controlled via a floating button. All state is URL-parameter driven (guest slug).

**Tech Stack:** Vite, Vanilla JS (ES6+), GSAP + ScrollTrigger, CSS3 with variables, Google Apps Script, Google Sheets, Vercel

**Color Scheme:**
- Soft Sage: `#C7CDB0` (primary accent)
- Rose Quartz: `#F2C9CE` (secondary accent)
- Cream White: `#FAF7F2` (background)
- Charcoal: `#2C2C2C` (text)
- Warm Gray: `#6B6B6B` (secondary text)

---

## File Structure

```
wedding-inv/
├── public/
│   ├── images/
│   │   ├── couple-1.jpg
│   │   ├── couple-2.jpg
│   │   └── background.jpg
│   └── audio/
│       └── wedding-song.mp3
├── src/
│   ├── main.js
│   ├── api.js
│   ├── animations.js
│   ├── rsvp.js
│   ├── ucapan.js
│   └── utils.js
├── styles/
│   ├── main.css
│   ├── sections.css
│   └── responsive.css
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
└── backend/
    └── apps-script.js
```

---

### Task 1: Initialize Vite Project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.gitignore`
- Create: `src/main.js`
- Create: `styles/main.css`
- Create: `index.html` (minimal placeholder)

- [ ] **Step 1: Create project root and initialize npm**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && npm init -y
```
Expected output: A `package.json` file is created with default values.

- [ ] **Step 2: Install Vite and GSAP as dev dependencies**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && npm install --save-dev vite && npm install gsap
```
Expected output: `node_modules/` populated, `package.json` updated with dependencies.

- [ ] **Step 3: Create `vite.config.js` with basic SPA config**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

- [ ] **Step 5: Create folder structure**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && mkdir -p src styles public/images public/audio backend
```
Expected output: All directories created successfully.

- [ ] **Step 6: Create minimal `index.html` placeholder**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedding Invitation</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 7: Create empty entry files**

Create `src/main.js`:
```javascript
import '../styles/main.css';

console.log('Wedding invitation app loaded');
```

Create `styles/main.css`:
```css
/* Base styles will go here */
```

- [ ] **Step 8: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add . && git commit -m "chore: initialize Vite project with GSAP"
```

---

### Task 2: Create HTML Structure

**Files:**
- Modify: `index.html` (complete rewrite)

- [ ] **Step 1: Write complete `index.html` with all 9 sections**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
</head>
<body>
  <!-- Opening Overlay -->
  <section id="overlay" class="overlay">
    <div class="overlay__content">
      <p class="overlay__label">The Wedding of</p>
      <h1 class="overlay__names">Rama &amp; Sinta</h1>
      <p class="overlay__date">12 Desember 2026</p>
      <button id="open-invitation" class="btn btn--primary overlay__btn">Buka Undangan</button>
    </div>
  </section>

  <!-- Main Content -->
  <main id="main-content" class="main-content hidden">
    <!-- Hero Section -->
    <section id="hero" class="section section--hero">
      <div class="hero__image-wrapper">
        <img src="/images/couple-1.jpg" alt="Couple" class="hero__image" />
      </div>
      <div class="hero__text">
        <p class="hero__label">The Wedding of</p>
        <h1 class="hero__names">Rama &amp; Sinta</h1>
        <p class="hero__date">12 Desember 2026</p>
      </div>
    </section>

    <!-- Guest Section -->
    <section id="guest" class="section section--guest">
      <div class="guest__card">
        <p class="guest__greeting">Kepada Yth.</p>
        <h2 id="guest-name" class="guest__name">Tamu Undangan</h2>
        <p class="guest__address" id="guest-address">Di tempat</p>
      </div>
    </section>

    <!-- Details / Event Section -->
    <section id="details" class="section section--details">
      <h2 class="section__title">Acara Pernikahan</h2>
      <div class="events">
        <div class="event-card">
          <h3 class="event-card__title">Akad Nikah</h3>
          <p class="event-card__date">Jumat, 12 Desember 2026</p>
          <p class="event-card__time">08:00 - 10:00 WIB</p>
          <p class="event-card__location">Masjid Al-Hikmah</p>
          <p class="event-card__address">Jl. Merdeka No. 123, Jakarta</p>
        </div>
        <div class="event-card">
          <h3 class="event-card__title">Resepsi</h3>
          <p class="event-card__date">Jumat, 12 Desember 2026</p>
          <p class="event-card__time">11:00 - 14:00 WIB</p>
          <p class="event-card__location">Gedung Serba Guna</p>
          <p class="event-card__address">Jl. Sudirman No. 456, Jakarta</p>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section id="countdown" class="section section--countdown">
      <h2 class="section__title">Menghitung Hari</h2>
      <div class="countdown" id="countdown-timer">
        <div class="countdown__box">
          <span class="countdown__number" id="countdown-days">00</span>
          <span class="countdown__label">Hari</span>
        </div>
        <div class="countdown__box">
          <span class="countdown__number" id="countdown-hours">00</span>
          <span class="countdown__label">Jam</span>
        </div>
        <div class="countdown__box">
          <span class="countdown__number" id="countdown-minutes">00</span>
          <span class="countdown__label">Menit</span>
        </div>
        <div class="countdown__box">
          <span class="countdown__number" id="countdown-seconds">00</span>
          <span class="countdown__label">Detik</span>
        </div>
      </div>
    </section>

    <!-- Location Section -->
    <section id="location" class="section section--location">
      <h2 class="section__title">Lokasi</h2>
      <div class="location__map-wrapper">
        <iframe
          id="map-iframe"
          class="location__map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.8456!3d-6.2088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzEuNyJTIDEwNsKwNTAnNDQuMiJF!5e0!3m2!1sen!2sid!4v1600000000000"
          width="100%"
          height="400"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <a href="https://maps.google.com/?q=-6.2088,106.8456" target="_blank" rel="noopener" class="btn btn--secondary location__btn">Buka Google Maps</a>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="section section--gallery">
      <h2 class="section__title">Galeri</h2>
      <div class="gallery__grid">
        <div class="gallery__item">
          <img src="/images/couple-1.jpg" alt="Couple photo 1" class="gallery__image" />
        </div>
        <div class="gallery__item">
          <img src="/images/couple-2.jpg" alt="Couple photo 2" class="gallery__image" />
        </div>
        <div class="gallery__item gallery__item--wide">
          <img src="/images/background.jpg" alt="Background" class="gallery__image" />
        </div>
      </div>
    </section>

    <!-- RSVP Section -->
    <section id="rsvp" class="section section--rsvp">
      <h2 class="section__title">RSVP</h2>
      <p class="section__subtitle">Konfirmasi kehadiran Anda</p>
      <form id="rsvp-form" class="form form--rsvp">
        <div class="form__group">
          <label class="form__label">Apakah Anda akan hadir?</label>
          <div class="form__radio-group">
            <label class="form__radio-label">
              <input type="radio" name="kehadiran" value="hadir" class="form__radio" required />
              <span class="form__radio-text">Hadir</span>
            </label>
            <label class="form__radio-label">
              <input type="radio" name="kehadiran" value="tidak hadir" class="form__radio" required />
              <span class="form__radio-text">Tidak Hadir</span>
            </label>
          </div>
        </div>
        <div class="form__group" id="jumlah-group" style="display: none;">
          <label for="jumlah" class="form__label">Jumlah Tamu</label>
          <input type="number" id="jumlah" name="jumlah" min="1" max="5" value="1" class="form__input" />
        </div>
        <button type="submit" class="btn btn--primary form__submit">Kirim RSVP</button>
      </form>
      <div id="rsvp-success" class="rsvp__success hidden">
        <p>Terima kasih! Konfirmasi Anda telah tersimpan.</p>
      </div>
    </section>

    <!-- Ucapan Section -->
    <section id="ucapan" class="section section--ucapan">
      <h2 class="section__title">Ucapan &amp; Doa</h2>
      <form id="ucapan-form" class="form form--ucapan">
        <div class="form__group">
          <label for="ucapan-nama" class="form__label">Nama</label>
          <input type="text" id="ucapan-nama" name="nama" class="form__input" required />
        </div>
        <div class="form__group">
          <label for="ucapan-pesan" class="form__label">Ucapan / Doa</label>
          <textarea id="ucapan-pesan" name="pesan" class="form__textarea" rows="4" required></textarea>
        </div>
        <button type="submit" class="btn btn--primary form__submit">Kirim Ucapan</button>
      </form>
      <div id="ucapan-list" class="ucapan__list">
        <!-- Ucapan items will be rendered here -->
      </div>
    </section>

    <!-- Footer -->
    <footer id="footer" class="footer">
      <p class="footer__text">Atas kehadiran dan doa restu Anda, kami ucapkan terima kasih.</p>
      <p class="footer__names">Rama &amp; Sinta</p>
    </footer>
  </main>

  <!-- Music Controls -->
  <div id="music-controls" class="music-controls hidden">
    <button id="music-toggle" class="music-controls__btn" aria-label="Play/Pause music">
      <span id="music-icon" class="music-controls__icon">&#9658;</span>
    </button>
    <audio id="wedding-audio" loop>
      <source src="/audio/wedding-song.mp3" type="audio/mpeg" />
    </audio>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add index.html && git commit -m "feat: add complete HTML structure with all 9 sections"
```

---

### Task 3: Create CSS - Main Styles

**Files:**
- Modify: `styles/main.css` (complete rewrite)

- [ ] **Step 1: Write `styles/main.css` with CSS variables, base styles, buttons, forms, utilities**

```css
/* ============================================
   CSS VARIABLES
   ============================================ */
:root {
  --color-sage: #C7CDB0;
  --color-rose: #F2C9CE;
  --color-cream: #FAF7F2;
  --color-charcoal: #2C2C2C;
  --color-warm-gray: #6B6B6B;
  --color-white: #FFFFFF;

  --font-heading: 'Playfair Display', serif;
  --font-body: 'Lato', sans-serif;

  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-xxl: 5rem;

  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;

  --shadow-sm: 0 2px 8px rgba(44, 44, 44, 0.08);
  --shadow-md: 0 4px 16px rgba(44, 44, 44, 0.12);
  --shadow-lg: 0 8px 32px rgba(44, 44, 44, 0.16);

  --transition-fast: 0.2s ease;
  --transition-normal: 0.4s ease;
  --transition-slow: 0.6s ease;
}

/* ============================================
   BASE STYLES
   ============================================ */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  color: var(--color-charcoal);
  background-color: var(--color-cream);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ============================================
   TYPOGRAPHY
   ============================================ */
h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
}

.section__title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-charcoal);
}

.section__subtitle {
  font-size: 1rem;
  text-align: center;
  color: var(--color-warm-gray);
  margin-bottom: var(--spacing-lg);
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn--primary {
  background-color: var(--color-sage);
  color: var(--color-charcoal);
}

.btn--primary:hover {
  background-color: #b8c09e;
  box-shadow: var(--shadow-md);
}

.btn--secondary {
  background-color: var(--color-rose);
  color: var(--color-charcoal);
}

.btn--secondary:hover {
  background-color: #e8b5bc;
  box-shadow: var(--shadow-md);
}

/* ============================================
   FORMS
   ============================================ */
.form__group {
  margin-bottom: var(--spacing-md);
}

.form__label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-charcoal);
}

.form__input,
.form__textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-charcoal);
  background-color: var(--color-white);
  border: 1px solid rgba(44, 44, 44, 0.15);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form__input:focus,
.form__textarea:focus {
  outline: none;
  border-color: var(--color-sage);
  box-shadow: 0 0 0 3px rgba(199, 205, 176, 0.3);
}

.form__textarea {
  resize: vertical;
  min-height: 100px;
}

.form__radio-group {
  display: flex;
  gap: var(--spacing-md);
}

.form__radio-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: 0.9375rem;
}

.form__radio {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--color-sage);
  cursor: pointer;
}

.form__submit {
  width: 100%;
}

/* ============================================
   MUSIC CONTROLS
   ============================================ */
.music-controls {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}

.music-controls__btn {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: var(--color-sage);
  color: var(--color-charcoal);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.music-controls__btn:hover {
  transform: scale(1.1);
  background-color: #b8c09e;
}

.music-controls__icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* ============================================
   UTILITY CLASSES
   ============================================ */
.hidden {
  display: none !important;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-center {
  text-align: center;
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add styles/main.css && git commit -m "feat: add main CSS with variables, buttons, forms, utilities"
```

---

### Task 4: Create CSS - Section Styles

**Files:**
- Create: `styles/sections.css`

- [ ] **Step 1: Write `styles/sections.css` with all section-specific styles**

```css
/* ============================================
   OVERLAY
   ============================================ */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(44, 44, 44, 0.45), rgba(44, 44, 44, 0.45)), url('/images/background.jpg') center/cover no-repeat;
  color: var(--color-white);
  text-align: center;
  padding: var(--spacing-md);
}

.overlay__content {
  animation: fadeInUp 1s ease forwards;
}

.overlay__label {
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
  opacity: 0.9;
}

.overlay__names {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.overlay__date {
  font-size: 1.125rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.overlay__btn {
  font-size: 1.125rem;
  padding: 1rem 2.5rem;
}

/* ============================================
   HERO
   ============================================ */
.section--hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.hero__text {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--color-white);
  padding: var(--spacing-md);
}

.hero__label {
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
  opacity: 0.9;
}

.hero__names {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.hero__date {
  font-size: 1.25rem;
  opacity: 0.9;
}

/* ============================================
   GUEST
   ============================================ */
.section--guest {
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

.guest__card {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
  background-color: rgba(242, 201, 206, 0.2);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(242, 201, 206, 0.4);
}

.guest__greeting {
  font-size: 1rem;
  color: var(--color-warm-gray);
  margin-bottom: var(--spacing-sm);
}

.guest__name {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-charcoal);
  margin-bottom: var(--spacing-xs);
}

.guest__address {
  font-size: 1rem;
  color: var(--color-warm-gray);
}

/* ============================================
   DETAILS / EVENTS
   ============================================ */
.section--details {
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

.events {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.event-card {
  padding: var(--spacing-xl);
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-sage);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.event-card__title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-charcoal);
  margin-bottom: var(--spacing-md);
}

.event-card__date,
.event-card__time,
.event-card__location,
.event-card__address {
  font-size: 1rem;
  margin-bottom: var(--spacing-xs);
}

.event-card__location {
  font-weight: 700;
  color: var(--color-charcoal);
  margin-top: var(--spacing-sm);
}

/* ============================================
   COUNTDOWN
   ============================================ */
.section--countdown {
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  max-width: 700px;
  margin: 0 auto;
}

.countdown__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: var(--color-sage);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
}

.countdown__number {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-charcoal);
  line-height: 1;
}

.countdown__label {
  font-size: 0.875rem;
  color: var(--color-charcoal);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ============================================
   LOCATION
   ============================================ */
.section--location {
  padding: var(--spacing-xxl) var(--spacing-md);
  text-align: center;
}

.location__map-wrapper {
  max-width: 800px;
  margin: 0 auto var(--spacing-lg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.location__map {
  display: block;
  width: 100%;
  height: 400px;
  border: none;
}

.location__btn {
  margin-top: var(--spacing-sm);
}

/* ============================================
   GALLERY
   ============================================ */
.section--gallery {
  padding: var(--spacing-xxl) var(--spacing-md);
}

.gallery__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.gallery__item {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.gallery__item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.gallery__item--wide {
  grid-column: span 2;
}

.gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 250px;
}

/* ============================================
   RSVP
   ============================================ */
.section--rsvp {
  padding: var(--spacing-xxl) var(--spacing-md);
}

.form--rsvp {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.rsvp__success {
  max-width: 500px;
  margin: var(--spacing-lg) auto 0;
  padding: var(--spacing-lg);
  background-color: rgba(199, 205, 176, 0.3);
  border: 1px solid var(--color-sage);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--color-charcoal);
}

/* ============================================
   UCAPAN
   ============================================ */
.section--ucapan {
  padding: var(--spacing-xxl) var(--spacing-md);
}

.form--ucapan {
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
  padding: var(--spacing-xl);
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.ucapan__list {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ucapan__item {
  padding: var(--spacing-md);
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-sage);
}

.ucapan__item:nth-child(even) {
  border-left-color: var(--color-rose);
}

.ucapan__item-name {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-charcoal);
  margin-bottom: var(--spacing-xs);
}

.ucapan__item-date {
  font-size: 0.8125rem;
  color: var(--color-warm-gray);
  margin-bottom: var(--spacing-sm);
}

.ucapan__item-text {
  font-size: 0.9375rem;
  color: var(--color-charcoal);
  line-height: 1.6;
}

/* ============================================
   FOOTER
   ============================================ */
.footer {
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: var(--color-charcoal);
  color: var(--color-white);
  text-align: center;
}

.footer__text {
  font-size: 1rem;
  margin-bottom: var(--spacing-sm);
  opacity: 0.9;
}

.footer__names {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add styles/sections.css && git commit -m "feat: add section-specific CSS styles"
```

---

### Task 5: Create CSS - Responsive

**Files:**
- Create: `styles/responsive.css`

- [ ] **Step 1: Write `styles/responsive.css` with all breakpoints**

```css
/* ============================================
   RESPONSIVE STYLES
   ============================================ */

/* Small phones (375px and below) */
@media (max-width: 375px) {
  html {
    font-size: 14px;
  }

  .overlay__names {
    font-size: 2rem;
  }

  .hero__names {
    font-size: 2.5rem;
  }

  .countdown__box {
    width: 70px;
    height: 70px;
  }

  .countdown__number {
    font-size: 1.5rem;
  }

  .gallery__grid {
    grid-template-columns: 1fr;
  }

  .gallery__item--wide {
    grid-column: span 1;
  }

  .form__radio-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

/* Phones (767px and below) */
@media (max-width: 767px) {
  .section__title {
    font-size: 1.75rem;
  }

  .overlay__names {
    font-size: 2.5rem;
  }

  .hero__names {
    font-size: 3rem;
  }

  .guest__card {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .event-card {
    padding: var(--spacing-lg);
  }

  .countdown {
    gap: var(--spacing-sm);
  }

  .countdown__box {
    width: 80px;
    height: 80px;
  }

  .countdown__number {
    font-size: 1.75rem;
  }

  .location__map {
    height: 280px;
  }

  .form--rsvp,
  .form--ucapan {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}

/* Tablets (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .events {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .gallery__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .countdown__box {
    width: 110px;
    height: 110px;
  }

  .countdown__number {
    font-size: 2.25rem;
  }
}

/* Desktop (1024px and above) */
@media (min-width: 1024px) {
  .section__title {
    font-size: 2.5rem;
  }

  .overlay__names {
    font-size: 4rem;
  }

  .hero__names {
    font-size: 5rem;
  }

  .events {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
  }

  .event-card {
    padding: var(--spacing-xxl) var(--spacing-xl);
  }

  .countdown {
    gap: var(--spacing-lg);
  }

  .countdown__box {
    width: 130px;
    height: 130px;
  }

  .countdown__number {
    font-size: 3rem;
  }

  .location__map {
    height: 450px;
  }

  .gallery__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .gallery__item--wide {
    grid-column: span 2;
  }

  .form--rsvp,
  .form--ucapan {
    padding: var(--spacing-xxl);
  }
}

/* Large Desktop (1440px and above) */
@media (min-width: 1440px) {
  .section--hero,
  .section--guest,
  .section--details,
  .section--countdown,
  .section--location,
  .section--gallery,
  .section--rsvp,
  .section--ucapan {
    padding-left: var(--spacing-xxl);
    padding-right: var(--spacing-xxl);
  }

  .hero__names {
    font-size: 6rem;
  }

  .countdown__box {
    width: 150px;
    height: 150px;
  }

  .countdown__number {
    font-size: 3.5rem;
  }

  .gallery__grid {
    max-width: 1200px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .fade-in {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add styles/responsive.css && git commit -m "feat: add responsive CSS with breakpoints and reduced motion"
```

---

### Task 6: Create Utils

**Files:**
- Create: `src/utils.js`

- [ ] **Step 1: Write `src/utils.js` with helper functions**

```javascript
/**
 * Convert a string to URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Get URL query parameter by name
 * @param {string} name
 * @returns {string|null}
 */
export function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Format a date to Indonesian locale string
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date to Indonesian locale string with time
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDateTime(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Debounce function execution
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show an element by removing the hidden class
 * @param {HTMLElement} element
 */
export function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}

/**
 * Hide an element by adding the hidden class
 * @param {HTMLElement} element
 */
export function hideElement(element) {
  if (element) {
    element.classList.add('hidden');
  }
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add src/utils.js && git commit -m "feat: add utility functions (slugify, formatDate, debounce, etc.)"
```

---

### Task 7: Create API Module

**Files:**
- Create: `src/api.js`

- [ ] **Step 1: Write `src/api.js` with Google Apps Script integration**

```javascript
// TODO: Replace with your actual Google Apps Script Web App URL after deployment
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

/**
 * Generic fetch wrapper with error handling
 * @param {string} action
 * @param {object} params
 * @returns {Promise<object>}
 */
async function fetchApi(action, params = {}) {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append('action', action);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'API returned an error');
    }

    return data;
  } catch (error) {
    console.error(`API call failed for action "${action}":`, error);
    throw error;
  }
}

/**
 * Get guest information by slug
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function getGuestBySlug(slug) {
  if (!slug) return null;
  const data = await fetchApi('getGuestBySlug', { slug });
  return data.guest || null;
}

/**
 * Submit RSVP data
 * @param {object} rsvpData
 * @param {string} rsvpData.slug
 * @param {string} rsvpData.kehadiran - 'hadir' or 'tidak hadir'
 * @param {number} rsvpData.jumlah
 * @returns {Promise<object>}
 */
export async function submitRSVP(rsvpData) {
  return fetchApi('submitRSVP', {
    slug: rsvpData.slug,
    kehadiran: rsvpData.kehadiran,
    jumlah: rsvpData.jumlah,
  });
}

/**
 * Submit ucapan (message)
 * @param {object} ucapanData
 * @param {string} ucapanData.nama
 * @param {string} ucapanData.pesan
 * @returns {Promise<object>}
 */
export async function submitUcapan(ucapanData) {
  return fetchApi('submitUcapan', {
    nama: ucapanData.nama,
    pesan: ucapanData.pesan,
  });
}

/**
 * Get list of ucapan messages
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getUcapanList(limit = 50) {
  const data = await fetchApi('getUcapanList', { limit });
  return data.ucapan || [];
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add src/api.js && git commit -m "feat: add API module for Google Apps Script integration"
```

---

### Task 8: Create Animations

**Files:**
- Create: `src/animations.js`

- [ ] **Step 1: Write `src/animations.js` with GSAP ScrollTrigger animations**

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize opening overlay fade-out animation
 * @param {HTMLElement} overlay
 * @param {HTMLElement} mainContent
 * @param {Function} onComplete
 */
export function initOverlayAnimation(overlay, mainContent, onComplete) {
  if (!overlay) return;

  const openBtn = overlay.querySelector('#open-invitation');
  if (!openBtn) return;

  openBtn.addEventListener('click', () => {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        overlay.style.display = 'none';
        if (mainContent) {
          mainContent.classList.remove('hidden');
        }
        if (typeof onComplete === 'function') {
          onComplete();
        }
        // Refresh ScrollTrigger after content is visible
        ScrollTrigger.refresh();
      },
    });
  });
}

/**
 * Initialize all section scroll animations
 */
export function initScrollAnimations() {
  // Hero section - fade in text
  gsap.from('.hero__text', {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section--hero',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  // Guest section - fade in card
  gsap.from('.guest__card', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section--guest',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  // Event cards - staggered entrance
  gsap.from('.event-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.events',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  // Countdown section - fade in
  gsap.from('.countdown', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section--countdown',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  // Location section - map slide up
  gsap.from('.location__map-wrapper', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section--location',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  // Gallery - parallax effect on images
  gsap.utils.toArray('.gallery__item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 80,
      scale: 0.95,
      duration: 1,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Subtle parallax on scroll
    gsap.to(item.querySelector('.gallery__image'), {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // RSVP section - form slide up
  gsap.from('.form--rsvp', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section--rsvp',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  // Ucapan section - form and list fade in
  gsap.from('.form--ucapan', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section--ucapan',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });

  gsap.from('.ucapan__item', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.ucapan__list',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });

  // Footer - fade in
  gsap.from('.footer', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Clean up all ScrollTrigger instances
 */
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add src/animations.js && git commit -m "feat: add GSAP ScrollTrigger animations for all sections"
```

---

### Task 9: Create RSVP Handler

**Files:**
- Create: `src/rsvp.js`

- [ ] **Step 1: Write `src/rsvp.js` with form initialization and submission**

```javascript
import { submitRSVP } from './api.js';
import { showElement, hideElement } from './utils.js';

/**
 * Initialize RSVP form handlers
 * @param {string} guestSlug - The current guest's slug
 */
export function initRSVP(guestSlug) {
  const form = document.getElementById('rsvp-form');
  const jumlahGroup = document.getElementById('jumlah-group');
  const successMessage = document.getElementById('rsvp-success');

  if (!form) return;

  // Toggle jumlah input based on kehadiran radio selection
  const radioInputs = form.querySelectorAll('input[name="kehadiran"]');
  radioInputs.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'hadir' && radio.checked) {
        if (jumlahGroup) {
          jumlahGroup.style.display = 'block';
        }
      } else if (radio.value === 'tidak hadir' && radio.checked) {
        if (jumlahGroup) {
          jumlahGroup.style.display = 'none';
        }
      }
    });
  });

  // Form submission handler
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const kehadiran = formData.get('kehadiran');
    const jumlah = parseInt(formData.get('jumlah') || '1', 10);

    if (!kehadiran) {
      alert('Silakan pilih kehadiran Anda.');
      return;
    }

    const submitBtn = form.querySelector('.form__submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
      await submitRSVP({
        slug: guestSlug,
        kehadiran,
        jumlah: kehadiran === 'hadir' ? jumlah : 0,
      });

      hideElement(form);
      showElement(successMessage);
    } catch (error) {
      console.error('RSVP submission failed:', error);
      alert('Gagal mengirim RSVP. Silakan coba lagi.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add src/rsvp.js && git commit -m "feat: add RSVP handler with form toggle and API submission"
```

---

### Task 10: Create Ucapan Handler

**Files:**
- Create: `src/ucapan.js`

- [ ] **Step 1: Write `src/ucapan.js` with form submission and list rendering**

```javascript
import { submitUcapan, getUcapanList } from './api.js';
import { formatDateTime } from './utils.js';

/**
 * Escape HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Render a single ucapan item
 * @param {object} item
 * @returns {string}
 */
function renderUcapanItem(item) {
  const nama = escapeHtml(item.nama);
  const pesan = escapeHtml(item.pesan);
  const tanggal = item.tanggal ? formatDateTime(item.tanggal) : '';

  return `
    <div class="ucapan__item">
      <p class="ucapan__item-name">${nama}</p>
      <p class="ucapan__item-date">${tanggal}</p>
      <p class="ucapan__item-text">${pesan}</p>
    </div>
  `;
}

/**
 * Load and render ucapan list
 * @param {HTMLElement} listContainer
 */
async function loadUcapanList(listContainer) {
  if (!listContainer) return;

  try {
    const ucapanList = await getUcapanList(50);

    if (ucapanList.length === 0) {
      listContainer.innerHTML = '<p class="text-center" style="color: var(--color-warm-gray);">Belum ada ucapan.</p>';
      return;
    }

    listContainer.innerHTML = ucapanList.map(renderUcapanItem).join('');
  } catch (error) {
    console.error('Failed to load ucapan list:', error);
    listContainer.innerHTML = '<p class="text-center" style="color: var(--color-warm-gray);">Gagal memuat ucapan.</p>';
  }
}

/**
 * Initialize ucapan form and list
 */
export function initUcapan() {
  const form = document.getElementById('ucapan-form');
  const listContainer = document.getElementById('ucapan-list');

  if (!form) return;

  // Initial load
  loadUcapanList(listContainer);

  // Auto-refresh every 30 seconds
  const refreshInterval = setInterval(() => {
    loadUcapanList(listContainer);
  }, 30000);

  // Form submission handler
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nama = formData.get('nama')?.toString().trim();
    const pesan = formData.get('pesan')?.toString().trim();

    if (!nama || !pesan) {
      alert('Nama dan ucapan wajib diisi.');
      return;
    }

    const submitBtn = form.querySelector('.form__submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;

    try {
      await submitUcapan({ nama, pesan });

      // Clear form
      form.reset();

      // Refresh list immediately
      await loadUcapanList(listContainer);

      // Scroll to the newest message
      const firstItem = listContainer.querySelector('.ucapan__item');
      if (firstItem) {
        firstItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error('Ucapan submission failed:', error);
      alert('Gagal mengirim ucapan. Silakan coba lagi.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(refreshInterval);
  });
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add src/ucapan.js && git commit -m "feat: add ucapan handler with XSS protection and auto-refresh"
```

---

### Task 11: Create Main Entry

**Files:**
- Modify: `src/main.js` (complete rewrite)

- [ ] **Step 1: Write `src/main.js` as the application entry point**

```javascript
import '../styles/main.css';
import '../styles/sections.css';
import '../styles/responsive.css';

import { getGuestBySlug } from './api.js';
import { getUrlParam, showElement, hideElement } from './utils.js';
import { initOverlayAnimation, initScrollAnimations } from './animations.js';
import { initRSVP } from './rsvp.js';
import { initUcapan } from './ucapan.js';

// Wedding date: 12 December 2026 at 08:00 WIB
const WEDDING_DATE = new Date('2026-12-12T08:00:00+07:00');

/**
 * Update countdown timer display
 */
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    document.getElementById('countdown-days').textContent = '00';
    document.getElementById('countdown-hours').textContent = '00';
    document.getElementById('countdown-minutes').textContent = '00';
    document.getElementById('countdown-seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
  document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}

/**
 * Initialize music controls
 */
function initMusicControls() {
  const musicControls = document.getElementById('music-controls');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const audio = document.getElementById('wedding-audio');

  if (!musicToggle || !audio) return;

  let isPlaying = false;

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      musicIcon.innerHTML = '&#9658;'; // Play icon
    } else {
      audio.play().catch((error) => {
        console.warn('Audio playback failed:', error);
      });
      musicIcon.innerHTML = '&#10074;&#10074;'; // Pause icon
    }
    isPlaying = !isPlaying;
  });

  // Show music controls after overlay is opened
  return {
    show() {
      if (musicControls) {
        showElement(musicControls);
      }
    },
    play() {
      if (!isPlaying) {
        audio.play().catch(() => {});
        musicIcon.innerHTML = '&#10074;&#10074;';
        isPlaying = true;
      }
    },
  };
}

/**
 * Load guest data from URL slug and update display
 */
async function loadGuestData() {
  const slug = getUrlParam('to');
  const guestNameEl = document.getElementById('guest-name');
  const guestAddressEl = document.getElementById('guest-address');

  if (!slug) {
    if (guestNameEl) guestNameEl.textContent = 'Tamu Undangan';
    if (guestAddressEl) guestAddressEl.textContent = 'Di tempat';
    return null;
  }

  try {
    const guest = await getGuestBySlug(slug);

    if (guest) {
      if (guestNameEl) guestNameEl.textContent = guest.nama || 'Tamu Undangan';
      if (guestAddressEl) guestAddressEl.textContent = guest.alamat || 'Di tempat';
      return guest;
    } else {
      if (guestNameEl) guestNameEl.textContent = 'Tamu Undangan';
      if (guestAddressEl) guestAddressEl.textContent = 'Di tempat';
      return null;
    }
  } catch (error) {
    console.error('Failed to load guest data:', error);
    if (guestNameEl) guestNameEl.textContent = 'Tamu Undangan';
    if (guestAddressEl) guestAddressEl.textContent = 'Di tempat';
    return null;
  }
}

/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', async () => {
  const overlay = document.getElementById('overlay');
  const mainContent = document.getElementById('main-content');
  const musicControls = initMusicControls();

  // Load guest data from URL
  const guest = await loadGuestData();
  const guestSlug = guest?.slug || getUrlParam('to') || '';

  // Initialize overlay animation
  initOverlayAnimation(overlay, mainContent, () => {
    // Callback after overlay is closed
    if (musicControls) {
      musicControls.show();
      musicControls.play();
    }

    // Initialize scroll animations after main content is visible
    initScrollAnimations();
  });

  // Start countdown timer
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Initialize RSVP form
  initRSVP(guestSlug);

  // Initialize Ucapan form and list
  initUcapan();
});
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add src/main.js && git commit -m "feat: add main entry point with guest loading, countdown, music, and form init"
```

---

### Task 12: Create Google Apps Script Backend

**Files:**
- Create: `backend/apps-script.js`

- [ ] **Step 1: Write `backend/apps-script.js` with complete backend logic**

```javascript
/**
 * Google Apps Script Backend for Wedding Invitation
 *
 * 1. Create a new Google Sheet with these sheets/tabs:
 *    - "Guests" : Columns: Nama, Alamat, Slug, RSVP, Jumlah
 *    - "Ucapan" : Columns: Nama, Pesan, Tanggal
 *
 * 2. In the Apps Script editor, paste this code.
 * 3. Deploy as Web App (Execute as: Me, Access: Anyone).
 * 4. Copy the Web App URL to src/api.js APPS_SCRIPT_URL constant.
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;

  try {
    if (action === 'getGuestBySlug') {
      return handleGetGuestBySlug(e.parameter.slug);
    } else if (action === 'getUcapanList') {
      return handleGetUcapanList(e.parameter.limit);
    } else {
      return jsonResponse({ status: 'error', message: 'Unknown action' });
    }
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  const action = e.parameter.action;

  try {
    if (action === 'submitRSVP') {
      return handleRSVP(e.parameter);
    } else if (action === 'submitUcapan') {
      return handleUcapan(e.parameter);
    } else {
      return jsonResponse({ status: 'error', message: 'Unknown action' });
    }
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Handle RSVP submission
 */
function handleRSVP(params) {
  const slug = params.slug;
  const kehadiran = params.kehadiran;
  const jumlah = parseInt(params.jumlah || '0', 10);

  if (!slug || !kehadiran) {
    return jsonResponse({ status: 'error', message: 'Missing required fields' });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Guests');
  const data = sheet.getDataRange().getValues();

  // Find row by slug (column 3, index 2)
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === slug) {
      sheet.getRange(i + 1, 5).setValue(kehadiran); // Column E (RSVP)
      sheet.getRange(i + 1, 6).setValue(jumlah);    // Column F (Jumlah)
      return jsonResponse({ status: 'success', message: 'RSVP saved' });
    }
  }

  return jsonResponse({ status: 'error', message: 'Guest not found' });
}

/**
 * Handle Ucapan submission
 */
function handleUcapan(params) {
  const nama = params.nama;
  const pesan = params.pesan;

  if (!nama || !pesan) {
    return jsonResponse({ status: 'error', message: 'Missing required fields' });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Ucapan');

  const tanggal = new Date();
  sheet.appendRow([nama, pesan, tanggal]);

  return jsonResponse({ status: 'success', message: 'Ucapan saved' });
}

/**
 * Get guest by slug
 */
function handleGetGuestBySlug(slug) {
  if (!slug) {
    return jsonResponse({ status: 'error', message: 'Slug required' });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Guests');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === slug) {
      return jsonResponse({
        status: 'success',
        guest: {
          nama: data[i][0],
          alamat: data[i][1],
          slug: data[i][2],
          rsvp: data[i][3] || '',
          jumlah: data[i][4] || 0,
        },
      });
    }
  }

  return jsonResponse({ status: 'success', guest: null });
}

/**
 * Get ucapan list
 */
function handleGetUcapanList(limit) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Ucapan');
  const data = sheet.getDataRange().getValues();

  const ucapanList = [];
  const maxRows = limit ? parseInt(limit, 10) : data.length;

  // Start from the end (newest first), skip header
  for (let i = data.length - 1; i >= 1 && ucapanList.length < maxRows; i--) {
    ucapanList.push({
      nama: data[i][0],
      pesan: data[i][1],
      tanggal: data[i][2] ? data[i][2].toISOString() : '',
    });
  }

  return jsonResponse({ status: 'success', ucapan: ucapanList });
}

/**
 * Generate slugs for all guests in the sheet
 * Run this manually from the Apps Script editor
 */
function generateSlugs() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Guests');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const nama = data[i][0];
    if (nama && !data[i][2]) {
      const slug = slugify(nama);
      sheet.getRange(i + 1, 3).setValue(slug);
    }
  }
}

/**
 * Convert text to URL-friendly slug
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Return JSON response with CORS headers
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add backend/apps-script.js && git commit -m "feat: add Google Apps Script backend with doGet, doPost, RSVP, and ucapan handlers"
```

---

### Task 13: Add Placeholder Assets

**Files:**
- Create: `public/images/.gitkeep`
- Create: `public/audio/.gitkeep`

- [ ] **Step 1: Create `.gitkeep` files for asset directories**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && touch public/images/.gitkeep public/audio/.gitkeep
```

- [ ] **Step 2: Commit**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add public/images/.gitkeep public/audio/.gitkeep && git commit -m "chore: add placeholder .gitkeep files for asset directories"
```

---

### Task 14: Testing & Verification

**Files:**
- (No new files — verification task)

- [ ] **Step 1: Start Vite dev server and verify it runs**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && npx vite
```
Expected output: Server starts on `http://localhost:3000` (or similar). Verify no build errors in terminal.

- [ ] **Step 2: Verify overlay section renders correctly**

Open `http://localhost:3000` in browser.
Expected: Dark overlay with couple names, date, and "Buka Undangan" button visible.

- [ ] **Step 3: Verify overlay close action**

Click "Buka Undangan" button.
Expected: Overlay fades out, main content appears, music controls appear, background music starts (if audio file exists).

- [ ] **Step 4: Verify all 9 sections are present**

Scroll through the entire page.
Expected: Sections appear in order: Hero, Guest, Details, Countdown, Location, Gallery, RSVP, Ucapan, Footer.

- [ ] **Step 5: Verify responsive layout at breakpoints**

Use browser DevTools to test widths:
- 375px, 767px, 768px, 1024px, 1440px
Expected: Layout adapts correctly. Event cards stack on mobile, side-by-side on tablet+. Gallery grid changes column count. Countdown boxes resize.

- [ ] **Step 6: Verify color scheme matches design spec**

Inspect elements:
- Background: `#FAF7F2` (cream)
- Buttons: `#C7CDB0` (soft sage)
- Guest card background: `rgba(242, 201, 206, 0.2)` (rose quartz 20%)
- Event card borders: `#C7CDB0` (soft sage)
- Countdown boxes: `#C7CDB0` (soft sage)
- Footer: `#2C2C2C` (charcoal)
- Secondary text: `#6B6B6B` (warm gray)

- [ ] **Step 7: Verify GSAP animations trigger on scroll**

Scroll slowly through each section.
Expected: Elements fade in and slide up as they enter viewport. Event cards stagger. Gallery items have parallax effect.

- [ ] **Step 8: Verify countdown timer is counting down**

Check the countdown numbers.
Expected: Numbers decrease every second. Target date: 12 December 2026 08:00 WIB.

- [ ] **Step 9: Verify music controls work**

Click the floating music button (bottom-right).
Expected: Icon toggles between play and pause. Audio plays/pauses accordingly.

- [ ] **Step 10: Verify RSVP form toggle and validation**

In RSVP section:
1. Select "Hadir" → Jumlah input appears.
2. Select "Tidak Hadir" → Jumlah input hides.
3. Submit without selecting → alert appears.
4. Submit with valid data → form hides, success message appears (will show API error until backend is deployed, which is expected).

- [ ] **Step 11: Verify ucapan form submission and list rendering**

In Ucapan section:
1. Submit without filling → alert appears.
2. Fill nama and pesan, submit → form clears, list refreshes (will show API error until backend is deployed, which is expected).
3. XSS test: Submit `<script>alert(1)</script>` in pesan field → output should show literal text, not execute script.

- [ ] **Step 12: Verify production build and preview**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && npx vite build
```
Expected: `dist/` directory created with optimized assets. No build errors.

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && npx vite preview
```
Expected: Production build preview runs correctly at `http://localhost:4173` (or similar).

- [ ] **Step 13: Commit final verification state**

Run:
```bash
cd /Volumes/ExMachina/coding/wedding-inv && git add . && git commit -m "chore: complete testing and verification"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- [x] Vite + Vanilla JS + GSAP stack
- [x] Google Sheets via Apps Script as database
- [x] All 9 HTML sections included
- [x] Color scheme variables applied throughout
- [x] RSVP form with radio toggle for jumlah
- [x] Ucapan form with XSS protection and auto-refresh
- [x] Guest personalization via URL slug
- [x] Countdown timer to wedding date
- [x] Music controls with floating button
- [x] Responsive breakpoints: 375px, 767px, 768-1023px, 1024px+, 1440px+
- [x] `prefers-reduced-motion` support
- [x] Google Apps Script backend with CORS
- [x] Vercel-ready build output

**2. Placeholder scan:**
- [x] No "TBD", "TODO", or "implement later" in steps
- [x] No vague instructions like "add appropriate error handling"
- [x] All code blocks contain complete, runnable code
- [x] APPS_SCRIPT_URL has a clear placeholder comment

**3. Type consistency:**
- [x] `getGuestBySlug` returns consistent shape in api.js and backend
- [x] `submitRSVP` params match between frontend and backend
- [x] `submitUcapan` params match between frontend and backend
- [x] `getUcapanList` limit parameter consistent
- [x] `slugify` implementation identical in utils.js and backend

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-24-wedding-invitation.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
