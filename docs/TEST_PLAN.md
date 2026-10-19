# Digital Seba — Test Plan & Quality Assurance Framework

**Project:** Digital Seba (`digitalseba.pages.dev`)
**Scope:** Static Routing, BaaS Integration, Cross-Browser Compatibility & Security
**Last Verified Baseline:** October 19, 2026 (`main` branch)
**Document Status:** ACTIVE & MAINTAINED

---

## 1. Test Strategy & Quality Standards

Because Digital Seba operates as a client-side static web application backed by Firebase BaaS, testing focuses on:
1. **Edge & Local Routing Integrity:** Verification of URL resolution, 301/302 redirects, physical compatibility stubs, and custom 404 error serving.
2. **Client-Side Code Reliability:** Syntax validation, error-free DOM execution, and console log hygiene.
3. **Security & Authorization Rules:** Validation of Firestore security rules, Storage upload limits, and client route guards.
4. **Responsive UI & Accessibility:** Fluid layout behavior across Mobile, Tablet, and Desktop viewports, with keyboard accessibility and high-contrast dark mode support.

---

## 2. Test Execution Matrix

| Test ID | Category | Automation | Preconditions | Test Steps | Expected Result | Required Evidence | Current Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **TEST-01** | Internal Navigation & Links | Automated | HTTP test harness or static scan | Execute repository route test suite | All internal links resolve to valid HTML files without 404 or `Cannot GET` | Automated test runner execution log | **UNVERIFIED** (Awaiting tracked test runner) |
| **TEST-02** | Subtool Physical Stubs | Static / HTTP | 8 stubs present on disk | Inspect `tools/ai/index.html` through `tools/land/index.html` on disk | Physical files exist with 0ms meta-refresh forwarding to `../index.html?search=...` | File existence verified on disk; HTTP execution pending harness | **PASS** (Static File Check) / **UNVERIFIED** (HTTP Run) |
| **TEST-03** | Deep-Link Auto-Filtering | Static / DOM | `tools/index.html` loaded | Inspect `DOMContentLoaded` listener in `tools/index.html` | Query parsed on `DOMContentLoaded`, `#toolSearchInput` filled, tools filtered | DOM code verification in `tools/index.html` | **PASS** (Code Verified) |
| **TEST-04** | Cloudflare Edge Redirects | Automated | `_redirects` file present | Test redirect simulation against Cloudflare Pages edge | `/services/` redirects to `/insights/`; `/auth/*` redirects to `/login/` | HTTP 301/302 redirect headers verified | **UNVERIFIED** (Deployment Pending) |
| **TEST-05** | Custom 404 Serving | Automated | `404.html` on disk | Request non-existent route on live edge | Returns HTTP 404 with custom branded `404.html` HTML body | HTTP status 404 and HTML containing branding | **UNVERIFIED** (Deployment Pending) |
| **TEST-06** | JavaScript Syntax Validation | Automated | Node.js available | Run `node -c` on all core controllers | Zero syntax errors, exit code 0 | Terminal output: exit code 0 | **PASS** |
| **TEST-07** | Login Anchor `#signup` | Static Check | `login/index.html` on disk | Search for `id="signup"` on auth card | Container element has `id="signup"` allowing hash navigation | Line 637 of `login/index.html` verified | **PASS** |
| **TEST-08** | Admin 403 Route Guard | Automated | Firebase Auth emulator or test harness | Run `test_user_admin_system.js` | Non-admin user gets 403 Access Denied; Admin unlocks dashboard | Automated test assertion log | **PASS** |
| **TEST-09** | Client Avatar Canvas Resize | Automated | Headless Chrome with CDP | Run canvas resize test script | Image cropped to 256×256 square WebP data URL under 50KB | Output payload size: ~935 bytes | **PASS** |
| **TEST-10** | Permanent UID 1-Click Copy | Manual | Modern browser with clipboard permissions | Click "Copy UID" button on profile | Copies `user.uid` to clipboard and shows "Copied!" for 2 seconds | Visual button text change & clipboard verification | **UNVERIFIED** (Interactive Session Required) |
| **TEST-11** | Bilingual Language Switch | Manual | Browser session | Click `বাং` pill in navigation header | Header, titles, and card descriptions switch immediately to Bengali | Visual verification of DOM text translation | **UNVERIFIED** (Interactive Session Required) |
| **TEST-12** | Theme Selection Persistence | Manual | Browser session | Switch theme in `theme-selector/` and reload page | Selected theme persisted in `localStorage` without theme flash | `localStorage.getItem('ds_theme')` check | **UNVERIFIED** (Interactive Session Required) |
| **TEST-13** | Live TV Stream Playback | Manual | Network connection to IPTV sources | Open `live-tv/index.html` and click channel | Hls.js attaches video element, buffer loads, stream plays | Video playback without fatal console crashes | **UNVERIFIED** (Interactive Session Required) |
| **TEST-14** | Mobile Viewport Navigation | Manual | Mobile device or DevTools at 375px | Tap hamburger menu button `#mobileMenuToggle` | Off-canvas drawer expands; links are tap-friendly (`min-height: 44px`) | Visual inspection in responsive design mode | **UNVERIFIED** (Interactive Session Required) |
| **TEST-15** | Production URL Smoke Tests | Automated | Cloudflare Pages live deployment | Run `curl -I https://digitalseba.pages.dev/` | Returns HTTP 200 with security headers (`_headers`) | Response headers inspection | **UNVERIFIED** (Deployment Pending) |

---

## 3. Automation Scripts & Reproduction Instructions

### 3.1 Routing & HTTP Test Status
> **Note on Route Testing:**
> An ad-hoc 26-endpoint simulation was executed during prior diagnostic phases using a temporary diagnostic script. However, because `.gitignore` excludes `scratch/` and no test harness is currently tracked in the repository root, automated HTTP route verification is classified as **UNVERIFIED** until a tracked test harness is formally added. Do not assume `node scratch/verify_routes.js` is a runnable command from a clean repository clone.


### 3.2 Core Controller Syntax Check
```powershell
node -c assets/js/search.js assets/js/auth.js assets/js/language.js assets/js/theme-guard.js
```
*Expected Output:* Zero output, Exit Code `0`.

### 3.3 Git Diff Whitespace & Staging Integrity Check
```powershell
git diff --check
git diff --cached --stat
```
*Expected Output:* Zero errors, Exit Code `0`, 0 staged files.
