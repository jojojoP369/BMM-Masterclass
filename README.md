# THE NEXT LEVEL — Beyond Money Minds Masterclass Landing Page

## Overview

A high-converting landing page for the **"THE NEXT LEVEL"** free webinar hosted by Beyond Money Minds. The event runs **April 10-11, 2026** from **19:00-21:00 (Albanian time)** via Zoom. The page is fully written in **Albanian** and uses a premium **black & gold** design theme.

---

## File Structure

```
Masterclass_Free/
├── index.html              # Main landing page
├── register.html           # Registration form page
├── cloudflare-worker.js    # Backend API for form submissions (Cloudflare Workers)
├── logo.png                # Beyond Money Minds logo
├── jori.jpg                # Speaker photo — Jori DeFi
├── jori2.jpg               # Speaker photo — Jori DeFi (alt)
├── elena.jpg               # Speaker photo — Elena Demce
├── elena2.jpg              # Speaker photo — Elena Demce (alt)
├── marsid.jpg              # Speaker photo — Marsid Hila
└── README.md               # This file
```

---

## Pages

### 1. Landing Page (`index.html`)

The main marketing page. Single-page layout, fully responsive. No external dependencies except Google Fonts.

**Sections (top to bottom):**

| Section | Description |
|---|---|
| **Navigation** | Fixed top bar with logo + "Regjistrohu Falas" CTA button |
| **Hero** | Title "THE NEXT LEVEL", event date/time, countdown timer, main CTA |
| **Speakers** | 3 speaker cards (Jori, Marsid, Elena) with photos, bios, Instagram links |
| **Schedule** | 2-day program cards with topics and speaker chips |
| **What You'll Learn** | 6 benefit items with icons |
| **Quote** | Motivational quote block |
| **Who Is This For** | 6 target audience cards (3x2 grid) |
| **Why Now** | 4 urgency cards (2x2 grid) |
| **FAQ** | 6 interactive accordion questions |
| **Final CTA** | Urgency badge + final registration push |
| **Footer** | Logo + copyright |

**Key Features:**
- Live countdown timer to April 10, 2026 19:00 CET
- Ambient glow orbs (animated background)
- Floating gold particles
- Scroll-triggered fade-up animations
- Fully responsive (mobile-first)
- All CTA buttons link to `register.html`

### 2. Registration Page (`register.html`)

Custom registration form that collects:
- **First Name** (Emri)
- **Last Name** (Mbiemri)
- **Email**

**Flow:**
1. User fills in the form
2. Data is sent via POST to the Cloudflare Worker API
3. On success, a confirmation screen shows with a "Join Zoom" button
4. If the Worker is unavailable, data saves to `localStorage` as backup

**After successful registration, the user is shown the Zoom link:**
`https://us06web.zoom.us/meeting/register/tAOpGNqTSDCMBLMmdhV7sw`

---

## Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#060608` | Page background |
| `--bg-card` | `rgba(15, 15, 20, 0.85)` | Card backgrounds |
| `--gold` | `#d4af37` | Primary accent |
| `--gold-light` | `#f0d060` | Headings, highlights |
| `--gold-muted` | `#a08520` | Secondary text, labels |
| `--text` | `#eee` | Body text |
| `--text-muted` | `#999` | Muted/secondary text |

### Typography

- **Headings:** Playfair Display (serif) — weights 700, 800, 900
- **Body:** Inter (sans-serif) — weights 300-900
- Both loaded from Google Fonts

### Visual Effects

- **Glassmorphism:** `backdrop-filter: blur()` on cards
- **Glow Orbs:** Animated CSS blurred circles in the background
- **Particles:** JavaScript-generated floating gold dots
- **Gold Borders:** `1px solid rgba(212, 175, 55, 0.15)` on cards
- **Hover Effects:** `translateY()` elevation + glow increase on cards
- **Gradient CTA:** `linear-gradient(135deg, var(--gold), var(--gold-light))`
- **Shimmer:** `::before` pseudo-element sweep on CTA buttons

---

## Speakers

