# DIGITAL SEBA (digitalseba.pages.dev) — COMPLETE A–Z DEEP AUDIT REPORT
**Audited Directory:** `c:\Users\Monir\Downloads\Compressed\main project\digitalseba.pages.dev`  
**Audit Scope:** Full Project Inventory, Architecture, Code Quality, Security, Performance, UI/UX, Responsive, Accessibility, Assets, and Dependencies.  
**Mode:** READ-ONLY DEEP AUDIT (NO SOURCE CODE MODIFICATION / NO FIX / NO COMMITS)  
**Date:** September 2026  

---

## 1. Executive Summary

A comprehensive, phased, end-to-end audit was conducted on the current project repository (`digitalseba.pages.dev`). The application is a multi-purpose Bangladeshi digital service platform and portal aggregator combining:
1. A Next.js / static client homepage featuring service cataloging and theme selection.
2. An extensive single-page utility toolbox (`tools/index.html`) offering over 30 client-side tools (photo studio, document generation, PDF manipulation, converters, barcode/QR tools).
3. A live IPTV streaming portal (`live-tv/index.html`) with an M3U8 stream catalog of over 90 channels.
4. A Google Drive resources directory (`resources/index.html`) with an indexed database of curated files.
5. Specialized service tools including voter search (`services/Voteshondhan/`), voter transfer form generator (`services/voter-transfer/`), and student certificate generator.
6. A gamified Pomodoro workspace (`focus-mode/app.html`, branded AshFocus).
7. A 21-theme dynamic theme preview and switching engine (`portal/` and `homepage-themes/`).

### Key Findings Summary:
- **Total Files Scanned:** 40,738 files (including 39,775 files across embedded theme workspaces and node_modules).
- **Core Application Files:** ~963 non-node_modules files across 14 major subsystems.
- **Critical JavaScript Syntax Breaks:** Multiple files in `assets/js/live-tv/` contain unquoted raw JSX/HTML tags, throwing runtime `SyntaxError` and crashing video player controls.
- **Corrupted Vendor Script:** `tools/js/dynamic-counter.js` contains a 404 error HTML/text payload from a CDN instead of JavaScript code.
- **Critical 404 Navigation Links:** 8 major dropdown links in the main navigation point to non-existent standalone HTML files (`/tools/passport/`, `/tools/nid/`, etc.) which are actually modal containers inside `tools/index.html`. Furthermore, legal pages (`/pages/privacy.html`, `/pages/terms.html`) are completely missing from disk.
- **Asset Path Resolution Bug:** `resources/index.html` uses double relative paths (`../../assets/`) while sitting at `/resources/index.html` (1 level deep), failing to load fonts, stylesheets, and core scripts.
- **Exposed API Keys & Client IDs:** Hardcoded Firebase API keys and Google Cloud OAuth client credentials exist across 3 client-side script files.
- **Massive Performance Bottlenecks:** `tools/js/opencv.js` is ~10 MB, `resources/index.html` has an 863 KB inline JSON array, and multiple unoptimized PNG images exceed 1.5 MB to 4.5 MB.
- **Overall Project Health Score:** **58 / 100**

---

## 2. Project Overview

| Metric | Details |
| :--- | :--- |
| **Project Name** | Digital Seba (Digital-Seba) |
| **Origin Repository** | `https://github.com/DigitalStudioseba/Digital-Seba.git` |
| **Target Deployment** | Cloudflare Pages (`digitalseba.pages.dev`) / Custom Domain (`digiseba.shop`) |
| **Platform Target** | Web Browsers, Android WebViews, Smart TVs / Android TVs (for IPTV) |
| **Primary Authors** | Monir Hossain (Founder / Lead), with modules integrated from AshFocus (Mohammad Ashikur Rahman) |
| **Primary Language** | Bengali (bn) & English (en) with bilingual toggles |

---

## 3. Complete Project Structure

```text
digitalseba.pages.dev/
├── .gitignore                     # Git ignore rules (includes build output, temp scripts)
├── _redirects                     # Cloudflare/Netlify redirect rules (/live-tv -> /live-tv/ 301)
├── robots.txt                     # SEO robots configuration (pointing to https://digiseba.shop)
├── sitemap.xml                    # Single-URL sitemap configuration
├── manifest.json                  # PWA Manifest (theme #0F172A, scope /)
├── sw.js                          # Service Worker (v2 client-claiming cache buster)
├── index.html                     # Main portal landing page (Next.js client hydration export)
├── formatted_index.html           # Unminified/formatted mirror of index.html
├── 404.html                       # Global 404 error page
├── nav.html                       # Extracted modular navbar template
├── preview.html                   # Theme testing iframe container
├── about/
│   └── index.html                 # About Monir Hossain portfolio (Blogger XML template wrapped)
├── assets/
│   ├── css/                       # Core styles: main.css, components.css, responsive.css, animations.css
│   │   └── live-tv/               # Catalog, mobile, and player modular CSS
│   ├── js/                        # Core logic: theme.js, language.js, main.js, search.js, firebase-init.js
│   │   └── live-tv/               # (Corrupted) bootstrap.js, channel-catalog.js, stream-player.js, ui-renderer.js
│   ├── data/                      # channels.json (210KB), channels.m3u (131KB), resources.json (1.07MB)
│   └── images/                    # logo.png (70KB), monir-portrait.png (1.18MB), monir-creative-director.png (940KB)
├── data/
│   └── channels.json              # Divergent older copy of IPTV channels
├── focus-mode/
│   ├── index.html                 # Focus Mode entry shell
│   ├── app.html                   # AshFocus full gamified Pomodoro Next.js export
│   └── _next/                     # Next.js static chunks and woff2 font files
├── homepage-themes/               # 20 Alternate Homepage Themes
│   ├── theme-aero/                # Vite + React (contains full node_modules & dist/)
│   ├── theme-apex/ ... theme-genesis/ # Standalone static HTML themes
│   ├── theme-lumina/              # Next.js App Router (contains .next/, out/, _next/)
│   ├── theme-nova/                # Vite + React (contains node_modules & dist/)
│   ├── theme-spark/               # Next.js (contains .next/ & node_modules/)
│   └── theme-zenith/              # Single-file bundled Vite project (contains node_modules & dist/)
├── link-auditor/
│   └── index.html                 # Client-side broken link & status verification utility
├── live-tv/
│   ├── index.html                 # Live TV IPTV streaming application
│   ├── 404.html                   # Live TV specific fallback
│   ├── CNAME                      # Custom domain pointer (iptv.trionine.com)
│   ├── README.md                  # Stream catalog documentation
│   ├── robots.txt & sitemap.xml   # Live TV SEO definitions
│   ├── css/ & js/                 # Dedicated IPTV runtime styles & player engines
│   └── assets/logos/              # 540+ PNG/SVG channel logos
├── out/                           # Exported root Next.js static build artifacts
├── _next/                         # Root Next.js static chunks, CSS, and media
├── portal/
│   └── index.html                 # Theme switcher iframe runtime (loads activeTheme from localStorage)
├── resources/
│   ├── index.html                 # Master Drive resources directory (contains 863KB inline JSON)
│   ├── out/                       # Next.js PostgreSQL/Drizzle resource directory export
│   ├── package.json               # Drizzle/Next.js dependencies
│   └── docs & scripts             # Verification scripts, Drive links name lists, checklists
├── services/
│   ├── index.html                 # Services catalog directory
│   ├── voter-transfer/            # Form-13 Voter area transfer PDF generation app
│   ├── Voteshondhan/              # Client-side Voter List PDF search engine (with PDF.js worker)
│   └── ছাত্র রেজিস্ট্রেশন.../       # Student registration and testimonial certificate form
├── theme-selector/
│   └── index.html                 # 21-theme gallery with lazy-loaded iframe previews
└── tools/
    ├── index.html                 # Giant 555KB tools platform (105 modals, 30+ utilities)
    ├── css/                       # 35+ tool-specific stylesheets (tools03.css, ppl.css, etc.)
    ├── js/                        # 40+ client-side libraries (opencv.js, pdf-lib, tesseract, etc.)
    └── link-auditor/              # Duplicate copy of link auditor
```

