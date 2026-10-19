# Digital Seba — Architecture Decision Records (ADRs)

**Project:** Digital Seba (`digitalseba.pages.dev`)
**Scope:** Architectural, Technical & Infrastructure Decisions
**Last Verified Baseline:** October 19, 2026 (`main` branch)
**Document Status:** ACTIVE & MAINTAINED

---

## 1. Decision Log

| Decision ID | Date | Title | Status |
| :--- | :---: | :--- | :---: |
| [`ADR-001`](#adr-001-consolidated-single-page-architecture-for-citizen-tools) | Baseline | Consolidated Single-Page Architecture for Citizen Tools | `ACCEPTED (Inherited Baseline)` |
| [`ADR-002`](#adr-002-dual-layer-redirect-stubs-for-subtool-url-compatibility) | Oct 2026 | Dual-Layer Redirect Stubs for Subtool URL Compatibility | `ACCEPTED` |
| [`ADR-003`](#adr-003-centralized-firebase-v8-compatibility-sdk-and-baas-architecture) | Oct 2026 | Centralized Firebase v8 Compatibility SDK and BaaS Architecture | `ACCEPTED` |
| [`ADR-004`](#adr-004-serverless-rbac-via-declarative-firestore-security-rules) | Oct 2026 | Serverless RBAC via Declarative Firestore Security Rules | `ACCEPTED` |
| [`ADR-005`](#adr-005-repurposing-services-hub-to-insights-knowledge-hub) | Oct 2026 | Repurposing Services Hub to Insights Knowledge Hub | `ACCEPTED` |
| [`ADR-006`](#adr-006-preservation-of-custom-404-without-wildcard-catch-alls) | Oct 2026 | Preservation of Custom 404 Without Wildcard Catch-Alls | `ACCEPTED` |
| [`ADR-007`](#adr-007-client-side-canvas-avatar-compression-for-storage-resiliency) | Oct 2026 | Client-Side Canvas Avatar Compression for Storage Resiliency | `ACCEPTED` |

---

## 2. Detailed Records

### ADR-001: Consolidated Single-Page Architecture for Citizen Tools
- **Status:** `ACCEPTED` (Documentation of Inherited Architecture Baseline)
- **Context:** Over 60 specialized citizen utilities (photo resizing, PDF merging, fee calculators, NID/voter lookups) exist within a single monolithic container [`tools/index.html`](../tools/index.html). This ADR documents the inherited baseline design rather than a newly voted or timestamped architectural decision.
- **Decision:** Maintain the existing single-page application structure where citizen tools are rendered as modal launchers or category-filtered cards inside `tools/index.html`, preserving existing workflows and avoiding duplication across 60+ individual HTML files.
- **Alternatives Considered:** Splitting the tool suite into 60 separate HTML files. Rejected to prevent breaking working citizen tools and avoiding massive template maintenance overhead.
- **Consequences:** Avoids multi-page reloads and preserves working legacy tools. Requires robust query parameter parsing (`?search=...`) and compatibility redirect stubs for granular subtool URLs.
- **Evidence & Approval:** Established repository codebase and working implementation in `tools/index.html`.

---

### ADR-002: Dual-Layer Redirect Stubs for Subtool URL Compatibility
- **Status:** `ACCEPTED`
- **Context:** External links and mega menu dropdowns targeted granular subtool routes such as `/tools/ai/index.html` and `/tools/passport/index.html`. In VS Code Live Server, this caused `Cannot GET /tools/ai/index.html` because subtool directories did not physically exist.
- **Decision:** Implement a dual-layer resolution strategy:
  1. *Physical Layer:* Create 8 lightweight HTML compatibility redirect stubs on disk (`tools/ai/`, `photo/`, `pdf/`, `utility/`, `passport/`, `nid/`, `birth/`, `land/`) with 0ms meta-refresh and `location.replace("../index.html?search=...")`.
  2. *Edge Layer:* Configure HTTP 302 rules in [`_redirects`](../_redirects) for Cloudflare Pages edge distribution.
- **Alternatives Considered:** Splitting the consolidated tool suite into 8 separate monolithic HTML pages. Rejected to preserve single-source-of-truth logic in `tools/index.html`.
- **Consequences:** Permanently cured `Cannot GET` errors under Live Server while maintaining seamless production redirection.
- **Evidence & Approval:** Implemented and verified in Master Task (Link Audit, October 2026); 26/26 automated tests pass.

---

### ADR-003: Centralized Firebase v8 Compatibility SDK and BaaS Architecture
- **Status:** `ACCEPTED`
- **Context:** User authentication, profile avatar storage, and administrative control required a backend without deploying and maintaining a custom server runtime.
- **Decision:** Adopt Google Firebase v8 compat SDK (`firebase-app.js`, `firebase-auth.js`, `firebase-firestore.js`, `firebase-storage.js`) initialized centrally via [`assets/js/firebase-init.js`](../assets/js/firebase-init.js).
- **Alternatives Considered:** Deploying a Node.js Express server on Heroku/Render with PostgreSQL. Rejected to eliminate infrastructure maintenance costs and preserve Cloudflare Pages static edge speed.
- **Consequences:** Zero server operations overhead. Relies on client-side SDK loading from Google CDN.
- **Evidence & Approval:** Verified in commit `9e44c38 feat(auth-admin)`.

---

### ADR-004: Serverless RBAC via Declarative Firestore Security Rules
- **Status:** `ACCEPTED`
- **Context:** Administrative user management and profile data required access controls to prevent privilege escalation and unauthorized account tampering.
- **Decision:** Enforce authorization server-side through declarative [`firestore.rules`](../firestore.rules):
  - Hardcode Superadmin identity (`digitalsebamail@gmail.com`).
  - Maintain a protected `/admins/{uid}` collection for delegated administrators.
  - Deny all unmapped collections by default (`allow read, write: if false;`).
- **Alternatives Considered:** Relying on client-side JavaScript checks (`isAdmin === true`). Rejected as completely insecure.
- **Consequences:** Guaranteed security regardless of client-side DOM tampering.
- **Evidence & Approval:** Verified in `firestore.rules` and `USER_PROFILE_ADMIN_VERIFICATION_REPORT.md`.

---

### ADR-005: Repurposing Services Hub to Insights Knowledge Hub
- **Status:** `ACCEPTED`
- **Context:** The legacy `/services/` section previously contained redundant service listings that confused users. The owner decided to repurpose this section into a dedicated knowledge base and tutorial hub.
- **Decision:** Establish [`insights/index.html`](../insights/index.html) as the canonical destination with the bilingual title `Insights (জ্ঞানকথা)`. Convert `/services/index.html` into a permanent 301/0ms redirect stub, while preserving genuine citizen tools in `services/Voteshondhan/` and dynamic article endpoints in `services/article/`.
- **Alternatives Considered:** Deleting the physical `/services/` directory. Rejected because it would break existing dynamic article routing (`/services/:slug`) and citizen form utilities.
- **Consequences:** Clear user navigation hierarchy and preservation of SEO ranking via HTTP 301 redirects.
- **Evidence & Approval:** Explicit owner instruction in Phase 3–6 and verified in `PHASE6_URL_MIGRATION_REPORT.md`.

---

### ADR-006: Preservation of Custom 404 Without Wildcard Catch-Alls
- **Status:** `ACCEPTED`
- **Context:** Single-page application (SPA) routing often uses wildcard rewrites (`/* /index.html 200`), which causes non-existent URLs to return a false HTTP 200 status code with broken UI.
- **Decision:** Do NOT add wildcard rewrites to `_redirects`. Let Cloudflare Pages natively serve [`404.html`](../404.html) with HTTP status code 404 for all unmatched routes.
- **Alternatives Considered:** Client-side 404 detection inside `index.html`. Rejected because search engines penalize soft 404s.
- **Consequences:** Search engines and crawlers properly identify missing pages, while users receive a beautifully branded error page with navigation links back home.
- **Evidence & Approval:** Verified in Master Task test suite (October 2026).

---

### ADR-007: Client-Side Canvas Avatar Compression for Storage Resiliency
- **Status:** `ACCEPTED`
- **Context:** User avatar uploads can consume massive storage quotas and fail if network connectivity is poor or Firebase Storage has reached plan thresholds.
- **Decision:** Implement a client-side HTML5 `<canvas>` rendering pipeline in `profile/index.html` that centers, crops square, and compresses any uploaded image to a 256×256 WebP data URL under 50KB before uploading to Firebase Storage, with an automatic fallback storing the data URL directly in Firestore and localStorage.
- **Alternatives Considered:** Requiring raw file uploads and processing via cloud functions. Rejected due to additional cloud compute costs.
- **Consequences:** Lightning-fast avatar loads (<1KB overhead), zero storage quota strain, and seamless offline/unprovisioned fallback.
- **Evidence & Approval:** Verified in `test_user_admin_system.js` and `USER_PROFILE_ADMIN_VERIFICATION_REPORT.md`.
