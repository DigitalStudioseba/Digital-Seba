# Digital Seba — Engineering Roadmap & Prioritized Task Tracker

**Project:** Digital Seba (`digitalseba.pages.dev`)
**Scope:** Architecture Roadmap, Defect Remediation & Maintenance
**Last Verified Baseline:** October 19, 2026 (`main` branch)
**Document Status:** ACTIVE & MAINTAINED

---

## 1. Prioritization Hierarchy & Status Definitions

- **P0 (Critical Blocker):** Production blockers, critical security vulnerabilities, active data-loss, or site-wide downtime.
- **P1 (High Priority):** Broken user journeys, 404 links, missing core pages, or non-functional major features.
- **P2 (Medium Priority):** Performance bottlenecks, resilience improvements, accessibility deficiencies, or code refactoring.
- **P3 (Low Priority):** Minor cosmetic enhancements, diagnostic cleanup, or optional convenience features.

**Status Codes:**
`BACKLOG` &rarr; `READY` &rarr; `IN PROGRESS` &rarr; `BLOCKED` &rarr; `VERIFY` &rarr; `DONE`

---

## 2. Master Task Register

### Completed Tasks (Verified with Recorded Evidence)

#### `TASK-P0-01`: Fix Reported `Cannot GET /tools/ai/index.html` & Missing Subtool Endpoints
- **Status:** `DONE`
- **Goal:** Eliminate `Cannot GET /tools/ai/index.html` and 7 related subtool failures across VS Code Live Server and Cloudflare Pages.
- **Evidence/Reason:** User reported failure navigating to `/tools/ai/index.html`. Investigation proved subtool directories never physically existed on disk.
- **Allowed Scope:** Create 8 physical redirect stubs (`tools/ai`, `photo`, `pdf`, `utility`, `passport`, `nid`, `birth`, `land`), add 302 rules in `_redirects`, and enhance `tools/index.html` query parameter parser.
- **Dependencies:** None.
- **Acceptance Criteria:** Requesting any subtool path loads with HTTP 200 and automatically transitions to `tools/index.html?search=...`.
- **Verification Method:** Verified physical stub creation on disk (`tools/ai/` to `tools/land/`); query filtering verified via `DOMContentLoaded` code analysis in `tools/index.html`. Automated route testing was executed in a temporary diagnostic runner.

#### `TASK-P0-02`: Global Navigation & Mega Menu Link Normalization
- **Status:** `DONE`
- **Goal:** Repair 35 broken entries in `assets/js/search.js` and header dropdown links in `index.html`.
- **Evidence/Reason:** `search.js` targeted non-existent `pages/tools/*.html`; `index.html` contained broken `/auth/` destination in toast.
- **Allowed Scope:** Update `assets/js/search.js`, `index.html`, `login/index.html` (`id="signup"`), and secondary footers.
- **Dependencies:** `TASK-P0-01`.
- **Acceptance Criteria:** Mega menu tool items navigate directly to tool suite; `#signup` scrolls smoothly to auth card.
- **Verification Method:** `node -c assets/js/search.js` passed (exit code 0); `id="signup"` anchor verified on line 637 of `login/index.html`.

#### `TASK-P0-03`: Services to Insights Knowledge Hub Migration
- **Status:** `DONE`
- **Goal:** Migrate obsolete public `/services/` hub to `/insights/` and enforce bilingual labeling (Insights / জ্ঞানকথা).
- **Evidence/Reason:** User decision to repurpose services section into a dedicated knowledge base.
- **Allowed Scope:** Create `/insights/index.html`, convert `/services/index.html` into a 0ms/301 redirect stub, add Cloudflare 301 edge redirect rules.
- **Dependencies:** None.
- **Acceptance Criteria:** `/insights/` serves articles hub; `/services/index.html` redirects to `/insights/`; dynamic articles remain functional.
- **Verification Method:** Verified `insights/index.html` on disk, 301 redirect stub in `services/index.html`, and `_redirects` edge rules.

---

### Active & Pending Tasks