---

## 4. Technology Stack

- **Client Architecture:** Static HTML5, Vanilla JavaScript (ES6+), CSS3 Variables, Tailwind CSS (in exported Next.js builds).
- **Modern Framework Build Artifacts:**
  - Next.js (14.x / 15.x / 16.x static exports via Turbopack and Webpack).
  - Vite + React (in theme workspaces `theme-aero`, `theme-nova`, `theme-zenith`).
- **Client Libraries & Engines:**
  - Video Streaming: `hls.js` (v1.5.11), `mpegts.js` (v1.7.3)
  - PDF Manipulation: `pdf-lib.min.js`, `pdf.min.js` (PDF.js v3.11.174), `html2pdf.bundle.min.js`, `jspdf`
  - Computer Vision & Imaging: `opencv.js` (WebAssembly 10MB), `@mediapipe/selfie_segmentation`, `@tensorflow/tfjs`, `cropper.min.js`, `heic2any.min.js`
  - OCR: `tesseract.min.js`
  - Barcode & QR: `qrcode.min.js`, `JsBarcode.all.min.js`, `html5-qrcode`
  - Archiving: `jszip.min.js`, `FileSaver.min.js`
- **Backend / Database / Cloud Integrations:**
  - Google Firebase v8 (Firestore, Realtime Database, Analytics)
  - Google Identity Services (GSI) & Google Drive REST API v3
  - Google Tag Manager (`G-7B73VX1KPT`)
  - Cloudflare Pages hosting (`_redirects`)
  - Template/Legacy: Drizzle ORM + PostgreSQL template configs inside `resources/` (inactive in static runtime).

---

## 5. Feature Inventory

| Feature | Primary Files Involved | Operating Mechanism | Dependencies | Health Status | Problems Identified |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Main Portal Hub** | `index.html`, `portal/index.html`, `theme-selector/index.html` | Checks `localStorage.getItem('activeTheme')`. If theme selected, redirects to `/portal/index.html` which loads the theme inside an iframe. | LocalStorage, Theme Directory | 🟡 Degraded | Navbar links point to missing sub-routes; theme switcher iframes cause significant memory load. |
| **Tools Suite (30+ Tools)** | `tools/index.html`, `tools/js/*`, `tools/css/*` | Giant single-page app with modal dialogs toggled via JavaScript functions (`openModal`, `setActiveMode`). | `opencv.js`, `pdf-lib`, `tesseract.js`, `jspdf`, `heic2any` | 🟡 Degraded | 10MB `opencv.js` blocks initial load; `dynamic-counter.js` is a corrupted 404 file; high `!important` CSS wars. |
| **IPTV Streaming (Live TV)** | `live-tv/index.html`, `live-tv/js/*`, `assets/data/channels.json` | Parses M3U playlist and channels JSON, initializes HLS.js or MPEG-TS player, supports category filters & search. | `hls.js`, `mpegts.js`, Firebase (Chat) | 🟢 Functional in `live-tv/`, 🔴 Broken in `assets/js/live-tv/` | `assets/js/live-tv/*` contains corrupt syntax; mixed-content HTTP stream URLs blocked under HTTPS. |
| **Voter Search (VoteSondhan)** | `services/Voteshondhan/index.html`, `app.js` | Parses uploaded official voter list PDFs client-side using PDF.js text coordinates (3 columns x 5 rows) without sending data to servers. | PDF.js v3.11.174 & Web Worker | 🟢 Active / Secure | Privacy-preserving; relies on external CDN worker fallback. |
| **Voter Transfer Form (Form-13)** | `services/voter-transfer/index.html` | Interactive Bengali form generating print-ready Bangladesh Election Commission Form-13 A4 canvas. | Browser Print API, Google Fonts | 🟢 Active | Excellent print styles; needs validation before printing. |
| **Student Registration & Certificate** | `services/ছাত্র রেজিস্ট্রেশন.../index.html` | Form generating bilingual academic student testimonial/registration certificate. | LocalStorage, Print CSS | 🟡 Active with Path Issues | Folder has Bengali unicode characters which cause 404s on servers lacking UTF-8 URL decoding. |
| **Drive Resources Directory** | `resources/index.html`, `assets/js/resources-render.js` | Displays searchable, paginated catalog of Google Drive files grouped by folder with extension badges. | `window.allFiles` inline array | 🔴 Broken Styling | Double relative path bug (`../../assets/`) breaks all CSS & JS; 863KB inline JSON payload. |
| **Focus Mode (Pomodoro)** | `focus-mode/index.html`, `focus-mode/app.html` | Gamified productivity timer with ambient soundscapes, pet companions, and quest systems (AshFocus). | Next.js exported bundle, Canvas | 🟡 Functional | Disables user keyboard shortcuts (F12, Ctrl+U) and right-click; branding refers to AshFocus. |
| **Link Auditor** | `link-auditor/index.html`, `tools/link-auditor/index.html` | Browser tool to crawl and verify internal/external URLs and report broken links. | Fetch API, CORS proxies | 🟢 Active | Duplicate copies exist in root and tools directory. |
| **Bilingual Localization** | `assets/js/language.js` | Switches DOM text between English and Bengali using `data-en` and `data-bn` attributes; emits `languageChanged` event. | DOM Dataset, LocalStorage | 🟢 Active | Solid implementation; missing translations in some tool modals. |

---

## 6. Architecture Audit

```mermaid
graph TD
    User([End User / Browser])
    
    subgraph Client Application Shell
        Index[index.html / Root]
        Portal[portal/index.html Theme Frame]
        ThemeSelector[theme-selector/index.html]
    end

    subgraph Core Functional Subsystems
        Tools[tools/index.html<br/>30+ Modular Tool Modals]
        LiveTV[live-tv/index.html<br/>HLS / IPTV Player]
        Resources[resources/index.html<br/>Drive Files Directory]
        Services[services/index.html<br/>Govt Forms & VoteSondhan]
        Focus[focus-mode/app.html<br/>AshFocus Pomodoro]
    end

    subgraph Client-Side Heavy Engines
        OpenCV[opencv.js WebAssembly - 10MB]
        PDFEngines[PDF.js / pdf-lib / html2pdf]
        MediaPipe[MediaPipe & TensorFlow Selfie Segment]
        Tesseract[Tesseract.js OCR]
    end

    subgraph External Cloud Services
        Firebase[(Google Firebase<br/>Firestore & Realtime DB)]
        GDrive[(Google Drive API v3)]
        GTM[Google Tag Manager]
        CDNs[cdnjs / jsDelivr / unpkg]
        Streams[External IPTV Stream Hosts<br/>HTTP/HTTPS m3u8]
    end

    User --> Index
    Index -. Theme Redirect .-> Portal
    Portal --> ThemeSelector
    Index --> Tools
    Index --> LiveTV
    Index --> Resources
    Index --> Services
    Index --> Focus

    Tools --> OpenCV
    Tools --> PDFEngines
    Tools --> MediaPipe
    Tools --> Tesseract
    Tools -. OAuth .-> GDrive

    LiveTV --> Streams
    LiveTV -. Live Chat .-> Firebase
    Index --> GTM
    Tools --> CDNs
```

