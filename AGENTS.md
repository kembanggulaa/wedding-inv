# AGENTS.md - Wedding Invitation Project

## Project Overview

A digital wedding invitation site for "Asep & Dina" built with vanilla JavaScript and Vite. Features guest-specific URLs, RSVP management, and animated scroll reveals via GSAP.

## Commands

```bash
npm run dev      # Start Vite dev server (port 3000)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

### Directory Structure
- `/src/*.js` - ES modules, imported directly in HTML via `<script type="module">`
- `/styles/*.css` - CSS split by concern (main, sections, responsive)
- `/public/images/` - Placeholder directory for couple photos, background
- `/public/audio/` - Audio assets (wedding-song.mp3)
- `/backend/apps-script.js` - Google Apps Script backend (separate deployment)

### Control Flow
1. **Entry**: `index.html` → loads `main.js` on DOMContentLoaded
2. **Guest Loading**: `main.js` reads `?to=<slug>` URL param → `api.js:getGuestBySlug()` → populates UI
3. **Opening Flow**: Click "Buka Undangan" → `animations.js:animateOpening()` → reveals main content → `initRSVP()` and `initUcapan()` called
4. **RSVP/Ucapan**: POST to Google Apps Script Web App → Google Sheet backend

### Key Configuration Points
- **Wedding Date**: Hardcoded in `src/main.js:12` as `WEDDING_DATE = new Date('2027-01-30T09:00:00+07:00')` (January 30, 2027, 09:00 WIB)
- **API URL**: Set in `src/api.js:6` - must be replaced with actual Google Apps Script Web App URL
- **Spreadsheet ID**: Set in `backend/apps-script.js:18` - must be replaced with actual Google Sheet ID

## Code Patterns

### Initialization Pattern
Each module exports an `init*` function called from `main.js`:
```javascript
export function initRSVP(guestSlug, guestName) { ... }
export function initUcapan(guestName) { ... }
```

### API Response Shape
All API functions return `{ success: boolean, data?: any, error?: string }`

### Animation Pattern
GSAP with ScrollTrigger, triggered at `start: 'top 80%'`:
```javascript
gsap.from(element, {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none none' }
});
```

### XSS Prevention
In `ucapan.js:120-124`, uses DOM textContent for safe rendering:
```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

## Google Apps Script Backend

Requires a Google Sheet with two sheets:
- **Tamu**: Columns A-E (Nama, Slug, RSVP, Jumlah, Ucapan)
- **Ucapan**: Columns A-C (Nama, Pesan, Timestamp)

Deployment: Extensions > Apps Script > Deploy as Web App (Anyone access)

## Styling

CSS organization:
- `main.css` - Base styles, utilities, buttons, forms
- `sections.css` - Section-specific styles (hero, gallery, event, countdown, etc.)
- `responsive.css` - Media queries

## Gotchas

- **Audio autoplay**: Browsers block autoplay; music only starts after user clicks "Buka Undangan" button
- **Month indexing**: JS Date uses 0-indexed months (`5` = June), but Google Sheets may differ
- **Guest slug uniqueness**: Slugs are stored in column B of Tamu sheet, matched case-sensitively
- **RSVP one-time**: Backend prevents re-submission (returns 409 Conflict)
- **RSVP name field**: Pre-filled from guest data, set as `readonly` in HTML