### Jori DeFi — Crypto & Trading Expert
- **Experience:** 6+ years in crypto (since 2019)
- **Bio highlight:** Made her first million in crypto
- **Instagram:** [@jori_defi](https://www.instagram.com/jori_defi)
- **Photo:** `jori.jpg`

### Marsid Hila — Forex Trader & Mentor
- **Experience:** 10+ years in financial markets
- **Bio highlight:** Trades all market types, results-driven approach
- **Instagram:** [@marsid.hila](https://www.instagram.com/marsid.hila)
- **Photo:** `marsid.jpg`

### Elena Demce — Business Mindset & Network Marketing
- **Experience:** 4 years in network marketing
- **Bio highlight:** Transforms how people think about money
- **Instagram:** [@iamelenademce](https://www.instagram.com/iamelenademce)
- **Photo:** `elena.jpg`

---

## Backend — Cloudflare Worker (`cloudflare-worker.js`)

### API Endpoints

#### `POST /register`
Saves a new registration.

**Request body (JSON):**
```json
{
  "firstName": "Jori",
  "lastName": "DeFi",
  "email": "jori@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registered successfully"
}
```

#### `GET /registrations?key=bmm2026secret`
Returns all registrations (password protected).

**Query parameters:**
- `key` — Password (default: `bmm2026secret`, **change this in production**)
- `format` — Optional. Set to `csv` for CSV export

**JSON response:**
```json
{
  "total": 42,
  "registrations": [
    {
      "firstName": "Jori",
      "lastName": "DeFi",
      "email": "jori@example.com",
      "registeredAt": "2026-03-30T15:00:00.000Z"
    }
  ]
}
```

**CSV export URL:**
```
https://bmm.jori-hexalb.workers.dev/registrations?key=bmm2026secret&format=csv
```

### Cloudflare Setup

1. **Worker URL:** `https://bmm.jori-hexalb.workers.dev`
2. **KV Namespace:** `BMM_REGISTRATIONS` bound as variable `REGISTRATIONS`
3. The Worker URL is configured in `register.html` line ~313

---

## Deployment Instructions

### Option 1: Cloudflare Pages (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click **Create Application** → **Upload your static files**
3. Name the project (e.g., `bmm-masterclass`)
4. Drag and drop the entire `Masterclass_Free` folder
5. Deploy — you'll get a URL like `bmm-masterclass.pages.dev`

### Option 2: Any Static Hosting

The landing page and registration page are pure HTML/CSS/JS with no build step. Upload all files to any static host:
- Netlify
- Vercel
- GitHub Pages
- Any web server (Apache, Nginx)

**Important:** The `register.html` references the Cloudflare Worker at `https://bmm.jori-hexalb.workers.dev/register`. If you change the Worker URL, update line ~313 in `register.html`.

### Option 3: Custom Domain

To use a custom domain:
1. Deploy to Cloudflare Pages
2. Go to the project settings → Custom domains
3. Add your domain and configure DNS

---

## Key Links

| What | URL |
|---|---|
| Zoom Registration | `https://us06web.zoom.us/meeting/register/tAOpGNqTSDCMBLMmdhV7sw` |
| Worker API | `https://bmm.jori-hexalb.workers.dev` |
| Export Registrations (JSON) | `https://bmm.jori-hexalb.workers.dev/registrations?key=bmm2026secret` |
| Export Registrations (CSV) | `https://bmm.jori-hexalb.workers.dev/registrations?key=bmm2026secret&format=csv` |
| Jori Instagram | `https://www.instagram.com/jori_defi` |
| Marsid Instagram | `https://www.instagram.com/marsid.hila` |
| Elena Instagram | `https://www.instagram.com/iamelenademce` |

---

## Event Details

- **Event:** THE NEXT LEVEL — Free Online Masterclass
- **Dates:** April 10-11, 2026
- **Time:** 19:00 - 21:00 (Albanian time / CET)
- **Platform:** Zoom
- **Language:** Albanian
- **Price:** Free
- **Recording:** Will be posted on Whop free channel after the event