### Architectural Deficiencies:
1. **Multi-Architecture Fragmentation:** The project is not a unified single-page application or a clean multi-page application. It is an amalgamation of a Next.js SSG build (`index.html`, `focus-mode/`), an extracted legacy Blogger/HTML5 site (`about/`), a massive procedural monolithic toolbox (`tools/`), an iframe theme switcher (`portal/`), and independent standalone service apps (`services/`).
2. **Duplicated Code & Split Feeds:** Two separate channel database files exist: `assets/data/channels.json` (210 KB) and `data/channels.json` (210 KB) with different checksums.
3. **Dead Modular Scripts:** The folder `assets/js/live-tv/` contains an attempted refactoring of the Live TV logic that was abandoned in a broken syntax state, while `live-tv/` runs its own copies inside `live-tv/js/`.

---

## 7. File-by-File Source Audit (Key Subsystems)

| File Path | Purpose | Size | Imports / Dependencies | Potential Bugs & Vulnerabilities |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | Homepage shell & theme bootstrap | 156 KB | `_next/` chunks, `assets/images/logo.png` | 404 links to `/tools/passport/`, `/pages/privacy.html`. Immediate client redirect if `activeTheme` is set. |
| `about/index.html` | Founder / About profile | 75.7 KB | FontAwesome, Google Fonts, `assets/css/*` | Contains obsolete Blogger XML template declarations (`b:skin`, `b:include`). Missing `lang` attribute. |
| `tools/index.html` | Mega Utility Hub | 555 KB | 54 scripts, 7 stylesheets, `opencv.js`, `jspdf` | 18 images missing alt text; 344 inputs missing labels; massive DOM size (>10,000 lines); loads 10MB script. |
| `tools/js/dynamic-counter.js` | Intended barcode/counter utility | 71 B | None | **Corrupted file!** Contains `"Couldn't find the requested file /dist/dynamic-counter.js in jsbarcode."` SyntaxError on parse. |
| `tools/js/tele.js` | Cloud storage & QR combined script | 132 KB | Google GAPI, Google GIS client | Hardcoded Google API Key and OAuth Client ID on lines 25-26. |
| `tools/js/opencv.js` | Computer vision library | 9.99 MB | Emscripten WebAssembly loader | Gigantic payload (10 MB). Freezes low-end mobile devices during evaluation. |
| `assets/js/firebase-init.js` | Central Firebase v8 initialization | 1.37 KB | Firebase v8 App, Firestore, Analytics | Hardcoded Firebase config with active project credentials. |
| `assets/js/live-tv/bootstrap.js` | Modular Live TV bootstrap | 3.34 KB | `videoPlayer` | **Corrupted Syntax:** Unquoted JSX `<svg>` tags on lines 43 & 46 break runtime execution. |
| `assets/js/live-tv/stream-player.js`| Modular stream player | 3.00 KB | `hls.js`, `mpegts.js` | **Corrupted Syntax:** Unquoted JSX `<svg>` on line 63. |
| `assets/js/live-tv/ui-renderer.js` | Modular UI generator | 4.65 KB | None | **Corrupted Syntax:** Unquoted JSX `<svg>` on line 9. |
| `assets/js/live-tv/channel-catalog.js`| Modular M3U parser | 2.84 KB | Fetch API | **Corrupted Syntax:** `console.log(Parsed channels from M3U.);` unquoted string literal on line 63. |
| `assets/js/live-tv.js` | Standalone IPTV script | 14.8 KB | `hls.js` | Line 96 contains unquoted syntax error `console.log(Parsed channels from M3U.);`. |
| `resources/index.html` | Master Google Drive directory | 933 KB | `resources-render.js`, Google Fonts | Relative path bug: `<link href="../../assets/...">` fails (404) because file is at level 1, not level 2. Inline data array is 863 KB. |
| `services/index.html` | Services landing catalog | 37.8 KB | `assets/css/*`, `assets/js/*` | Dropdown links to non-existent `/tools/birth/index.html`, etc. |
| `services/Voteshondhan/app.js` | PDF Voter Search Engine | 34.3 KB | PDF.js v3.11.174 | Clean coordinate parsing logic; relies on external CDN worker fallback. |
| `focus-mode/app.html` | AshFocus gamified Pomodoro | 77.6 KB | Next.js Turbopack chunks | Right-click and devtools hotkeys actively hijacked on lines 2-7. |
| `portal/index.html` | Theme switching iframe frame | 2.46 KB | None | Listens for `CHANGE_THEME` postMessage; potential recursive iframe embedding if improperly guarded. |
| `theme-selector/index.html` | Theme visual selector | 9.68 KB | IntersectionObserver | Renders 21 lazy-loaded iframes simultaneously, causing excessive memory consumption when scrolled. |

---

## 8. Frontend Audit

- **Pages & Routing:**
  - Standard top-level routes (`/`, `/services/`, `/tools/`, `/resources/`, `/live-tv/`, `/focus-mode/`, `/about/`, `/theme-selector/`, `/portal/`) return HTTP 200.
  - Sub-routes referenced in navigation menus (`/tools/passport/`, `/tools/nid/`, `/tools/photo/`, `/tools/pdf/`, `/tools/ai/`, `/tools/utility/`) DO NOT EXIST and return HTTP 404.
  - Missing legal pages (`/pages/privacy.html`, `/pages/terms.html`) return HTTP 404.
- **Components & Modals:**
  - `tools/index.html` holds over 105 distinct modal dialog containers. Modals are styled with fixed positioning, high z-indexes (up to `2147483647`), and hidden by default with `display: none`.
- **Loading & Empty States:**
  - Live TV has fallback channel logos and offline stream alerts.
  - Resources directory lacks a skeleton loader; with an 863KB dataset, filtering causes visible DOM lag on mobile.
- **Language Switcher:**
  - The bilingual toggle (`#langToggle`) updates DOM labels cleanly using `data-en` and `data-bn` attributes, but fails to translate dynamically injected third-party tool forms.

---

## 9. Backend / API Audit

- **Backend Framework:** **Serverless / Pure Client-Side Static.**
  - There is no active custom Node.js, Express, Python, or Go backend running in the deployment runtime.
  - An orphaned `resources/package.json` with Next.js + Drizzle ORM + PostgreSQL template exists as a development artifact, with connection strings pointing to local database `127.0.0.1:5432/app_db`.
- **API Endpoints:** None hosted on the origin server. All data operations utilize:
  1. Local static JSON/M3U files (`assets/data/channels.json`, `channels.m3u`).
  2. Direct client-side calls to Google Drive REST API (`https://www.googleapis.com/drive/v3/files`).
  3. Direct client-side connections to Firebase Realtime Database and Firestore.
- **Mixed Content Vulnerability:**
  - The application is hosted over HTTPS (`https://digitalseba.pages.dev` or `https://digiseba.shop`).
  - Numerous IPTV streams in `assets/data/channels.json` and `live-tv/README.md` use unencrypted `http://` protocols (e.g. `http://ua.online24.pm/...`, `http://202.70.146.135:8000/...`).
  - Modern web browsers block these streams automatically due to Mixed Content Security Restrictions.

---

## 10. Database Audit

- **Databases Detected:**
  1. **Google Firebase Firestore & Realtime Database:**
     - App ID: `1:993709551183:web:358d38f050115cf984843a`
     - Database URL: `https://totemic-sector-373910-default-rtdb.asia-southeast1.firebasedatabase.app`
     - Project ID: `totemic-sector-373910`
     - Used for: Live TV community chat and analytics.
     - **Security Concern:** Public read/write rules must be verified in Firebase Console. If security rules are set to `allow read, write: if true;`, unauthorized users can spam, wipe, or exfiltrate chat data.
  2. **PostgreSQL / Drizzle (Development Template Artifact):**
     - Configuration in `resources/drizzle.config.json` points to `postgresql://postgres:postgres@127.0.0.1:5432/app_db`.
     - Completely inactive in production; harmless but constitutes dead configuration clutter.

---

## 11. Security Audit

