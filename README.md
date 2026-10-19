# Digital Seba (ডিজিটাল সেবা)

> **Your Digital World, Simplified.**
> A comprehensive, serverless digital public service platform and citizen utility ecosystem for Bangladesh.

[![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Pages-orange)](https://digitalseba.pages.dev)
[![Status](https://img.shields.io/badge/Status-Maintained-success)](https://digitalseba.pages.dev)
[![Architecture](https://img.shields.io/badge/Architecture-Static%20%2B%20Firebase%20BaaS-blue)](docs/ARCHITECTURE.md)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey)](#)

---

## 1. Product Overview

**Digital Seba** aggregates essential Bangladeshi government service links, automated citizen document tools, client-side photo/PDF processing utilities, curated educational Google Drive resources, a live IPTV streaming portal, and a technology knowledge hub into a unified, responsive web application.

The site is deployed globally across the **Cloudflare Pages** edge network as a pure client-side static web application, backed by Google Firebase APIs (Authentication, Cloud Firestore, and Firebase Storage).

---

## 2. Key Modules & Verified Capabilities

- 🏛️ **Citizen & Digital Tools Suite ([`tools/index.html`](tools/index.html)):** Over 60 in-browser utilities including passport photo cropping, PDF merging/splitting, NID correction guidance, birth & death certificate links, voter lookup (`services/Voteshondhan/`), and currency/age calculators. Includes deep-link query filtering (`?search=...`).
- 💡 **Insights Knowledge Hub ([`insights/index.html`](insights/index.html)):** Repurposed technology tutorials and educational guides with dynamic article reader (`services/article/`) and editor (`services/editor/`).
- 📺 **Live IPTV Portal ([`live-tv/index.html`](live-tv/index.html)):** Over 90 categorized live streaming channels (Sports, News, Entertainment, Islamic, Kids) powered by `hls.js`.
- 📁 **Curated Drive Resources ([`resources/index.html`](resources/index.html)):** Instant-search catalog of educational software, government templates, and Windows ISO files.
- ⏱️ **Focus Mode Workspace ([`focus-mode/index.html`](focus-mode/index.html)):** Gamified Pomodoro timer, ambient soundscapes, and local task tracker.
- 🔐 **User Profile & Admin Management ([`login/`](login/), [`profile/`](profile/), [`admin/`](admin/)):** Google OAuth sign-in, HTML5 canvas avatar compression (256×256 WebP under 50KB), monospace permanent UID, and a dedicated Admin Dashboard with role and status management protected by server-side Firestore security rules.
- 🎨 **Dynamic Theme Engine ([`theme-selector/`](theme-selector/), [`homepage-themes/`](homepage-themes/)):** 20 alternate homepage theme directories (21 total variants including root Alpha) with `localStorage` persistence and flash-preventing theme guards. (Note: Runtime selectability and stability vary across variants; individual verification is recommended).

---

## 3. Directory Layout

```text
digitalseba.pages.dev/
├── index.html                   # Main landing page (Alpha theme)
├── 404.html                     # Global branded 404 error page
├── _redirects                   # Cloudflare Pages edge routing and redirect rules
├── _headers                     # Cloudflare Pages HTTP security headers & CSP
├── CNAME                        # Custom apex domain pointer (seba.pro.bd)
├── firestore.rules              # Production Cloud Firestore declarative security rules
├── storage.rules                # Production Firebase Storage access rules
│
├── assets/                      # Global styles, controllers, images, and data
│   ├── css/                     # main.css, components.css, responsive.css
│   ├── js/                      # auth.js, language.js, theme.js, search.js, firebase-init.js
│   └── images/                  # Brand logos and covers
│
├── tools/                       # Consolidated tool suite (index.html) & 8 redirect stubs
├── insights/                    # Knowledge base and articles hub
├── services/                    # Dynamic article routing, editor, and citizen tools
├── login/                       # Sign in / registration with Google OAuth
├── profile/                     # Profile management, avatar upload & permanent UID
├── admin/                       # Admin dashboard and user directory management
├── live-tv/                     # IPTV streaming application
├── resources/                   # Google Drive resources directory
├── focus-mode/                  # Pomodoro productivity application
├── about/                       # Organization and founder bio
├── theme-selector/              # Visual theme picker gallery
├── homepage-themes/             # 20 alternate theme directories (21 total variants including root Alpha)
└── docs/                        # Complete project documentation system
```

---

## 4. Prerequisites & Local Development

### Prerequisites
- Modern web browser (Chrome, Edge, Firefox, Safari).
- [Node.js](https://nodejs.org/) (v18+ recommended) for running test runners and verification scripts.
- Any lightweight static HTTP server (VS Code Live Server or `npx serve`).

### Running Locally
To launch the website locally:

```powershell
# Option A: Using npx serve
npx serve . -p 5500

# Option B: Using Python built-in server
python -m http.server 5500
```
Open your browser and navigate to:
```text
http://127.0.0.1:5500/
```

> **Note on VS Code Live Server:**
> The project includes physical redirect stubs inside `tools/` (`ai/`, `photo/`, `pdf/`, etc.). When running under Live Server, requesting `http://127.0.0.1:5500/tools/ai/index.html` loads cleanly and automatically forwards into `tools/index.html?search=AI` without `Cannot GET` errors.

---

## 5. Automated Verification & Testing
The repository includes lightweight commands to verify controller syntax, code formatting, and Git cleanliness:

```powershell
# 1. Validate JavaScript syntax on core controllers
node -c assets/js/search.js assets/js/auth.js assets/js/language.js assets/js/theme-guard.js

# 2. Check for whitespace and line-ending formatting issues
git diff --check

# 3. Confirm zero unintended staged changes
git diff --cached --stat
```

> **Note on Automated HTTP Route Testing:**
> Comprehensive 26-endpoint HTTP routing simulation was previously conducted during diagnostic phases via a temporary diagnostic script. Because `scratch/` is excluded by `.gitignore` and no test harness is formally tracked at root, automated route testing is classified as **UNVERIFIED** until a tracked test harness is formally checked into the repository.


---

## 6. Deployment Architecture

- **Hosting Platform:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **Git Branch:** Connected to the `main` branch on GitHub.
- **Build Output:** Static deployment (Root Directory: `/`). No custom build command is required.
- **Edge Routing & Security:**
  - `_redirects` handles 301 migrations, 302 subtool compatibility, and dynamic article rewrites.
  - `_headers` injects strict Content-Security-Policy (CSP), `X-Frame-Options: SAMEORIGIN`, and `nosniff`.
  - Non-existent routes automatically serve `404.html` with an HTTP 404 status code.

---

## 7. Project Documentation System

Complete, in-depth architectural and engineering records are maintained in [`docs/`](docs/):

- 📋 [**Product Requirements Document (PRD)**](docs/PRD.md) — Product scope, user personas, capabilities, and success criteria.
- 🏗️ [**System Architecture**](docs/ARCHITECTURE.md) — Complete stack breakdown, edge routing model, and Firestore schema.
- 🎨 [**Design System**](docs/DESIGN.md) — Brand tokens, typography, glassmorphism components, and responsive design.
- 📜 [**AI Development Rules**](docs/RULES.md) — Mandatory 15 rules, standard response structure, and verification statuses.
- 🎯 [**Roadmap & Tasks**](docs/TASKS.md) — Prioritized task tracker (P0–P3) with verified evidence.
- 🧪 [**Test Plan**](docs/TEST_PLAN.md) — Quality assurance matrix, automated test harnesses, and manual test steps.
- 🛡️ [**Security Architecture**](docs/SECURITY.md) — Threat model, RBAC rules, input sanitization, and CSP headers.
- 📑 [**Architecture Decisions (ADR)**](docs/DECISIONS.md) — Historical decision records (ADR-001 through ADR-007).
- 🧠 [**Engineering Memory**](docs/MEMORY.md) — Current state handoff, completed work, and test results.

---

## 8. Known Limitations & Troubleshooting

1. **Legal Policy Pages:** `/pages/privacy.html` and `/pages/terms.html` do not physically exist on disk and intentionally return custom `404.html` until dedicated legal copy is approved.
2. **Third-Party Government Portals:** External citizen service links (NID, Passport, Land) depend on external government servers and may occasionally experience third-party downtime.
3. **External CDN Dependencies:** External scripts (Tailwind CDN, FontAwesome, Hls.js) currently load from CDNs; adding Subresource Integrity (SRI) is tracked in [`TASK-P2-01`](docs/TASKS.md).
