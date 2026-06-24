# Undangan Digital Pernikahan — Design Spec

**Date:** 2026-06-24
**Author:** AI Assistant + User
**Status:** Pending Review

---

## 1. Overview

### 1.1 Purpose
Membuat undangan digital pernikahan yang:
- **Personalized**: Setiap tamu melihat namanya sendiri di undangan
- **Interaktif**: Tamu bisa RSVP dan kirim ucapan/doa
- **Elegan**: Animasi smooth dengan feel premium
- **Gratis 100%**: Tanpa biaya hosting atau database

### 1.2 Target Audience
- ~600+ tamu undangan
- Mayoritas akses via smartphone (mobile-first design)
- Link dikirim via WhatsApp/Telegram

### 1.3 Success Criteria
- [ ] Tamu membuka link dan melihat namanya
- [ ] Tamu bisa submit RSVP (Hadir/Tidak Hadir)
- [ ] Tamu bisa kirim ucapan & doa
- [ ] Data RSVP & ucapan masuk ke Google Sheets real-time
- [ ] Background musik berjalan setelah tamu buka undangan
- [ ] Tampilan responsive di semua ukuran layar
- [ ] Countdown timer akurat menuju hari H
- [ ] Peta lokasi bisa dibuka di Google Maps

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Tamu)                          │
│              Buka link via WhatsApp/HP                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   index.html│  │    main.js   │  │    style.css     │  │
│  │  (markup)   │  │ (logic+API)  │  │ (styling+anim)   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐                         │
│  │   GSAP      │  │  Google Maps │                         │
│  │ (animation) │  │   (embed)    │                         │
│  └─────────────┘  └──────────────┘                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼ (HTTPS GET/POST)
┌─────────────────────────────────────────────────────────────┐
│              BACKEND — Google Apps Script                    │
│              (Free, 20,000 requests/day)                    │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │   API Endpoint  │  │         Google Sheets           │  │
│  │  (Web App URL)  │  │  ┌──────────┐  ┌────────────┐  │  │
│  │                 │  │  │  Sheet 1 │  │  Sheet 2   │  │  │
│  │  GET /?slug=x   │──│  │  Tamu    │  │  Ucapan    │  │  │
│  │  POST /rsvp     │──│  │          │  │            │  │  │
│  │  POST /ucapan   │──│  │  Nama    │  │  Nama      │  │  │
│  │  GET /ucapan    │──│  │  Slug    │  │  Pesan     │  │  │
│  │                 │  │  │  RSVP    │  │  Timestamp │  │  │
│  └─────────────────┘  │  │  Jumlah  │  │            │  │  │
│                       │  └──────────┘  └────────────┘  │  │
│                       └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology | Purpose | Cost |
|-------|-----------|---------|------|
| **Build Tool** | Vite | Dev server, hot reload, production build | Free |
| **Language** | Vanilla JavaScript (ES6+) | No framework, simple code | Free |
| **Animation** | GSAP + ScrollTrigger | Smooth scroll animations, fade-in, parallax | Free |
| **Styling** | CSS3 + CSS Variables | Responsive design, theming | Free |
| **Database** | Google Sheets | Store guest list, RSVP, messages | Free |
| **API** | Google Apps Script | REST API endpoint (GET/POST) | Free |
| **Hosting** | Vercel | Static site hosting via GitHub | Free |
| **Version Control** | Git + GitHub | Code repository | Free |

### 2.3 File Structure

```
wedding-inv/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-06-24-wedding-invitation-design.md
├── public/
│   ├── images/
│   │   ├── couple-1.jpg          # Foto couple utama
│   │   ├── couple-2.jpg          # Foto couple kedua
│   │   └── background.jpg        # Background cover
│   └── audio/
│       └── wedding-song.mp3      # Lagu background
├── src/
│   ├── main.js                   # Entry point & logic
│   ├── api.js                    # Google Apps Script API calls
│   ├── animations.js             # GSAP animations
│   ├── rsvp.js                   # RSVP form handler
│   ├── ucapan.js                 # Ucapan form & list
│   └── utils.js                  # Utility functions (slugify, etc.)
├── styles/
│   ├── main.css                  # Global styles & CSS variables
│   ├── sections.css              # Section-specific styles
│   └── responsive.css            # Mobile/tablet/desktop breakpoints
├── index.html                    # Main HTML file
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies
└── .gitignore
```

---

## 3. Data Model

### 3.1 Google Sheets Structure

#### Sheet 1: `Tamu` (Guest List)