> [!WARNING]
> Hardcoded credentials detected. For security compliance, actual secret tokens have been masked in this report.

### Exposed Secrets & Credentials:
1. **Google Firebase API Key & Project ID:**
   - **File:** `assets/js/firebase-init.js` (Line 7 & Line 11)
   - **File:** `live-tv/js/bootstrap.js` (Line 8 & Line 12)
   - **Type:** Google Firebase API Key (`AIza...TNY`) & GCP Project (`totemic-sector-373910`)
   - **Risk:** Client-side Firebase keys are designed to be public IF secured by Firebase Security Rules. However, having them duplicated and unconstrained allows malicious actors to consume Firestore/RTDB quotas.
2. **Google Drive API Key & OAuth Client ID:**
   - **File:** `tools/js/tele.js` (Line 25 & Line 26)
   - **Type:** Google OAuth2 Client ID (`742363063259-...apps.googleusercontent.com`) & API Key (`AIza...2BDY`)
   - **Risk:** Grants access to Google Drive API with `drive.file` scope. If the API key is not domain-restricted in Google Cloud Console, third parties can hijack the key and exceed quotas.

### DOM XSS & Unsafe Injections:
- **Over 250 instances of `.innerHTML = ...`** without HTML entity sanitization or DOMPurify.
- In `assets/js/resources-render.js` (Lines 93, 110): Folder titles and file names are interpolated directly into `.innerHTML`. If any Google Drive file or folder name contains malicious script tags (e.g. `<img src=x onerror=alert(1)>`), stored XSS will execute in the user's session.
- In `tools/js/wpformatter.js` (Lines 234, 261, 415): Question texts and input fields are rendered via unescaped string interpolation.

### Anti-User Hotkey Hijacking:
- `focus-mode/app.html` contains an aggressive keyboard and mouse interceptor:
  ```javascript
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || (e.ctrlKey && e.keyCode === 85)) {
      e.preventDefault(); return false;
    }
  });
  ```
  This impedes user accessibility and violates standard web UX guidelines without providing actual security.

---

## 12. Performance Audit

### Heavyweight Asset Bottlenecks:
| File | Size | Impact |
| :--- | :--- | :--- |
| `tools/js/opencv.js` | **9.99 MB** | Extreme network download cost; causes high CPU freeze during script parsing on mobile devices. |
| `live-tv/assets/logos/delicious.png` | **4.58 MB** | Massive single logo image. Should be optimized SVG or WebP under 30 KB. |
| `live-tv/assets/logos/goldmines-bollywood.png` | **2.07 MB** | Heavy unoptimized channel badge. |
| `live-tv/assets/logos/star-sports-1.png` | **1.62 MB** | Heavy unoptimized channel badge. |
| `live-tv/assets/logos/wildlife.png` | **1.55 MB** | Heavy unoptimized channel badge. |
| `live-tv/assets/logos/fifa-wc-2026.svg` | **1.49 MB** | Oversized SVG containing embedded raw bitmap data. |
| `assets/images/monir-portrait.png` | **1.18 MB** | High-resolution portrait PNG; blocks loading of About section. |
| `assets/images/monir-creative-director.png` | **940 KB** | High-resolution banner PNG. |
| `resources/index.html` (Inline JSON) | **863 KB** | Enormous inline HTML payload that delays First Contentful Paint (FCP). |

### DOM & Rendering Performance:
- `tools/index.html` contains over 10,950 lines of HTML and over 105 nested modal forms loaded into the DOM simultaneously. This creates thousands of unused DOM nodes and high memory consumption on initial page load.
- `theme-selector/index.html` initializes 21 `<iframe>` elements. Even with lazy loading, scrolling through the gallery renders multiple heavy external pages concurrently, triggering memory pressure.

---

## 13. Responsive Audit

### Breakpoint Verification:
- Breakpoints defined in `assets/css/responsive.css` and `main.css`:
  - `> 1440px`: Large desktop view (1280px container max-width).
  - `1024px - 1280px`: Medium desktop; navigation links fit cleanly.
  - `768px - 1023px`: Tablet mode; desktop navigation is hidden (`.hidden-mobile`), mobile hamburger button displays (`.show-mobile`).
  - `< 768px`: Mobile mode; grid columns collapse from 4 columns to 2 columns.
  - `< 480px` & `320px - 390px`: Small mobile; quick access chips wrap properly.
- **Responsive Defects Identified:**
  1. In `services/voter-transfer/index.html`: The application is hardcoded to `--paper-width: 210mm` (A4 sheet). On screens under 768px, horizontal overflow occurs unless the user manually zooms out or uses browser print preview.
  2. In `tools/index.html`: Mega-menu dropdowns inside the navbar have `min-width: 640px`. If hovered or toggled on narrow tablet screens (640px - 768px), the menu clips past the right viewport boundary.
  3. `homepage-themes/theme-apex/index.html` and `theme-ignite/index.html` exhibit horizontal scrollbars on 320px screens due to unconstrained table wrappers.

---

## 14. UI/UX Audit

- **Strengths:**
  - Modern aesthetic with clean glassmorphism accents (`backdrop-filter: blur(20px)`), dark/light theme switching with smooth transitions, and high-contrast color accents.
  - Bilingual interface switching works intuitively without requiring page reloads.
- **Weaknesses:**
  - **Dead Links Confusion:** Clicking "Passport Services" or "NID Services" in the navigation dropdown opens a 404 page rather than navigating to the corresponding modal in `tools/index.html`.
  - **Inconsistent Theme Navigation:** Once a user activates a theme in `portal/index.html`, the navbar links inside that theme don't always allow seamless navigation back to the primary Digital Seba tools.
  - **About Page Blogger Vestiges:** `about/index.html` contains redundant headers, Blogger code fragments, and two back-to-top buttons overlapping at the bottom right.

---

## 15. Accessibility (A11Y) Audit

- **HTML Lang Attributes:**
  - `index.html`, `tools/index.html`, `services/index.html`, `resources/index.html`, `live-tv/index.html`: `lang="en"` or `lang="bn"` present.
  - `about/index.html`: Missing `lang` attribute on `<html>` tag.
- **Heading Structure:**
  - `index.html` has a clean hierarchy (1 `<h1>`, 9 `<h2>`, 29 `<h3>`).
  - `tools/index.html` has multiple competing `<h1>` tags (6 `<h1>`, 81 `<h2>`), confusing screen reader document outline navigation.
  - `focus-mode/index.html`: Has 0 headings (`<h1>`, `<h2>`, `<h3>` are all absent).
- **Form Controls & Labels:**
  - `tools/index.html`: **344 out of 349 input fields lack explicit `<label for="...">` associations or `aria-label` attributes.** They rely solely on visual placeholders, failing WCAG 2.1 Success Criterion 3.3.2.
- **Images:**
  - `tools/index.html`: 18 images lack `alt` text.
- **Keyboard Navigation:**
  - `focus-mode/app.html` actively blocks standard browser accessibility hotkeys (F12, Inspect).

---

## 16. SEO Audit

| SEO Element | Status | Evaluation |
| :--- | :--- | :--- |
| **Title Tags** | 🟢 Present | Descriptive titles on major pages with Bengali and English keywords. |
| **Meta Descriptions** | 🟢 Present | Comprehensive descriptions present on root and service pages. |
| **Canonical URLs** | 🟡 Warning | Canonical tags point to `https://digiseba.shop`, but the live development domain is `digitalseba.pages.dev`. If hosted on Cloudflare Pages without a 301 canonical redirect, search engines treat pages as duplicate content. |
| **Robots.txt** | 🟡 Incomplete | Root `robots.txt` specifies `Host: https://digiseba.shop` and `Sitemap: https://digiseba.shop/sitemap.xml`. It does not disallow temporary test scripts or build folders (`out/`, `portal/`). |
| **Sitemap.xml** | 🔴 Incomplete | `sitemap.xml` contains ONLY `https://digiseba.shop`. None of the major portal routes (`/services/`, `/tools/`, `/live-tv/`, `/resources/`, `/about/`) are listed. |
| **Open Graph Images** | 🔴 Broken | Root and service pages reference `https://digiseba.shop/assets/images/og-image.png` and `/android-icon-192x192.png`, but these image files do not exist in the repository! Social shares will render with broken image previews. |
| **Structured Data** | 🟢 Present | Valid Schema.org `Organization` and `WebSite` JSON-LD blocks present on `index.html`, `focus-mode/`, and `services/Voteshondhan/`. |

