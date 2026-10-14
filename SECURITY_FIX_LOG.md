# Digital Seba — Security Fix Log

This log records every modified file, exact vulnerability addressed, summary of changes, tests executed, and rollback considerations.

---

## 1. `live-tv/js/live-chat.js`
- **Vulnerability Addressed:** Category 2 (Stored XSS) & Category 5 / 14 (IDOR / Destructive Client Database Action).
- **Summary of Change:**
  1. Replaced defective `escapeHTML` implementation which replaced `<` with `<` with standard HTML entity mapping (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).
  2. Applied `escapeHTML` to `${user}`, initial letter `${user[0]}`, and message text `${text}`.
  3. Validated avatar background colors against strict hex format (`/^#[0-9a-fA-F]{3,6}$/`).
  4. Removed destructive client-side message purge command `currentChatRef.child("messages").remove()` on channel switch.
  5. Removed client-side `enforceMessageLimit()` database truncate call (`updates['messages/' + k] = null; currentChatRef.update(updates)`) to guarantee no client code issues database deletion commands. DOM truncation in the browser UI (`$msgContainer.children.length > 100`) is preserved.
- **Tests Run:**
  - Node syntax check: `node -c "live-tv/js/live-chat.js"` -> PASS (exit code 0).
  - Regression suite: Verified zero Firebase messages deletion calls and 100% entity escaping.
- **Rollback Consideration:** Revert to Git baseline if chat display formatting encounters issues.

---

## 2. `assets/js/resources-render.js`
- **Vulnerability Addressed:** Category 2 (DOM XSS in Drive Resources Directory).
- **Summary of Change:**
  1. Implemented `escapeHTML()` within the module.
  2. Sanitized text input in `highlightTextDrive()` prior to regex highlighting so matched substrings cannot inject HTML.
  3. Fixed unescaped title rendering when search query `q` is empty: ensured `highlightedTitle` uses `escapeHTML(title)` during standard browsing views.
  4. Sanitized `item.folder` before setting `header.innerHTML`.
  5. Enforced safe URL protocols (`http:`, `https:`, `/`) on `card.href`, disallowing `javascript:`, `data:`, and `vbscript:`.
- **Tests Run:**
  - Node syntax check: `node -c "assets/js/resources-render.js"` -> PASS (exit code 0).
  - Regression suite: Verified script neutralization and empty query escape behavior.
- **Rollback Consideration:** Safe drop-in replacement; visual styles and search filtering logic preserved.

---

## 3. `tools/js/wpformatter.js`
- **Vulnerability Addressed:** Category 2 (DOM XSS in Question Paper Tool) & Category 4 (File Upload XSS).
- **Summary of Change:**
  1. Added `escFq()` HTML entity encoding helper.
  2. Sanitized institution name, exam title, class, subject, time, marks, and question texts in `drawFq()` before writing to `fq-render-area.innerHTML`.
  3. Validated `fqLogoSrc` against raster image Data URL regex (`/^data:image\/(jpeg|png|webp|gif);base64,/i`), rejecting SVG XSS vectors.
- **Tests Run:**
  - Node syntax check: `node -c "tools/js/wpformatter.js"` -> PASS (exit code 0).
  - Regression suite: Verified SVG rejection and raster acceptance.
- **Rollback Consideration:** Purely sanitizes output strings; no DOM node or template structure changed.

---

## 4. `tools/js/onseba.js`
- **Vulnerability Addressed:** Category 2 (DOM XSS in Biodata / CV Generator) & Category 4 (Insecure File Upload Rendering).
- **Summary of Change:**
  1. Added `escBio()` helper to entity-encode all form inputs.
  2. Sanitized father's name, mother's name, date of birth, religion, height, blood group, phone, email, education, and address before assignment to `pre-details.innerHTML` and `pre-sections.innerHTML`.
  3. Verified `bioPhotoBase64` against image Data URL regex before rendering into `pre-img-box`.
- **Tests Run:**
  - Node syntax check: `node -c "tools/js/onseba.js"` -> PASS (exit code 0).
  - Regression suite: Verified input sanitization and language toggles.
- **Rollback Consideration:** Formatting and Bengali/English language toggles remain identical.

---

## 5. `tools/js/tele.js`
- **Vulnerability Addressed:** Category 12 (OAuth Bearer Token in `localStorage`), Category 2 (DOM XSS in Memo Settings).
- **Summary of Change:**
  1. Migrated `studio_cloud_token` storage from persistent `localStorage` to `sessionStorage` (scoped to browser tab session).
  2. Added startup purge removing any legacy token left in `localStorage`.
  3. Updated `handleAuthClick()` to immediately set token in GAPI client (`gapi.client.setToken(resp)`) upon consent.
  4. Implemented hardened `handleSignoutClick()` with null guard protecting `google.accounts.oauth2.revoke(curTk.access_token)`, clearing GAPI token, and deleting tokens from both `sessionStorage` and `localStorage`.
  5. Removed duplicate legacy `handleSignoutClick()` definition at line 271 that previously overwrote the secure signout handler.
  6. Switched from `.innerHTML` to `.textContent` for shop name, address, phone, email, and terms in `loadMemoSettings()`.
- **Tests Run:**
  - Node syntax check: `node -c "tools/js/tele.js"` -> PASS (exit code 0).
  - Regression suite: Verified startup purge, session persistence, safe signout revocation, and null-token safety.
- **Rollback Consideration:** Users authenticate via GIS popup when opening the Studio Cloud modal per session. Drive multipart upload logic remains intact.

---

## 6. `services/Voteshondhan/app.js`
- **Vulnerability Addressed:** Category 19 (Sensitive Voter PII Exposure in Diagnostic Mode).
- **Summary of Change:**
  1. Added `mask()` utility to redact sensitive fields in developer diagnostic mode (`?debug=1`).
  2. Name, Voter ID, Father's Name, Mother's Name, and Address are masked (e.g. `12***89`) in the preview table.
- **Tests Run:**
  - Node syntax check: `node -c "services/Voteshondhan/app.js"` -> PASS (exit code 0).
  - Regression suite: Verified masking function and output.
- **Rollback Consideration:** Normal voter search table displays data according to user search; diagnostic mode guarded by `?debug=1`.

---

## 7. `_headers` (New File)
- **Vulnerability Addressed:** Category 11 (Clickjacking, MIME Sniffing, and Content-Security-Policy).
- **Summary of Change:**
  - Created native Cloudflare Pages `_headers` file with:
    - `X-Frame-Options: SAMEORIGIN`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(self), microphone=(), geolocation=()`
    - Site-compatible `Content-Security-Policy` allowing Google GIS, Firebase, YouTube embeds, Mux test streams, Tailwind CDN, FontAwesome, Google Fonts, GitHub API (`https://api.github.com` for release checks in `ui-renderer.js`), external IPTV proxy (`https://*.workers.dev` in `stream-player.js`), and worker blob demuxing (`worker-src 'self' blob:;`), while restricting `object-src 'none'` and `base-uri 'self'`.
- **Tests Run:**
  - Validated syntax per Cloudflare Pages specification.
  - Final pre-deployment suite: Verified all required connection targets and worker sources are permitted.
- **Rollback Consideration:** Edit `_headers` if additional third-party origins are required.

---

## 8. `.gitignore`
- **Vulnerability Addressed:** Category 17 (Source Map Exclusion).
- **Summary of Change:**
  - Added `*.map` and `**/*.map` to prevent source maps from ever being staged or tracked in Git.
- **Tests Run:**
  - Checked Git tree: 0 `.map` files are tracked in Git HEAD.
