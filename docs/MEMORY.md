# Digital Seba — Engineering Handoff & Memory Record

**Current Branch:** `main`
**HEAD Commit:** `9e44c3848b258b9e1a43e16448005e6781c3c102`
**Git Staging State:** 0 files staged (`git diff --cached` is strictly empty)
**Last Synchronized:** October 19, 2026 (Phase 7 - Documentation & Engineering Foundation)
**Document Purpose:** Active Engineering Context, Handoff & Current Reality

---

## 1. Current Project State & Architecture Facts

- **Site Paradigm:** Pure client-side static web application deployed on Cloudflare Pages.
- **Domain Mapping:** `digitalseba.pages.dev` (Cloudflare Pages default), `digiseba.shop` (Custom domain), `seba.pro.bd` (CNAME).
- **Backend Infrastructure:** Google Firebase v8 compat SDK (`firebase-init.js`), Cloud Firestore (`digital-seba-92ae6`), Firebase Storage (`digital-seba-92ae6.firebasestorage.app`).
- **Core Application Files:**
  - Consolidated tools: [`tools/index.html`](../tools/index.html) with 8 physical redirect stubs in `tools/` (`ai`, `photo`, `pdf`, `utility`, `passport`, `nid`, `birth`, `land`).
  - Knowledge Hub: [`insights/index.html`](../insights/index.html) (migrated from `/services/` with 301 edge redirect).
  - Dynamic Article Routing: [`services/article/index.html`](../services/article/index.html) via rewrite in `_redirects`.
  - User Authentication & Admin: [`login/index.html`](../login/index.html), [`profile/index.html`](../profile/index.html), [`admin/index.html`](../admin/index.html) with server-side rules in [`firestore.rules`](../firestore.rules).
  - Edge Configuration: [`_redirects`](../_redirects) (routing) and [`_headers`](../_headers) (CSP and security headers).

---

## 2. Completed Work Supported by Evidence

1. **Master Link Audit & Subtool Compatibility (`FULL_PROJECT_LINK_AUDIT_REPORT.md`):**
   - Completely resolved `Cannot GET /tools/ai/index.html` across VS Code Live Server and Cloudflare Pages.
   - Created 8 physical compatibility redirect stubs on disk.
   - Enhanced `tools/index.html` `DOMContentLoaded` with deep-linking query parameter parsing (`?search=...`), tool filtering, and smooth scroll.
   - Fixed 35 broken entries in `assets/js/search.js` previously pointing to non-existent `pages/tools/*.html`.
   - Added `id="signup"` on line 637 of `login/index.html` resolving 45 `#signup` anchor warnings.
   - Repaired relative asset paths in `resources/index.html` and `focus-mode/index.html`.
   - Restored missing preview cover [`assets/images/cover.webp`](../assets/images/cover.webp) and mobile clip [`apple-touch-icon.png`](../apple-touch-icon.png).
2. **User Profile & Admin System (`USER_PROFILE_ADMIN_VERIFICATION_REPORT.md`):**
   - Integrated client-side canvas avatar downscaling/compression to 256×256 WebP data URL.
   - Display name validation and real-time universal header synchronization.
   - Monospace permanent UID card with 1-click clipboard copy feedback.
   - Dedicated Admin Dashboard with 403 route guard, metrics counters, user directory table, role/status moderation modal, and self-lockout prevention.
   - Declarative `firestore.rules` and `storage.rules` preventing privilege escalation.
3. **Services to Insights Hub Migration (`PHASE6_URL_MIGRATION_REPORT.md`):**
   - Migrated public navigation from `/services/` to `/insights/`.
   - Enforced approved bilingual branding: `Insights (জ্ঞানকথা)`.
   - Preserved genuine citizen tools in `services/Voteshondhan/` and `services/voter-transfer/`.
4. **Security Header & Vulnerability Remediation (`SECURITY_AUDIT_REPORT.md`):**
   - Created native Cloudflare Pages `_headers` with strict CSP, `X-Frame-Options: SAMEORIGIN`, and `nosniff`.
   - XSS sanitization in `resources-render.js`, `live-chat.js`, `wpformatter.js`, and `onseba.js`.

---

## 3. Work in Progress & Active Scope

- **Phase 7 (Current Task):** Project Documentation & Engineering Foundation.
  - Creating approved documentation suite in `docs/` (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, `TEST_PLAN.md`, `SECURITY.md`, `DECISIONS.md`, `MEMORY.md`), `README.md`, and safe `.env.example`.
  - Zero application code changes, zero git staging or commits.

---

## 4. Known Issues & Limitations

1. **Missing Legal Pages:** `/pages/privacy.html` and `/pages/terms.html` do not exist on disk and intentionally trigger the custom `404.html` page until dedicated copy is authorized (`TASK-P1-01`).
2. **External CDN Dependencies Without SRI:** 33 external CDN scripts lack `integrity="..."` attributes (`TASK-P2-01`).
3. **External Worker Proxy Dependency:** Live TV stream player connects through `https://iptv-proxy.trionine.workers.dev/?url=`.

---

## 5. Pending Owner Decisions

1. **Authorization of Legal Policy Copy:** Decide whether to author static pages for Privacy Policy and Terms of Service or continue serving custom 404.
2. **Production Deployment Authorization:** Review verified local changes (Phases 1–7) and authorize Git staging, commit, and Cloudflare Pages deployment.

---

## 6. Last Test Execution Results

- **Automated Routing & HTTP Testing Status:**
  - Result: **UNVERIFIED in clean repository workspace** (Ad-hoc 26-endpoint simulation was executed during prior diagnostic phases using a temporary runner; permanent automated suite awaits a tracked test harness in the repository).
  - Verified on Disk: `/`, `/insights/`, `/services/index.html` (301 redirect stub), all 8 `/tools/*` subtool physical stubs, `/about/`, `/login/`, `/resources/`, `/live-tv/`, citizen tools, Bengali Unicode directory, and custom `404.html`.
- **JavaScript Syntax Check (`node -c`):**
  - Result: **PASS** (Zero syntax errors across all modified controllers).
- **Git Diff Whitespace Check (`git diff --check`):**
  - Result: **PASS** (Zero trailing whitespace or EOF newline errors).
- **Git Staging Gate (`git diff --cached`):**
  - Result: **PASS** (0 staged files).