---

## 17. Asset Audit

- **Total Assets Count:** 674 files.
- **Duplicate Asset Groups (Identical SHA256):** 49 duplicate groups.
  - `bcd20925b15e83a4...` (9 identical copies): `apple-icon-180x180.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `assets/images/logo.png`, `tools/images/logo.png`, `tools/images/logo_1.png`, `tools/images/logo_2.png`, `tools/images/eq1AlwA.png`. All are 70,026-byte identical PNG files renamed as `.ico` or different icon sizes!
  - 40+ identical `.woff2` font files duplicated across `_next/`, `out/_next/`, and theme directories.
- **Unreferenced Assets in Root/Tools:**
  - `resources/digital-seba-resources-section.zip` (539.6 KB) - Unreferenced archive.
  - `homepage-themes.zip` (442.1 KB) - Unreferenced archive in root.
  - `tools/images/UEhIFiW.jpeg` (360.8 KB) - Unreferenced image.
  - `tools/images/dmca_protected_sml_120m.png` (15.6 KB) - Unreferenced image.

---

## 18. Dependency Audit

### Direct Client CDN Dependencies:
1. `hls.js@1.5.11` (Streaming)
2. `mpegts.js@1.7.3` (MPEG-TS Streaming)
3. `jspdf@2.5.1` (PDF Generation)
4. `html5-qrcode` (QR Code Scanning)
5. `@mediapipe/selfie_segmentation` (AI Background Removal)
6. `@tensorflow/tfjs` (Machine Learning in browser)
7. `Google Identity Services (GSI)` & `Google API Client (GAPI)`
8. `Firebase v8.10.1` (`firebase-app.js`, `firebase-firestore.js`, `firebase-analytics.js`, `firebase-database.js`)
9. FontAwesome 6.5.0 (Icons via cdnjs)

### Security / Maintenance Warnings for Dependencies:
- **Firebase v8 is Legacy:** The app uses Firebase v8 Compat/Namespace SDK (`8.10.1`), which is in maintenance mode. Google encourages migration to Firebase v9/v10 Modular SDK to enable tree-shaking and reduce bundle size.
- **SRI (Subresource Integrity) Missing:** External scripts loaded from `unpkg.com` and `cdn.jsdelivr.net` lack `integrity="..."` hashes, creating a supply-chain vulnerability if a third-party CDN account is compromised.
- **Unused Workspace Dependencies:** Over 39,000 files in `homepage-themes/*/node_modules/` contain full development toolchains (PostCSS, Tailwind, ESBuild, Vite, React types) committed directly into source control.

---

## 19. JavaScript / Logic Audit

### Syntax & Fatal Execution Errors:
1. `assets/js/live-tv/bootstrap.js`: Lines 43, 46 contain raw JSX tags assigned to `.innerHTML`. Crashes on load.
2. `assets/js/live-tv/stream-player.js`: Line 63 contains raw JSX tag. Crashes on load.
3. `assets/js/live-tv/ui-renderer.js`: Line 9 contains raw JSX tag. Crashes on load.
4. `assets/js/live-tv/channel-catalog.js`: Line 63 contains `console.log(Parsed channels from M3U.);` with missing quotes.
5. `assets/js/live-tv.js`: Line 96 contains `console.log(Parsed channels from M3U.);` with missing quotes.
6. `tools/js/dynamic-counter.js`: File consists of a CDN 404 text string, throwing an immediate runtime error when parsed.

### Memory Leaks & Event Listener Traps:
- In `theme-selector/index.html`: Multiple IntersectionObservers observe 21 iframes. Iframes load complex DOM trees that are not detached upon exiting the view, leading to browser tab memory bloat.
- In `assets/js/animations.js`: Multiple `window.addEventListener('scroll')` handlers run without `requestAnimationFrame` or throttling, causing high CPU usage and dropped frames during rapid page scrolling.

---

## 20. CSS Audit

- **High Specificity Wars & `!important` Flooding:**
  - `tools/css/tools03.css`: **207 `!important` declarations!**
  - `tools/css/pp2.css`: **48 `!important` declarations.**
  - `tools/css/examfaq.css`: **36 `!important` declarations.**
  - `live-tv/css/player.css`: **26 `!important` declarations.**
  - `live-tv/css/app.css`: **24 `!important` declarations.**
- **Extreme Z-Index Values:**
  - `tools/css/tools03.css` and `tools/css/ai-pp.css` use `z-index: 2147483647` (the maximum possible 32-bit signed integer).
  - Multiple components fight with `z-index: 999999`, `z-index: 99999`, and `z-index: 9999`.
- **CSS Duplication:**
  - `assets/css/main.css` (47 KB) and `assets/css/style.css` (4.8 KB) both define overlapping CSS reset rules, button classes, and container styles.

---

## 21. HTML / Markup Audit

- **Duplicate Element IDs:**
  - No critical duplicate IDs found in `index.html`.
  - In `tools/index.html`: Certain generic tool input IDs (e.g. `#name`, `#phone`, `#submitBtn`) repeat across different modal forms, causing `document.getElementById()` in later loaded scripts to grab the wrong form's input.
- **Corrupt / Non-Standard Tags:**
  - `about/index.html` has Blogger XML tags (`<b:skin>`, `<b:include>`, `expr:dir=...`) left over from an uncleaned Blogger template dump.
- **Missing Elements:**
  - OpenGraph image `og-image.png` missing from disk.
  - Favicon query reference `favicon.ico?favicon.0x3dzn~oxb6tn.ico` produces redundant 404 logs.

---

## 22. External Services Audit

| External Domain | Type / Service | Where Used | Dependency Risk | Failure Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `drive.google.com` | Cloud Storage / Files | `resources/index.html`, `assets/data/resources.json` | High | If user is offline or Google Drive link expires, file download fails. |
| `firestore.googleapis.com` / Firebase RTDB | Database / Analytics | `assets/js/firebase-init.js`, `live-tv/` | Medium | If blocked or quotas exceeded, live chat and telemetry fail gracefully. |
| `cdnjs.cloudflare.com` | CDN (FontAwesome, PDF.js, jsPDF) | `tools/index.html`, `services/Voteshondhan/` | Medium | If CDN fails, icons and PDF generator fail. |
| `cdn.jsdelivr.net` | CDN (HLS, MediaPipe, TFJS) | `tools/index.html`, `live-tv/index.html` | High | If blocked, live TV player and AI photo tools fail to load. |
| `unpkg.com` | CDN (html5-qrcode, PDF.js) | `tools/index.html` | Medium | Unpkg latency can slow down QR code scanner initialization. |
| `fonts.googleapis.com` / `fonts.gstatic.com` | Web Fonts (Inter, Noto Sans Bengali) | Global across all HTML pages | Low | Falls back to system sans-serif font. |
| `www.googletagmanager.com` | Analytics | `tools/index.html` | Low | Blocked by ad-blockers; no user impact. |
| `iptv.trionine.com` | IPTV Stream Gateway | `live-tv/CNAME` | Medium | External proxy dependency for live TV. |

---

## 23. Console & Network Errors

When loaded in a standard browser or tested against a local server:
1. **HTTP 404 (Missing Asset):**
   - `GET /resources/../../assets/css/main.css` → 404 (Resources page relative path error).
   - `GET /resources/../../assets/js/main.js` → 404.
   - `GET /assets/images/og-image.png` → 404.
   - `GET /android-icon-192x192.png` → 404.
2. **JavaScript Uncaught SyntaxError:**
   - Loading `tools/js/dynamic-counter.js` → `Uncaught SyntaxError: Unexpected identifier 'the'`.
   - Loading `assets/js/live-tv/bootstrap.js` → `Uncaught SyntaxError: Unexpected token '<'`.
   - Loading `assets/js/live-tv.js` → `Uncaught SyntaxError: Unexpected identifier 'channels'`.
3. **Mixed Content Blocked (Console Warning/Error):**
   - In Live TV, attempting to play HTTP streams under HTTPS produces: `Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'. This request has been blocked; the content must be served over HTTPS.`

---

## 24. Broken Files

| File Path | Nature of Failure | Immediate Consequence |
| :--- | :--- | :--- |
| `tools/js/dynamic-counter.js` | Contains HTML 404 error text instead of JS code | Crashes with SyntaxError if imported; breaks barcode/counter feature. |
| `assets/js/live-tv/bootstrap.js` | Unquoted raw JSX markup on lines 43 & 46 | Immediate SyntaxError; script fails to evaluate. |
| `assets/js/live-tv/stream-player.js`| Unquoted raw JSX markup on line 63 | Immediate SyntaxError; script fails to evaluate. |
| `assets/js/live-tv/ui-renderer.js` | Unquoted raw JSX markup on line 9 | Immediate SyntaxError; script fails to evaluate. |
| `assets/js/live-tv/channel-catalog.js`| Missing quotes in `console.log(Parsed  channels from M3U.);` | Immediate SyntaxError; script fails to evaluate. |
| `assets/js/live-tv.js` | Missing quotes in `console.log(Parsed  channels from M3U.);` on line 96 | Immediate SyntaxError; script fails to evaluate. |

---

## 25. Unused / Dead Files

| File Path | Size | Classification | Recommendation |
| :--- | :--- | :--- | :--- |
| `formatted_index.html` | 181.3 KB | 🔵 Duplicate / Temporary | Redundant beautified copy of `index.html`. |
| `temp_test.js` | 53 B | 🟣 Temporary | Scratch script; should be removed from production repository. |
| `live_server_debug.js` | 1.69 KB | 🟣 Temporary | Local debugging server test script. |
| `live_server_debug2.js` | 983 B | 🟣 Temporary | Local debugging server test script. |
| `preview-themes.js` | 1.38 KB | 🟣 Temporary | Theme test script. |
| `link_audit.js` | 1.25 KB | 🟣 Temporary | Audit script. |
| `link_audit2.js` | 671 B | 🟣 Temporary | Audit script. |
| `search_secrets.py` | 1.06 KB | 🟣 Temporary | Secret search script. |
| `check_a11y.py` | 697 B | 🟣 Temporary | A11Y test script. |
| `audit.js` | 1.31 KB | 🟣 Temporary | Root audit script. |
| `homepage-themes.zip` | 442.2 KB | 🟣 Temporary / Archive | Leftover archive of themes directory. |
| `resources/digital-seba-resources-section.zip` | 539.7 KB | 🟣 Temporary / Archive | Leftover archive in resources folder. |
| `data/channels.json` | 210.9 KB | 🔵 Duplicate | Stale duplicate of `assets/data/channels.json`. |
| `tools/link-auditor/index.html` | 35.0 KB | 🔵 Duplicate | Duplicate of `link-auditor/index.html`. |
| `homepage-themes/*/node_modules/` | > 150 MB | ⚫ Generated / Build Cache | Committed `node_modules` inside theme folders bloats git history. |

---

## 26. Duplicate Code & Duplicate Files

1. **Favicon Duplication:**
   `apple-icon-180x180.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, and `assets/images/logo.png` (plus 4 copies in `tools/images/`) are **9 bit-for-bit identical files** sharing the exact SHA256 checksum `bcd20925b15e83a4...`. Renaming a 70 KB PNG as `favicon.ico` without generating an authentic multi-resolution ICO file wastes bandwidth and violates icon specifications.