#### `TASK-P1-01`: Author Static Legal Policy Pages (`/pages/privacy.html` & `/pages/terms.html`)
- **Status:** `BLOCKED` (Awaiting Owner Decision)
- **Goal:** Author dedicated static Privacy Policy and Terms of Service pages to eliminate broken footer links currently returning custom 404.
- **Evidence/Reason:** Navigation footers across multiple pages contain links to `/pages/privacy.html` and `/pages/terms.html`. These files do not exist in Git history.
- **Allowed Scope:** Create `pages/privacy.html` and `pages/terms.html` using shared design system tokens and bilingual copy, subject to owner authorization.
- **Dependencies:** User authorization of legal copy and terms text.
- **Acceptance Criteria:** Navigating to `/pages/privacy.html` and `/pages/terms.html` returns HTTP 200 with complete policy text.
- **Verification Method:** Local HTTP server check verifying HTTP 200 and absence of 404 alert.

#### `TASK-P1-02`: Production Deployment & Cloudflare Cache Purge Gate
- **Status:** `READY` (Pending User Authorization)
- **Goal:** Deploy verified local remediations (Phases 1–6, link audit stubs, auth system, security headers) to Cloudflare Pages production.
- **Evidence/Reason:** Local working tree contains fully verified fixes, but live production at `digitalseba.pages.dev` still serves older unpatched bundles.
- **Allowed Scope:** Git staging of approved files, commit, push to `main` branch, Cloudflare Pages build trigger, and edge cache purge.
- **Dependencies:** Explicit user instruction authorizing git staging and deployment.
- **Acceptance Criteria:** Production URL `https://digitalseba.pages.dev/tools/ai/index.html` and `https://digitalseba.pages.dev/insights/` return HTTP 200.
- **Verification Method:** Live HTTP curl inspection against production domain verifying response headers and status codes.

#### `TASK-P2-01`: Subresource Integrity (SRI) Hash Implementation for External CDNs
- **Status:** `BACKLOG`
- **Goal:** Protect the platform against upstream CDN compromise by adding cryptographic SRI hashes to all external `<script>` and `<link>` tags.
- **Evidence/Reason:** 33 external CDN dependencies (Tailwind CDN, FontAwesome, Hls.js, Google Fonts) currently lack `integrity="..."` attributes.
- **Allowed Scope:** Calculate SHA-384 hashes for stable external libraries and add `integrity="..."` and `crossorigin="anonymous"` attributes.
- **Dependencies:** Audit of stable library versions.
- **Acceptance Criteria:** External resources load with valid integrity checks; zero console SRI errors.
- **Verification Method:** Headless browser console audit verifying successful script execution without `Failed to find a valid digest`.

#### `TASK-P2-02`: Offline PWA Caching Strategy for Subtools
- **Status:** `BACKLOG`
- **Goal:** Upgrade `sw.js` cache-first strategies to allow offline execution of client-side utilities (Photo Studio, QR generator, calculators).
- **Evidence/Reason:** Bangladeshi users with unstable mobile data benefit from offline access to essential tools.
- **Allowed Scope:** Update `sw.js` cache asset manifest to include `tools/index.html` and local utility scripts.
- **Dependencies:** None.
- **Acceptance Criteria:** Disconnecting network in browser DevTools allows `/tools/` and subtool utilities to operate smoothly.
- **Verification Method:** Chrome DevTools offline network simulation test.

#### `TASK-P3-01`: Archive Obsolete Diagnostic Scripts in `scratch/`
- **Status:** `BACKLOG`
- **Goal:** Clean up obsolete temporary diagnostic files in `scratch/` without losing valuable test harnesses.
- **Evidence/Reason:** `scratch/` contains over 60 one-off debug scripts and screenshots from prior phases.
- **Allowed Scope:** Organize permanent test harnesses (`verify_routes.js`, `test_user_admin_system.js`) and archive temporary single-run files.
- **Dependencies:** None.
- **Acceptance Criteria:** Root project structure remains clean; all documented tests run without missing dependencies.
- **Verification Method:** Run automated test suites after directory cleanup.