| Column | Header | Type | Description |
|--------|--------|------|-------------|
| A | `Nama` | String | Nama lengkap tamu (tampil di undangan) |
| B | `Slug` | String | URL-friendly (auto-generated: `budi-santoso`) |
| C | `RSVP` | String | `Hadir` / `Tidak Hadir` / empty |
| D | `Jumlah` | Number | Jumlah orang yang hadir (1-10) |
| E | `Ucapan` | String | Ringkasan ucapan (optional) |

**Example Rows:**
```
Nama          | Slug          | RSVP       | Jumlah | Ucapan
Budi Santoso  | budi-santoso  |            |        |
Ani Wijaya    | ani-wijaya    |            |        |
```

#### Sheet 2: `Ucapan` (Messages)

| Column | Header | Type | Description |
|--------|--------|------|-------------|
| A | `Nama` | String | Nama pengirim ucapan |
| B | `Pesan` | String | Isi ucapan/doa |
| C | `Timestamp` | DateTime | Waktu submit (auto-generated) |

**Example Rows:**
```
Nama          | Pesan                        | Timestamp
Budi Santoso  | Selamat ya! Semoga bahagia   | 2026-06-20 10:00:00
```

### 3.2 API Endpoints (Google Apps Script)

All endpoints return JSON.

#### `GET /?slug={slug}`
**Purpose:** Get guest data by slug

**Request:**
```
GET https://script.google.com/macros/s/{SCRIPT_ID}/exec?slug=budi-santoso
```

**Response (success):**
```json
{
  "success": true,
  "data": {
    "nama": "Budi Santoso",
    "slug": "budi-santoso",
    "rsvp": "",
    "jumlah": "",
    "ucapan": ""
  }
}
```

**Response (not found):**
```json
{
  "success": false,
  "error": "Tamu tidak ditemukan"
}
```

---

#### `POST /rsvp`
**Purpose:** Submit RSVP

**Request Body:**
```json
{
  "slug": "budi-santoso",
  "rsvp": "Hadir",
  "jumlah": 2
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "RSVP berhasil disimpan"
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "RSVP sudah pernah disubmit"
}
```

---

#### `POST /ucapan`
**Purpose:** Submit ucapan/doa

**Request Body:**
```json
{
  "nama": "Budi Santoso",
  "pesan": "Selamat menempuh hidup baru!"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Ucapan berhasil dikirim"
}
```

---

#### `GET /ucapan`
**Purpose:** Get all ucapan (sorted by newest first)

**Request:**
```
GET https://script.google.com/macros/s/{SCRIPT_ID}/exec?action=ucapan
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nama": "Budi Santoso",
      "pesan": "Selamat menempuh hidup baru!",
      "timestamp": "2026-06-20 10:00:00"
    },
    {
      "nama": "Ani Wijaya",
      "pesan": "Semoga langgeng selalu",
      "timestamp": "2026-06-20 09:30:00"
    }
  ]
}
```

### 3.3 URL Structure

**Link per tamu:**
```
https://undangan-anda.vercel.app/?to=budi-santoso
```

- `to` parameter = slug dari nama tamu
- Jika tanpa `?to=` → tampilkan undangan tanpa nama spesifik
- Jika `?to=` tidak ditemukan di database → tampilkan "Tamu Undangan"

---

## 4. UI/UX Design

### 4.1 Color Palette

The wedding invitation uses a soft, romantic, and elegant color scheme inspired by nature and romance.

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Soft Sage** | `#C7CDB0` | Primary accent, buttons, highlights, section backgrounds, borders |
| **Rose Quartz** | `#F2C9CE` | Secondary accent, hover states, subtle backgrounds, decorative elements |
| **Cream White** | `#FAF7F2` | Main background color, card backgrounds |
| **Charcoal** | `#2C2C2C` | Primary text color, headings |
| **Warm Gray** | `#6B6B6B` | Secondary text, captions, placeholders |
| **White** | `#FFFFFF` | Overlay text, button text on dark backgrounds |