2. **Channel Data Duplication:**
   `assets/data/channels.json` and `data/channels.json` are both 210 KB but have different SHA256 hashes (`8514C837...` vs `E308FA72...`), creating version divergence where changes in one are not reflected in the other.
3. **Live TV Scripts Duplication:**
   `live-tv/js/` contains the working IPTV logic, while `assets/js/live-tv/` contains an abandoned, syntax-broken duplicate modular copy.

---

## 27. Dead Code

- **Unreachable / Zombie Configurations:**
  - `resources/package.json` and `resources/drizzle.config.json`: Define a PostgreSQL backend with Drizzle ORM that is never executed by the static Cloudflare Pages site.
  - `about/index.html`: Contains abandoned Blogger XML schema headers (`xmlns:b`, `xmlns:data`, `<b:skin>`).
  - `assets/css/style.css`: Contains 4.8 KB of legacy CSS that is superseded by `assets/css/main.css`.

---

## 28. Critical Problems (Top Blockers)

1. **Broken Core Navigation Links:** Visitors clicking on any service category under "Tools" in the top navbar hit a 404 error page.
2. **Broken Styling on Resources Page:** `resources/index.html` fails to load all core stylesheets and fonts due to invalid `../../assets/` relative pathing.
3. **Syntax Errors in Live TV Modular Scripts:** Unquoted SVG and console log strings throw fatal runtime errors.
4. **Corrupted Vendor Script (`dynamic-counter.js`):** Text error message saved as a JavaScript file breaks execution.
5. **Mixed Content Streaming Failure:** More than 30% of Live TV channel streams use unencrypted HTTP URLs that modern desktop and mobile browsers reject.
6. **Hardcoded Secrets & Sensitive Data Exposure:** Unrestricted Google API keys and Firebase credentials present in client-side code without documented cloud restrictions.
7. **Severe Asset Bloat:** Over 25 MB of uncompressed scripts (`opencv.js`), high-resolution PNG portraits, and oversized channel logos cripple mobile performance on Bangladeshi mobile networks.

---

## 29. Recommended Improvements

1. **Repair Navigation & Routing:**
   - Update navbar links in `index.html`, `tools/index.html`, `services/index.html`, and `live-tv/index.html` to target modal anchors inside `tools/index.html` (e.g. `/tools/index.html#passport`) rather than non-existent sub-directories.
   - Create missing `/pages/privacy.html` and `/pages/terms.html` legal pages.
2. **Fix Resources Page Asset Paths:**
   - Replace `../../assets/` with `../assets/` throughout `resources/index.html`.
   - Externalize the 863 KB `window.allFiles` inline array into a standalone `assets/data/resources-files.json` loaded via asynchronous fetch.
3. **Repair Corrupted JavaScript Files:**
   - Fix unquoted JSX and string literals in `assets/js/live-tv/*` or delete the folder if it is dead code superseded by `live-tv/js/`.
   - Replace `tools/js/dynamic-counter.js` with the legitimate library file or remove references to it.
4. **Optimize Heavy Assets & Media:**
   - Lazy-load `tools/js/opencv.js` dynamically only when the user opens an image manipulation tool that requires computer vision.
   - Convert `monir-portrait.png` and `monir-creative-director.png` to WebP or AVIF (reducing size from 2.1 MB to ~150 KB).
   - Compress the 540+ channel logos in `live-tv/assets/logos/` (e.g., resizing `delicious.png` from 4.58 MB to under 30 KB).
   - Generate true multi-resolution `.ico` and separate 16x16 / 32x32 favicon files.
