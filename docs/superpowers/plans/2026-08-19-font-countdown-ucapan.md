# Font, Countdown & Ucapan Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply typography changes (EB Garamond Medium for couple names, Ovo for body text), fix the static countdown (wrong target date), and remove the empty-state message in the ucapan list.

**Architecture:** Font swap via CSS custom properties in `main.css` (single source of truth) plus weight normalization to the 400/500 weights actually available on Google Fonts. Countdown fixed by pointing the existing `WEDDING_DATE` constant at the real event date pinned to WIB. Ucapan empty state hides the list title/divider via a new `setUcapanListVisible()` helper in `ucapan.js`.

**Tech Stack:** Vanilla JS + Vite, Google Fonts (EB Garamond 500 + Italic 400, Ovo 400), no test framework (verification = build + manual browser check).

**Decisions confirmed with user (2026-08-19):**
- "Analogia-Italic" is NOT available on Google Fonts/Fontshare — italic text keeps EB Garamond Italic.
- EB Garamond has no weight 300; "Medium" = 500. Ovo only has 400. Use those.
- Countdown target: 30 January 2027, 09:00 WIB (Akad Nikah), pinned `+07:00`.
- Date labels in HTML stay static (user's choice); only countdown becomes dynamic.
- Empty ucapan: hide list title "Ucapan & Doa" + divider too, not just the message.

---

### Task 1: Font System

**Files:**
- Modify: `index.html:12` (Google Fonts link)
- Modify: `styles/main.css:28-31` (typography variables), `:115`, `:150`, `:218` (weights)
- Modify: `styles/sections.css` (multiple selectors, see mapping below)

- [ ] **Step 1: Replace Google Fonts link in index.html:12**

```html
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;1,400&family=Ovo&display=swap" rel="stylesheet">
```

(Removes Pinyon Script and unused EB Garamond weights; adds Ovo.)

- [ ] **Step 2: Update typography variables in main.css:28-31**

```css
  /* Typography */
  --font-couple: 'EB Garamond', serif;
  --font-heading: 'Ovo', serif;
  --font-body: 'Ovo', serif;
```

(`--font-names` removed; no remaining usages after Step 4.)

- [ ] **Step 3: Normalize weights in main.css** (Ovo only ships 400; avoid faux-bold)

| Selector | Line | Change |
|---|---|---|
| `.btn` | 115 | `font-weight: 600` → `400` |
| `.form-label` | 150 | `font-weight: 600` → `400` |
| `.section-title` | 218 | `font-weight: 700` → `400` |

- [ ] **Step 4: Update selectors in sections.css**

| Selector | Line(s) | Change |
|---|---|---|
| `.overlay-label` ("the wedding of") | 52 | `var(--font-names)` → `var(--font-body)` |
| `.overlay-names` ("Vivit & Iwan") | 61,63 | → `var(--font-couple)`, weight `700` → `500` |
| `.guest-name` | 81 | weight `600` → `400` |
| `.hero-label` ("the wedding of") | 110 | `var(--font-names)` → `var(--font-body)` |
| `.hero-names` ("Vivit & Iwan") | 119,121 | → `var(--font-couple)`, weight `700` → `500` |
| `.hero-quote` (italic) | 128 | → `var(--font-couple)` (stays EB Garamond Italic) |
| `.guest-name-display` | 163 | weight `700` → `400` |
| `.event-date` | 207 | weight `600` → `400` |
| `.schedule-label` | 257 | weight `600` → `400` |
| `.schedule-time` | 263 | weight `500` → `400` |
| `.countdown-number` | 297 | weight `700` → `400` |
| `.countdown-date` | 313 | weight `300` → `400` |
| `.gallery-caption-label` (italic) | 380 | → `var(--font-couple)` (stays EB Garamond Italic) |
| `.gallery-caption-text` | 390 | weight `600` → `400` |
| `.ucapan-item-name` | 487 | weight `700` → `400` |
| `.footer-quote` (italic) | 524 | → `var(--font-couple)` (stays EB Garamond Italic) |
| `.footer-names` ("Vivit & Iwan") | 547,549 | → `var(--font-couple)`, weight `700` → `500` |

- [ ] **Step 5: Verify no dangling `--font-names` references**

Run: `grep -rn "font-names" styles/ index.html src/`
Expected: no matches

- [ ] **Step 6: Commit**

```bash
git add index.html styles/main.css styles/sections.css
git commit -m "feat: switch typography to EB Garamond Medium + Ovo"
```

Note: `index.html` and `styles/main.css` also carry the user's prior uncommitted content updates (image paths, guest section restructure); they ride along in this commit.

---

### Task 2: Countdown Fix

**Files:**
- Modify: `src/main.js:11-12`

- [ ] **Step 1: Replace the wedding date constant**

```js
// Wedding date for countdown (January 30, 2027, 09:00 WIB)
const WEDDING_DATE = new Date('2027-01-30T09:00:00+07:00');
```

Pinned to `+07:00` so the countdown is accurate regardless of the viewer's timezone. (Old value `new Date(2026, 5, 30, 8, 0, 0)` = 30 June 2026, already past → countdown stuck at 00.)

- [ ] **Step 2: Commit**

```bash
git add src/main.js
git commit -m "fix: countdown target date to 30 Jan 2027 09:00 WIB"
```

---

### Task 3: Empty Ucapan State

**Files:**
- Modify: `src/ucapan.js:75-93`

- [ ] **Step 1: Replace `loadUcapanList` and add visibility helper**

```js
async function loadUcapanList(container) {
  if (!container) return;

  // Show loading
  container.innerHTML = '<p class="ucapan-loading">Memuat ucapan...</p>';
  setUcapanListVisible(true);

  try {
    const result = await getUcapanList();

    if (result.success && result.data && result.data.length > 0) {
      renderUcapanList(container, result.data);
      setUcapanListVisible(true);
    } else {
      container.innerHTML = '';
      setUcapanListVisible(false);
    }
  } catch (error) {
    console.error('Error loading ucapan:', error);
    container.innerHTML = '<p class="ucapan-empty">Gagal memuat ucapan.</p>';
    setUcapanListVisible(true);
  }
}

/**
 * Show/hide ucapan list title and divider
 * @param {boolean} visible
 */
function setUcapanListVisible(visible) {
  const title = document.querySelector('.ucapan-list-title');
  const divider = document.querySelector('.ucapan-divider');
  if (title) title.classList.toggle('hidden', !visible);
  if (divider) divider.classList.toggle('hidden', !visible);
}
```

- [ ] **Step 2: Verify no remaining "Belum ada ucapan"**

Run: `grep -rn "Belum ada ucapan" src/ index.html`
Expected: no matches

- [ ] **Step 3: Commit**

```bash
git add src/ucapan.js
git commit -m "feat: hide ucapan list entirely when empty"
```

---

### Task 4: Verification & Docs

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: exits 0, no errors

- [ ] **Step 2: Update AGENTS.md wedding-date reference**

```
- **Wedding Date**: Hardcoded in `src/main.js:12` as `WEDDING_DATE = new Date('2027-01-30T09:00:00+07:00')` (January 30, 2027, 09:00 WIB)
```

- [ ] **Step 3: Manual browser check via dev server** (user-facing)

- "Vivit & Iwan" (overlay, hero, footer) renders EB Garamond Medium (500)
- Other text renders Ovo; italic text stays EB Garamond Italic
- Countdown ticks down toward 30 Jan 2027 09:00 WIB (~164 days from 2026-08-19)
- Empty ucapan: no "Belum ada ucapan..." message, list title + divider hidden

- [ ] **Step 4: Commit docs**

```bash
git add AGENTS.md
git commit -m "docs: update wedding date reference in AGENTS.md"
```