**Color Usage Guidelines:**
- **Soft Sage (#C7CDB0)**: Used for primary buttons, active states, section dividers, and as a subtle background wash on alternating sections. Represents growth, harmony, and freshness.
- **Rose Quartz (#F2C9CE)**: Used for hover effects on buttons, secondary accents, decorative floral elements, and RSVP card backgrounds. Represents love, warmth, and romance.
- **Combinations**: Soft Sage and Rose Quartz are used together to create a balanced, calming visual experience. Text on Soft Sage backgrounds uses Charcoal (#2C2C2C) for readability.
- **Dark Sections** (Opening Overlay): Uses semi-transparent dark overlay (`rgba(0,0,0,0.45)`) on top of couple photo, with White (#FFFFFF) text.

### 4.2 Page Structure (Single-Page, Scroll Down)

| Section | Order | Content | Animation |
|---------|-------|---------|-----------|
| **Opening Overlay** | 1 | Full-screen cover, foto couple, "Buka Undangan" button | Fade-out on click |
| **Hero** | 2 | "The Wedding of", nama mempelai, quote | Fade-in, text reveal |
| **Nama Tamu** | 3 | "Kepada Yth.", nama tamu dari URL | Zoom-in, glow effect |
| **Detail Acara** | 4 | Akad & Resepsi (hari, tanggal, waktu, tempat) | Slide-up, stagger |
| **Countdown** | 5 | Timer mundur ke hari H | Number flip/count |
| **Peta Lokasi** | 6 | Google Maps embed + "Buka di Maps" button | Fade-in |
| **Galeri Foto** | 6 | 2 foto couple | Fade-in, parallax |
| **RSVP** | 7 | Form konfirmasi kehadiran | Slide-up |
| **Ucapan & Doa** | 8 | Form input + daftar ucapan yang sudah masuk | Slide-up, list stagger |
| **Footer** | 9 | Quote penutup, terima kasih | Fade-in |

### 4.3 Opening Overlay (Cover)

```
┌─────────────────────────────────────┐
│                                     │
│    [Background Foto Couple]         │
│    [Dark Overlay 45% - #00000073]   │
│                                     │
│         The Wedding of              │
│      (font: Playfair Display,       │
│       color: #FFFFFF, white)        │
│                                     │
│         Asep & Dina                 │
│      (font: Playfair Display,       │
│       color: #FFFFFF, large)        │
│                                     │
│    ┌─────────────────────────┐     │
│    │  🎵 Buka Undangan      │     │
│    │  (bg: #C7CDB0,         │     │
│    │   text: #2C2C2C)       │     │
│    └─────────────────────────┘     │
│                                     │
│    Kepada Yth.                      │
│    Budi Santoso                     │
│    (nama dari URL)                  │
│    (color: #FFFFFF)                 │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Overlay full-screen, fixed position
- Background: foto couple dengan dark overlay `rgba(0, 0, 0, 0.45)`
- Text semua menggunakan warna **White (#FFFFFF)** untuk kontras tinggi
- Tombol "Buka Undangan": background **Soft Sage (#C7CDB0)**, text **Charcoal (#2C2C2C)**
- Hover tombol: background berubah ke **Rose Quartz (#F2C9CE)**
- Setelah diklik: overlay fade-out (1s), musik mulai, scroll enabled

### 4.4 Nama Tamu Section

```
┌─────────────────────────────────────┐
│  (bg: #FAF7F2 - Cream White)       │
│                                     │
│    Kepada Yth.                      │
│    (color: #6B6B6B, warm gray)     │
│                                     │
│      ┌─────────────────┐           │
│      │  Budi Santoso   │           │
│      │  & Keluarga     │           │
│      │  (color: #2C2C2C)          │
│      │  (font: serif, large)      │
│      └─────────────────┘           │
│      (border: 2px solid #C7CDB0)   │
│      (bg: rgba(242, 201, 206, 0.2))│
│                                     │
│    Tanpa mengurangi rasa hormat,   │
│    kami mengundang Anda untuk      │
│    menghadiri pernikahan kami.     │
│    (color: #6B6B6B)                │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background: **Cream White (#FAF7F2)**
- Label "Kepada Yth.": **Warm Gray (#6B6B6B)**
- Nama tamu: **Charcoal (#2C2C2C)**, font serif besar, di-highlight dengan box
- Box nama: border **Soft Sage (#C7CDB0)**, background subtle **Rose Quartz 20% opacity**
- Animasi: zoom-in smooth saat scroll ke section ini
- Nama diambil dari Google Sheets berdasarkan slug di URL
- Jika tidak ditemukan: tampilkan "Tamu Undangan"

### 4.5 Detail Acara Section

```
┌─────────────────────────────────────┐
│  (bg: rgba(199, 205, 176, 0.15))  │
│                                     │
│    Detail Acara                     │
│    (color: #2C2C2C, heading)     │
│                                     │
│    ┌─────────────┐ ┌─────────────┐ │
│    │ (bg: #FAF7F2)│ │ (bg: #FAF7F2)│ │
│    │   AKAD      │ │  RESEPSI    │ │
│    │   NIKAH     │ │             │ │
│    │             │ │             │ │
│    │ 📅 Senin    │ │ 📅 Senin    │ │
│    │    30 Juni  │ │    30 Juni  │ │
│    │             │ │             │ │
│    │ 🕐 08:00    │ │ 🕐 11:00    │ │
│    │    WIB      │ │    - 14:00  │ │
│    │             │ │    WIB      │ │
│    │ 📍 Masjid   │ │ 📍 Gedung   │ │
│    │    Al-Hikmah│ │    Serba    │ │
│    │             │ │    Guna     │ │
│    │             │ │             │ │
│    │ (accent:    │ │ (accent:    │ │
│    │  #C7CDB0)   │ │  #C7CDB0)   │ │
│    └─────────────┘ └─────────────┘ │
│    (border: 1px solid              │
│     rgba(199, 205, 176, 0.4))     │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background section: **Soft Sage 15% opacity** untuk variasi visual
- Heading "Detail Acara": **Charcoal (#2C2C2C)**
- 2 card side-by-side di desktop, stacked di mobile
- Card background: **Cream White (#FAF7F2)**
- Card border: **Soft Sage 40% opacity**
- Label/header card ("AKAD NIKAH", "RESEPSI"): **Soft Sage (#C7CDB0)** background, **Charcoal** text
- Icon: **Soft Sage (#C7CDB0)**
- Text detail: **Charcoal (#2C2C2C)**
- Data editable di `index.html`
- Animasi: slide-up dengan stagger delay

### 4.6 Countdown Timer

```
┌─────────────────────────────────────┐
│  (bg: #FAF7F2 - Cream White)       │
│                                     │
│      Menuju Hari Bahagia            │
│      (color: #2C2C2C)             │
│                                     │
│    ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│    │ 15 │ │ 08 │ │ 42 │ │ 30 │   │
│    │    │ │    │ │    │ │    │   │
│    │Hari│ │Jam │ │Men │ │Det │   │
│    └────┘ └────┘ └────┘ └────┘   │
│    (bg: #C7CDB0)                  │
│    (text: #2C2C2C)                │
│    (border-radius: 12px)          │
│                                     │
│    Sabtu, 30 Juni 2026              │
│    (color: #6B6B6B)               │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background section: **Cream White (#FAF7F2)**
- Heading "Menuju Hari Bahagia": **Charcoal (#2C2C2C)**
- Countdown boxes: background **Soft Sage (#C7CDB0)**, text **Charcoal (#2C2C2C)**
- Border radius: 12px untuk feel soft dan modern
- Label di bawah angka (Hari, Jam, Menit, Detik): **Charcoal** atau **Warm Gray**
- Tanggal target: **Warm Gray (#6B6B6B)**
- Real-time countdown ke tanggal acara
- Update setiap detik
- Format: Hari : Jam : Menit : Detik
- Target tanggal editable di `index.html`

### 4.7 Peta Lokasi Section

```
┌─────────────────────────────────────┐
│  (bg: rgba(242, 201, 206, 0.1))  │
│                                     │
│         Lokasi Acara                │
│         (color: #2C2C2C)          │
│                                     │
│    ┌─────────────────────────────┐ │
│    │                             │ │
│    │   [Google Maps Embed]       │ │
│    │   (border-radius: 16px)     │ │
│    │   (border: 2px solid        │ │
│    │    #C7CDB0)                 │ │
│    │                             │ │
│    └─────────────────────────────┘ │
│                                     │
│    ┌─────────────────────────────┐ │
│    │  📍 Buka di Google Maps     │ │
│    │  (bg: #C7CDB0)              │ │
│    │  (text: #2C2C2C)            │ │
│    │  (hover: #F2C9CE)           │ │
│    └─────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background section: **Rose Quartz 10% opacity** untuk variasi visual
- Heading "Lokasi Acara": **Charcoal (#2C2C2C)**
- Embed Google Maps iframe dengan border **Soft Sage (#C7CDB0)**, border-radius 16px
- Tombol "Buka di Google Maps":
  - Background: **Soft Sage (#C7CDB0)**
  - Text: **Charcoal (#2C2C2C)**
  - Hover: background **Rose Quartz (#F2C9CE)**
- Koordinat/alamat editable di `index.html`

### 4.8 Galeri Foto Section

```
┌─────────────────────────────────────┐
│  (bg: #FAF7F2 - Cream White)       │
│                                     │
│         Galeri Foto                 │
│         (color: #2C2C2C)          │
│                                     │
│    ┌─────────────────────────────┐ │
│    │                             │ │
│    │     [Foto Couple 1]         │ │
│    │  (border-radius: 16px)      │ │
│    │  (shadow: soft,             │ │
│    │   rgba(199, 205, 176, 0.3)) │ │
│    │                             │ │
│    └─────────────────────────────┘ │
│                                     │
│    ┌─────────────────────────────┐ │
│    │                             │ │
│    │     [Foto Couple 2]         │ │
│    │  (border-radius: 16px)      │ │
│    │  (shadow: soft,             │ │
│    │   rgba(242, 201, 206, 0.3)) │ │
│    │                             │ │
│    └─────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background section: **Cream White (#FAF7F2)**
- Heading "Galeri Foto": **Charcoal (#2C2C2C)**
- Hanya 2 foto (sesuai permintaan)
- Full-width di mobile, constrained di desktop (max-width: 600px)
- Border radius: 16px untuk feel soft
- Box shadow subtle dengan warna **Soft Sage 30%** dan **Rose Quartz 30%**
- Animasi: fade-in dengan parallax subtle
- Ganti foto: simpan file baru ke `public/images/`

### 4.9 RSVP Section

```
┌─────────────────────────────────────┐
│  (bg: rgba(199, 205, 176, 0.12))  │
│                                     │
│      Konfirmasi Kehadiran           │
│      (color: #2C2C2C)             │
│                                     │
│    Nama: Budi Santoso               │
│    (pre-filled, read-only)          │
│    (color: #6B6B6B)               │
│                                     │
│    Apakah Anda akan hadir?          │
│    (color: #2C2C2C)               │
│                                     │
│    ○ Hadir          ○ Tidak Hadir   │
│    (selected:                        │
│     bg: #C7CDB0,                   │
│     border: #C7CDB0)               │
│                                     │
│    Jumlah Tamu: [ 2 ]               │
│    (muncul jika pilih "Hadir")      │
│    (input border: #C7CDB0)         │
│    (focus: #F2C9CE)                │
│                                     │
│    ┌─────────────────────────────┐ │
│    │      Kirim Konfirmasi       │ │
│    │  (bg: #C7CDB0)              │ │
│    │  (text: #2C2C2C)            │ │
│    │  (hover: #F2C9CE)           │ │
│    └─────────────────────────────┘ │
│                                     │
│    ✅ Terima kasih!                 │
│    RSVP Anda sudah tersimpan.       │
│    (color: #C7CDB0, icon)         │
│    (text: #6B6B6B)                │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background section: **Soft Sage 12% opacity**
- Heading "Konfirmasi Kehadiran": **Charcoal (#2C2C2C)**
- Label: **Charcoal (#2C2C2C)**
- Nama pre-filled: **Warm Gray (#6B6B6B)**, read-only
- Radio button:
  - Unselected: border **Warm Gray**
  - Selected: background **Soft Sage (#C7CDB0)**, border **Soft Sage**
- Input fields:
  - Border: **Soft Sage (#C7CDB0)**
  - Focus state: border **Rose Quartz (#F2C9CE)**, shadow subtle
  - Background: **White (#FFFFFF)**
- Tombol "Kirim Konfirmasi":
  - Background: **Soft Sage (#C7CDB0)**
  - Text: **Charcoal (#2C2C2C)**
  - Hover: background **Rose Quartz (#F2C9CE)**
  - Border-radius: 8px
- Pesan sukses:
  - Icon check: **Soft Sage (#C7CDB0)**
  - Text: **Warm Gray (#6B6B6B)**
- Jumlah tamu: number input (1-10), muncul hanya jika "Hadir"
- Submit → POST ke Google Apps Script → update Sheet `Tamu`
- Setelah submit: tampilkan pesan sukses, sembunyikan form
- Cegah duplicate: cek apakah RSVP sudah ada

### 4.10 Ucapan & Doa Section

```
┌─────────────────────────────────────┐
│  (bg: #FAF7F2 - Cream White)       │
│                                     │
│      Ucapan & Doa                   │
│      (color: #2C2C2C)             │
│                                     │
│    Nama: Budi Santoso               │
│    (pre-filled)                     │
│    (color: #6B6B6B)               │
│                                     │
│    Ucapan/Doa:                      │
│    (color: #2C2C2C)               │
│    ┌─────────────────────────────┐ │
│    │ Tulis ucapan dan doa Anda   │ │
│    │ di sini...                  │ │
│    │                             │ │
│    │ (bg: #FFFFFF)               │ │
│    │ (border: 1px solid #C7CDB0)│ │
│    │ (focus: #F2C9CE)           │ │
│    └─────────────────────────────┘ │
│                                     │
│    ┌─────────────────────────────┐ │
│    │       Kirim Ucapan          │ │
│    │  (bg: #C7CDB0)              │ │
│    │  (text: #2C2C2C)            │ │
│    │  (hover: #F2C9CE)           │ │
│    └─────────────────────────────┘ │
│                                     │
│    ─────────────────────────────    │
│    (divider: rgba(199, 205, 176,   │
│     0.3))                         │
│                                     │
│    📜 Ucapan & Doa                  │
│    (color: #2C2C2C)               │
│                                     │
│    ┌─────────────────────────────┐ │
│    │ (bg: #FFFFFF)               │ │
│    │ (border-left: 3px solid     │ │
│    │  #F2C9CE)                   │ │
│    │ Budi Santoso                │ │
│    │ (color: #2C2C2C, bold)    │ │
│    │ Selamat menempuh hidup      │ │
│    │ baru! Semoga langgeng.      │ │
│    │ (color: #6B6B6B)           │ │
│    │ 20 Juni 2026, 10:00         │ │
│    │ (color: #C7CDB0)           │ │
│    └─────────────────────────────┘ │
│                                     │
│    ┌─────────────────────────────┐ │
│    │ (bg: #FFFFFF)               │ │
│    │ (border-left: 3px solid     │ │
│    │  #C7CDB0)                   │ │
│    │ Ani Wijaya                  │ │
│    │ Semoga bahagia selalu!      │ │
│    │ 20 Juni 2026, 09:30         │ │
│    └─────────────────────────────┘ │
│                                     │
│    (scrollable area, max-h: 400px) │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background section: **Cream White (#FAF7F2)**
- Heading "Ucapan & Doa": **Charcoal (#2C2C2C)**
- Form:
  - Nama: pre-filled, **Warm Gray (#6B6B6B)**
  - Textarea: background **White**, border **Soft Sage**, focus **Rose Quartz**
  - Placeholder: **Warm Gray**
- Tombol "Kirim Ucapan":
  - Background: **Soft Sage (#C7CDB0)**
  - Text: **Charcoal (#2C2C2C)**
  - Hover: **Rose Quartz (#F2C9CE)**
- Divider: **Soft Sage 30% opacity**
- Sub-heading "📜 Ucapan & Doa": **Charcoal (#2C2C2C)**
- Card ucapan:
  - Background: **White (#FFFFFF)**
  - Border-left: 3px solid, bergantian **Rose Quartz** dan **Soft Sage** untuk variasi visual
  - Nama: **Charcoal**, bold
  - Pesan: **Warm Gray (#6B6B6B)**
  - Timestamp: **Soft Sage (#C7CDB0)**
  - Border-radius: 8px
  - Box shadow: subtle
- Submit → POST ke Google Apps Script → tambah row di Sheet `Ucapan`
- Daftar ucapan diambil dari API `GET /ucapan`
- Auto-refresh daftar setelah submit
- Urutan: terbaru di atas
- Scrollable jika ucapan banyak (max-height: 400px)

### 4.11 Footer Section

```
┌─────────────────────────────────────┐
│  (bg: #2C2C2C - Charcoal)          │
│                                     │
│    "Cinta sejati adalah ketika     │
│     dua jiwa saling melengkapi"    │
│    (color: #FFFFFF, italic)       │
│    (font: Playfair Display)        │
│                                     │
│    ─────────────────────────────    │
│    (divider: rgba(199, 205, 176,   │
│     0.5))                         │
│                                     │
│    Terima kasih atas doa dan       │
│    restunya                        │
│    (color: #FAF7F2)               │
│                                     │
│         Asep & Dina                 │
│         (color: #F2C9CE)          │
│         (font: serif, large)       │
│                                     │
│    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│    (divider: #C7CDB0)             │
│                                     │
│    Made with ♡                      │
│    (color: #F2C9CE)               │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Background: **Charcoal (#2C2C2C)** — dark footer untuk kontras dengan section di atasnya
- Quote: **White (#FFFFFF)**, italic, font Playfair Display
- Divider: **Soft Sage 50% opacity**
- Text "Terima kasih...": **Cream White (#FAF7F2)**
- Nama mempelai: **Rose Quartz (#F2C9CE)**, font serif besar
- Divider bawah: **Soft Sage (#C7CDB0)**
- "Made with ♡": **Rose Quartz (#F2C9CE)**
- Animasi: fade-in saat scroll ke footer

---

## 5. Animations (GSAP)

### 5.1 Global Animation Strategy
- ScrollTrigger untuk animasi berbasis scroll
- Easing: `power2.out` atau `power3.out` untuk feel elegan
- Stagger: 0.1-0.2s antar elemen
- Duration: 0.6-1.2s per animasi

### 5.2 Per-Section Animations

| Section | Animation | Trigger |
|---------|-----------|---------|
| Opening Overlay | Fade-out (1s) | On click "Buka Undangan" |
| Hero Text | Fade-in + y: 30→0 | ScrollTrigger start |
| Nama Tamu | Scale: 0.8→1 + opacity 0→1 | ScrollTrigger start |
| Detail Cards | y: 50→0, stagger 0.15s | ScrollTrigger start |
| Countdown Numbers | Flip/count effect | On load (after overlay) |
| Maps | Fade-in | ScrollTrigger start |
| Gallery Photos | y: 30→0, parallax | ScrollTrigger start |
| RSVP Form | y: 40→0 | ScrollTrigger start |
| Ucapan List | y: 30→0, stagger 0.1s | ScrollTrigger start |
| Footer | Fade-in + y: 20→0 | ScrollTrigger start |

---

## 6. Audio

### 6.1 Background Music
- Format: MP3
- File location: `public/audio/wedding-song.mp3`
- Playback: start setelah user klik "Buka Undangan" (browser policy tidak mengizinkan autoplay tanpa interaksi)
- Controls: icon speaker kecil di pojok kanan bawah (toggle play/pause)
  - Button background: **Soft Sage (#C7CDB0)**
  - Icon color: **Charcoal (#2C2C2C)**
  - Hover: **Rose Quartz (#F2C9CE)**
  - Border-radius: 50% (circular)
  - Box shadow: subtle
- Volume: default 50%

### 6.2 How to Change Song
1. Ganti file `public/audio/wedding-song.mp3` dengan file MP3 Anda
2. Tidak perlu ubah kode apapun

---

## 7. Customization Guide

### 7.1 What Can Be Edited (No Coding Required)

| Element | File/Location | How |
|---------|--------------|-----|
| Nama mempelai | `index.html` | Edit text |
| Tanggal acara | `index.html` | Edit text + JS config |
| Lokasi acara | `index.html` | Edit text |
| Koordinat maps | `index.html` | Edit Google Maps embed URL |
| Quote/quote | `index.html` | Edit text |
| Foto couple | `public/images/` | Replace files |
| Background cover | `public/images/` | Replace file |
| Lagu | `public/audio/` | Replace MP3 file |
| Warna tema | `styles/main.css` | Edit CSS variables |
| Font | `index.html` | Edit Google Fonts link |

### 7.2 CSS Variables (Tema)

```css
:root {
  /* Primary Colors */
  --soft-sage: #C7CDB0;          /* Soft Sage - Primary accent */
  --rose-quartz: #F2C9CE;        /* Rose Quartz - Secondary accent */
  
  /* Neutral Colors */
  --cream-white: #FAF7F2;        /* Main background */
  --charcoal: #2C2C2C;           /* Primary text */
  --warm-gray: #6B6B6B;          /* Secondary text */
  --white: #FFFFFF;              /* White text */
  
  /* Functional Colors */
  --overlay-dark: rgba(0, 0, 0, 0.45);
  --border-light: rgba(199, 205, 176, 0.4);
  --border-rose: rgba(242, 201, 206, 0.5);
  
  /* Usage Variables */
  --primary-color: var(--soft-sage);
  --secondary-color: var(--rose-quartz);
  --text-color: var(--charcoal);
  --bg-color: var(--cream-white);
  --overlay-color: var(--overlay-dark);
  
  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Lato', sans-serif;
}
```

---

## 8. Error Handling

### 8.1 Frontend Errors

| Scenario | Behavior |
|----------|----------|
| URL tanpa `?to=` | Tampilkan undangan tanpa nama spesifik |
| Slug tidak ditemukan | Tampilkan "Tamu Undangan" sebagai default |
| Gagal koneksi ke API | Tampilkan pesan: "Sedang memuat data..." + retry 3x |
| Retry gagal semua | Tampilkan pesan: "Mohon refresh halaman" |
| Form validation gagal | Highlight field error, tampilkan pesan spesifik |
| RSVP sudah pernah submit | Tampilkan pesan: "Anda sudah mengkonfirmasi" |

### 8.2 Backend Errors (Google Apps Script)

| Scenario | Behavior |
|----------|----------|
| Parameter wajib kosong | Return error 400 dengan pesan spesifik |
| Slug tidak ditemukan | Return error 404 |
| RSVP duplicate | Return error 409 (conflict) |
| CORS violation | Reject request |
| Rate limit | Google Apps Script handle otomatis (quota 20k/hari) |

---

## 9. Testing Plan

### 9.1 Manual Testing Checklist

**Functional Tests:**
- [ ] Buka link dengan nama tamu valid (`?to=budi-santoso`)
- [ ] Buka link tanpa parameter `?to=`
- [ ] Buka link dengan slug yang tidak ada di database
- [ ] Klik "Buka Undangan" → overlay hilang, musik mulai
- [ ] Scroll ke semua section, animasi berjalan
- [ ] Submit RSVP "Hadir" dengan jumlah tamu
- [ ] Submit RSVP "Tidak Hadir"
- [ ] Cek data RSVP masuk ke Google Sheets
- [ ] Submit ucapan & doa
- [ ] Cek ucapan masuk ke Google Sheets
- [ ] Cek daftar ucapan update real-time
- [ ] Cek countdown timer akurat
- [ ] Klik "Buka di Google Maps" → buka app/maps
- [ ] Toggle musik play/pause

**Responsive Tests:**
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] Android medium (360px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Desktop large (1440px+)

**Browser Tests:**
- [ ] Chrome (mobile & desktop)
- [ ] Safari (iOS)
- [ ] Samsung Internet
- [ ] Firefox (desktop)

**Performance Tests:**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total page size < 2MB (termasuk foto)

---

## 10. Deployment

### 10.1 Prerequisites
- Akun GitHub (gratis)
- Akun Vercel (gratis, login with GitHub)
- Akun Google (untuk Google Sheets & Apps Script)

### 10.2 Deployment Steps

1. **Push code ke GitHub**
2. **Connect repo ke Vercel**
   - Import project dari GitHub
   - Framework preset: `Vite`
   - Deploy otomatis
3. **Setup Google Sheets**
   - Buat spreadsheet baru
   - Tambah sheet `Tamu` dan `Ucapan`
   - Isi data tamu dari Excel
4. **Setup Google Apps Script**
   - Buka `Extensions > Apps Script`
   - Paste kode API
   - Deploy as Web App
   - Copy URL endpoint
5. **Update Frontend**
   - Masukkan URL Apps Script ke `src/api.js`
   - Commit & push → auto deploy ke Vercel
6. **Generate Links**
   - Gunakan script/apps script untuk generate link per tamu
   - Format: `https://your-site.vercel.app/?to={slug}`

### 10.3 Custom Domain (Optional)
- Vercel support custom domain gratis
- Atau gunakan subdomain Vercel: `your-project.vercel.app`

---

## 11. Security Considerations

- Google Apps Script CORS: hanya izinkan domain Vercel
- API tidak memerlukan autentikasi (public read/write)
- Google Sheets tidak mengandung data sensitif (hanya nama tamu)
- No user authentication needed
- Data tamu tidak bisa dihapus via API (hanya tambah/update RSVP)

---

## 12. Future Enhancements (Out of Scope)

Fitur-fitur berikut TIDAK termasuk dalam scope ini, tapi bisa ditambahkan nanti:
- Amplop digital / transfer rekening
- QR Code check-in di lokasi acara
- Live streaming embed
- Gallery foto unlimited
- Cerita cinta / love story timeline
- Admin dashboard
- Statistik kehadiran real-time

---

## 13. Open Questions / Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Nama mempelai? | User akan edit sendiri di `index.html` |
| 2 | Tanggal & lokasi acara? | User akan edit sendiri di `index.html` |
| 3 | Foto couple? | User akan ganti sendiri di `public/images/` |
| 4 | Lagu? | User akan ganti sendiri di `public/audio/` |
| 5 | Warna tema? | User bisa edit CSS variables |
| 6 | Font? | Default: Playfair Display + Lato |

---

## 14. Approval

**Design reviewed and approved by:**
- [ ] User Review
- [ ] Implementation Plan Created

---

**Next Step:** After user approval, invoke `writing-plans` skill to create implementation plan.