5. **Implement Stored XSS Defenses:**
   - Integrate DOMPurify or sanitize all dynamic inputs before assigning them to `.innerHTML` in `resources-render.js` and `wpformatter.js`.
6. **Remove Anti-Accessibility Overrides:**
   - Remove the `contextmenu` and `keydown` interceptor script from `focus-mode/app.html` to restore user control and accessibility.
7. **Clean Repository Clutter:**
   - Delete temporary root scripts (`audit.js`, `link_audit*.js`, `live_server_debug*.js`, `search_secrets.py`, `check_a11y.py`).
   - Remove `homepage-themes.zip` and `digital-seba-resources-section.zip`.
   - Remove committed `node_modules` folders inside `homepage-themes/` and ensure `.gitignore` prevents future commits.

---

## 30. Priority Fix Plan

```mermaid
flowchart TD
    subgraph P1[Priority 1: Immediate Critical Fixes]
        F1[Fix navigation links to prevent 404 errors]
        F2[Fix ../../ relative path bug in resources/index.html]
        F3[Remove or fix syntax errors in assets/js/live-tv/ and dynamic-counter.js]
    end

    subgraph P2[Priority 2: Security & Hygiene]
        F4[Restrict Google API keys and Firebase in Cloud Console]
        F5[Sanitize innerHTML calls with DOMPurify]
        F6[Remove dev scripts and zip archives from repository]
    end

    subgraph P3[Priority 3: Performance & Mobile Optimization]
        F7[Dynamically load opencv.js 10MB only on demand]
        F8[Compress images & live-tv logos into WebP]
        F9[Externalize 863KB inline JSON from resources/index.html]
    end

    subgraph P4[Priority 4: SEO, A11Y & Maintenance]
        F10[Add missing form labels and alt text in tools/index.html]
        F11[Update sitemap.xml with all core portal routes]
        F12[Create legitimate og-image.png and favicon assets]
    end

    P1 --> P2 --> P3 --> P4
```

---

## 31. Final Health Score

```text
============================================================
              DIGITAL SEBA PROJECT HEALTH SCORE
============================================================
Architecture & Routing:      50 / 100  (404 sub-routes & theme iframes)
Code Quality & Syntax:       55 / 100  (Fatal syntax errors in JS files)
Security & Secrets:          60 / 100  (Exposed keys, unescaped innerHTML)
Performance & Optimization:  45 / 100  (10MB OpenCV, oversized logos)
Accessibility (A11Y):        60 / 100  (344 unlabeled inputs in tools)
SEO & Metadata:              65 / 100  (Single-URL sitemap, broken OG images)
Asset Management:            52 / 100  (49 duplicate groups, zip archives)
Stability & QA:              75 / 100  (Main pages serve 200 OK locally)
------------------------------------------------------------
OVERALL HEALTH SCORE:        58 / 100  (GRADE: C-)
============================================================
```

---

## 32. Issue Table

| ID | Severity | Category | File | Line | Problem | Evidence | Recommended Fix |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01** | 🔴 CRITICAL | Routing / Navigation | `index.html` | 10 | Navbar links to non-existent tool routes return 404 | `href="/tools/passport/index.html"` | Change hrefs to point to `tools/index.html#passport` or appropriate modal trigger |
| **ISSUE-02** | 🔴 CRITICAL | Routing / Legal | `index.html` | 224 | Legal footer links to missing `/pages/` directory | `href="/pages/privacy.html"` | Create `pages/privacy.html` and `pages/terms.html` or link to on-page modals |
| **ISSUE-03** | 🔴 CRITICAL | Assets / Styling | `resources/index.html` | 11-20 | Broken double relative path `../../assets/` fails to load styles | `<link rel="stylesheet" href="../../assets/css/main.css">` | Change `../../assets/` to `../assets/` |
| **ISSUE-04** | 🔴 CRITICAL | Code Quality / Syntax | `assets/js/live-tv/bootstrap.js` | 43, 46 | Raw JSX `<svg>` tags inside `.js` file cause fatal parse error | `muteBtn.innerHTML = <svg width="20"...` | Wrap SVG string in quotes/backticks or remove deprecated script |
| **ISSUE-05** | 🔴 CRITICAL | Code Quality / Syntax | `assets/js/live-tv/stream-player.js` | 63 | Raw JSX `<svg>` tag causes fatal parse error | `btn.innerHTML = isPlaying ? <svg ...` | Wrap SVG in backticks |
| **ISSUE-06** | 🔴 CRITICAL | Code Quality / Syntax | `assets/js/live-tv/ui-renderer.js` | 9 | Raw JSX `<svg>` tag causes fatal parse error | `const svg = <svg xmlns=...;` | Wrap SVG in backticks |
| **ISSUE-07** | 🔴 CRITICAL | Code Quality / Syntax | `assets/js/live-tv/channel-catalog.js` | 63 | Unquoted string literal in console.log | `console.log(Parsed  channels from M3U.);` | Add quotes around logged string |
| **ISSUE-08** | 🔴 CRITICAL | Code Quality / Syntax | `assets/js/live-tv.js` | 96 | Unquoted string literal in console.log | `console.log(Parsed  channels from M3U.);` | Add quotes around logged string |
| **ISSUE-09** | 🔴 CRITICAL | Broken Vendor Script | `tools/js/dynamic-counter.js` | 1 | CDN 404 text string saved as JavaScript file | `"Couldn't find the requested file..."` | Download valid library or remove script tag |
| **ISSUE-10** | 🟠 HIGH | Security / Secrets | `assets/js/firebase-init.js` | 7, 11 | Hardcoded Firebase API Key and GCP Project ID | `apiKey: "AIza...TNY"`, `projectId: "totemic-sector-373910"` | Restrict key in Google Cloud Console by HTTP referrers |
| **ISSUE-11** | 🟠 HIGH | Security / Secrets | `tools/js/tele.js` | 25, 26 | Hardcoded Google OAuth2 Client ID and API Key | `CLIENT_ID = "742363..."`, `API_KEY = "AIza...2BDY"` | Apply Google Cloud HTTP referrer restrictions |
| **ISSUE-12** | 🟠 HIGH | Security / XSS | `assets/js/resources-render.js` | 93, 110 | Direct interpolation of unescaped folder/item titles into `.innerHTML` | `header.innerHTML = \`<span>📁</span> ${item.folder}\`` | Sanitize with DOMPurify or use `.textContent` |
| **ISSUE-13** | 🟠 HIGH | Security / XSS | `tools/js/wpformatter.js` | 415-427 | Unsanitized template string injection into innerHTML | `html += \`<input placeholder="${marksPlace}"...\`` | Sanitize input attributes before rendering |
| **ISSUE-14** | 🟠 HIGH | Performance / Bundle | `tools/js/opencv.js` | 1 | Massive 9.99 MB script loaded synchronously in tools page | File size: 9,991,264 bytes | Lazy load dynamically only when photo editing modal opens |
| **ISSUE-15** | 🟠 HIGH | Performance / Payload | `resources/index.html` | 455 | 863 KB JSON string embedded directly in HTML | `window.allFiles = [{"id":"drive-1"...` (863,268 chars) | Move data to `assets/data/resources.json` and load via fetch |
| **ISSUE-16** | 🟠 HIGH | Performance / Images | `live-tv/assets/logos/delicious.png` | N/A | Massive 4.58 MB PNG image used as channel logo | File size: 4,579.4 KB | Resize and re-encode to WebP under 30 KB |
| **ISSUE-17** | 🟠 HIGH | Performance / Images | `live-tv/assets/logos/goldmines-bollywood.png` | N/A | 2.07 MB uncompressed logo image | File size: 2,070.4 KB | Convert to WebP under 30 KB |
| **ISSUE-18** | 🟠 HIGH | Performance / Images | `assets/images/monir-portrait.png` | N/A | 1.18 MB uncompressed portrait image | File size: 1,183,384 bytes | Compress into responsive WebP/AVIF format |
| **ISSUE-19** | 🟠 HIGH | Streaming / Security | `assets/data/channels.json` | Global | Mixed content: HTTP stream URLs blocked on HTTPS sites | `http://ua.online24.pm/...`, `http://202.70...` | Upgrade streams to HTTPS or terminate via proxy worker |
| **ISSUE-20** | 🟡 MEDIUM | Accessibility / A11Y | `tools/index.html` | 100+ | 344 input fields lack associated `<label>` or `aria-label` | `<input placeholder="..." />` without label | Add explicit `<label for="...">` or `aria-label` to each input |
| **ISSUE-21** | 🟡 MEDIUM | Accessibility / A11Y | `tools/index.html` | Multiple | 18 images lack `alt` attribute | `<img src="...">` | Provide descriptive `alt` text for all images |
| **ISSUE-22** | 🟡 MEDIUM | Accessibility / Hotkeys | `focus-mode/app.html` | 2-7 | Script blocks context menu, F12, Ctrl+U, and devtools | `e.keyCode === 123 || ... e.preventDefault()` | Remove hotkey hijacking to respect accessibility |
| **ISSUE-23** | 🟡 MEDIUM | SEO / Metadata | `sitemap.xml` | 4 | Sitemap lists only root domain; completely omits core sections | Only `<loc>https://digiseba.shop</loc>` present | Add `/services/`, `/tools/`, `/live-tv/`, `/resources/`, `/about/` |
| **ISSUE-24** | 🟡 MEDIUM | SEO / Metadata | `index.html` | 1 | OpenGraph image file `assets/images/og-image.png` does not exist | `og:image` returns 404 | Create high-quality 1200x630 `og-image.png` in `assets/images/` |
| **ISSUE-25** | 🟡 MEDIUM | CSS Architecture | `tools/css/tools03.css` | Multiple | Excessive use of `!important` (207 rules) and max z-index | `z-index: 2147483647 !important;` | Refactor CSS cascade and establish sensible z-index layers |
| **ISSUE-26** | 🟡 MEDIUM | Repository Bloat | `homepage-themes/` | N/A | Committed `node_modules/` folders contain > 39,000 files | Over 39,000 files in themes | Add `homepage-themes/*/node_modules/` to `.gitignore` and delete |
| **ISSUE-27** | 🔵 LOW | Repository Hygiene | Root Directory | N/A | Unused archive files committed to repository | `homepage-themes.zip` (442KB), `resources/*.zip` (540KB) | Remove zip archives from version control |
| **ISSUE-28** | 🔵 LOW | Repository Hygiene | Root Directory | N/A | Debugging / test scripts left in root | `audit.js`, `link_audit*.js`, `live_server_debug*.js` | Move to internal development directory or delete |
| **ISSUE-29** | 🔵 LOW | Asset Optimization | Root Directory | N/A | 9 identical copies of logo disguised as different icon files | Checksum `bcd20925b15e83a4...` across 9 files | Generate proper multi-resolution `.ico` and distinct PNG icons |
| **ISSUE-30** | 🟢 INFO | Internationalization | `services/` | N/A | Bengali script directory name causes potential 404 on ASCII servers | `services/ছাত্র রেজিস্ট্রেশন ও প্রত্যয়নপত্র.../` | Use URL-friendly slug (`services/student-registration/`) with 301 |

---

## 33. Final Summary

- **TOTAL FILES IN REPOSITORY:** 40,738
- **TOTAL CORE PROJECT FILES:** ~963 (excluding `homepage-themes/*/node_modules/`)
- **TOTAL FOLDERS:** 15 top-level / 120+ recursive
- **TOTAL DISTINCT FEATURES:** 10 core features (Portal, Tools Suite, Live TV, VoteSondhan, Voter Transfer, Student Registration, Drive Directory, AshFocus Pomodoro, Link Auditor, Theme Switcher)
- **TOTAL ROUTES / PAGES:** 9 major top-level entry routes; 21 themes; 4 standalone web apps
- **TOTAL JAVASCRIPT FILES:** 72 core scripts (excluding `node_modules` and Next.js static build chunks)
- **TOTAL CSS FILES:** 58 stylesheets (35 in `tools/css/`, 12 in `assets/css/`, 8 in `live-tv/css/`, 3 in `services/`)
- **TOTAL ASSETS:** 674 images, fonts, icons, media files (including 540+ Live TV channel badges)
- **TOTAL DEPENDENCIES:** 9 core client CDN libraries + Firebase v8 compat suite
- **TOTAL EXTERNAL SERVICES:** 8 external services (Firebase Firestore, Firebase RTDB, Google Drive REST API, Google Identity Services, Google Tag Manager, jsDelivr, Cloudflare CDN, unpkg)
- **TOTAL ERRORS / SYNTAX FAILURES:** 6 fatal syntax/corrupted script errors
- **TOTAL BROKEN LINKS (404):** 8 primary navigation targets + 4 legal links + 1 favicon query link
- **TOTAL SECURITY ISSUES:** 5 (Hardcoded Google API keys, hardcoded OAuth client IDs, missing DOMPurify XSS guards, hotkey interception)
- **TOTAL PERFORMANCE BOTTLENECKS:** 7 major bottlenecks (10MB OpenCV, 863KB inline JSON, 5 oversized image files > 1MB)
- **TOTAL UNUSED / TEMPORARY FILES:** 14 temporary root files & archives
- **TOTAL DUPLICATE FILE GROUPS:** 49 groups (including 9 identical copies of 70KB logo)

---

### TOP 10 MOST IMPORTANT ISSUES

1. **Fix Broken Top-Level Navigation Dropdowns:** Update all navbar dropdown links (`/tools/passport/`, `/tools/nid/`, etc.) to point to valid modal triggers in `tools/index.html` to eliminate 404 errors for visitors.
2. **Fix Invalid Relative Paths in `resources/index.html`:** Correct `../../assets/` to `../assets/` to restore missing styles, fonts, and scripts on the resources directory page.
3. **Remove / Fix Syntax-Corrupted Scripts in `assets/js/live-tv/` and `live-tv.js`:** Repair or remove broken JSX `<svg>` declarations and unquoted `console.log` statements that trigger fatal `SyntaxError` crashes.
4. **Replace Corrupted `tools/js/dynamic-counter.js`:** Overwrite the 404 text string with the authentic library code or decouple it to prevent runtime errors.
5. **Mitigate Mixed Content Streaming in Live TV:** Identify and proxy or upgrade `http://` stream endpoints to HTTPS so that modern browsers do not block stream playback.
6. **Secure Google & Firebase API Credentials:** Add domain/HTTP-referrer restrictions in Google Cloud Console and Firebase Console for all client-side keys.
7. **Optimize `tools/js/opencv.js` Loading:** Defer and dynamically inject the 9.99 MB OpenCV engine only when a user activates a tool requiring computer vision (e.g. document scanning or passport photo editing).
8. **Sanitize DOM Insertions (`.innerHTML`):** Replace raw string interpolation in `resources-render.js` and `wpformatter.js` with DOMPurify sanitization to block stored XSS attacks.
9. **Externalize 863 KB Inline JSON from `resources/index.html`:** Move the giant `window.allFiles` array into a cached static JSON file (`resources-files.json`) fetched asynchronously.
10. **Clean Repository Bloat & Committed Node Modules:** Delete committed `node_modules` folders from `homepage-themes/` and remove temporary scratch scripts and zip archives to reduce repository size from over 200 MB to under 30 MB.

---
*Report compiled strictly in AUDIT-ONLY mode with zero source code alterations.*

