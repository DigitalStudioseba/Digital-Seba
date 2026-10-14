# Digital Seba — Security Deployment Checklist & Production Playbook

Follow this checklist strictly prior to publishing changes, deploying to Cloudflare Pages, or re-enabling Firebase services.

---

## 1. Required Approvals & Authorizations
- [ ] Lead Developer / Site Owner sign-off on security remediation diffs.
- [ ] Explicit authorization confirmed before pushing commits to `origin/main` or `origin/DigitalSeba`.
- [ ] Explicit authorization confirmed before publishing updated Firebase Security Rules.

---

## 2. Pre-Commit Git Working Tree State Verification

Review the exact list of modified tracked files and intended new files:

### Tracked Source Files (6 Security Remediations):
- `live-tv/js/live-chat.js` (Stored XSS fix, color regex, client database deletion removal)
- `assets/js/resources-render.js` (DOM XSS fix, protocol validation, empty query escape)
- `tools/js/wpformatter.js` (DOM XSS fix, raster Data URL regex validation)
- `tools/js/onseba.js` (DOM XSS fix, raster Data URL regex validation)
- `tools/js/tele.js` (OAuth token migration to sessionStorage, startup purge, safe signout)
- `services/Voteshondhan/app.js` (Developer diagnostic mode PII masking)

### Tracked Configuration & HTML Files (5 Files):
- `.gitignore` (Source map exclusion: `*.map`, `**/*.map`)
- `about/index.html` (Pre-existing user integration of Firebase SDK v8)
- `live-tv/index.html` (Pre-existing user integration of Firebase SDK v8 & live-chat)
- `services/index.html` (Pre-existing user integration of Firebase SDK v8)
- `tools/index.html` (Pre-existing user integration of Firebase SDK v8)

### New Files to Stage (5 Files):
- `_headers` (Cloudflare Pages security headers & feature-compatible CSP)
- `SECURITY_AUDIT_REPORT.md` (20-category audit matrix)
- `SECURITY_FIX_LOG.md` (Detailed record of modifications)
- `SECURITY_TEST_RESULTS.md` (Test evidence, source map check, SRI analysis)
- `SECURITY_DEPLOYMENT_CHECKLIST.md` (This checklist & deployment playbook)

---

## 3. Firebase Console Actions (Required Before Database Re-Activation)

> [!IMPORTANT]
> The database `totemic-sector-373910-default-rtdb` is currently disabled. Do NOT re-enable it without applying the rules below first.

1. Navigate to **Firebase Console > Project `totemic-sector-373910` > Realtime Database > Rules**.
2. Replace existing rules with the following hardened declarative policy:
   ```json
   {
     "rules": {
       "chats": {
         "$channelId": {
           "messages": {
             ".read": true,
             "$messageId": {
               ".write": "!data.exists() && newData.exists()",
               ".validate": "newData.hasChildren(['user', 'text', 'timestamp']) && newData.child('user').isString() && newData.child('user').val().length <= 25 && newData.child('text').isString() && newData.child('text').val().length <= 200 && newData.child('timestamp').isNumber()"
             }
           },
           "lastActive": {
             ".read": true,
             ".write": "newData.isNumber()"
           }
         }
       }
     }
   }
   ```
3. **What this enforces:**
   - Anyone can read live chat for channels (`.read: true`).
   - Anyone can post a new message (`!data.exists() && newData.exists()`).
   - **NO ONE can overwrite or delete existing messages** (`!data.exists()` strictly forbids modifying or deleting existing records).
   - Validates maximum text length ($\le 200$ chars) and username ($\le 25$ chars).
   - Entirely prevents unauthenticated clients from calling `.remove()` or `.update()` on `/messages` or `/chats`.

---

## 4. Google Cloud Console Actions (Credential Hardening)

1. Navigate to **Google Cloud Console > APIs & Services > Credentials**.
2. Locate API Key `AIzaSyCQDzRhsSN13iIsQ81eXBE-bHMSm-X2BDY`:
   - Set **Application restrictions** to **Websites**.
   - Add Website restrictions:
     - `https://digitalseba.pages.dev/*`
     - `https://digiseba.shop/*`
     - `http://localhost:*/*` (for local development)
   - Set **API restrictions** to **Restrict key** > Select **Google Drive API** only.
3. Locate OAuth 2.0 Client ID `742363063259-hecd6i38ovt8kv16na4c7qrv21hrpg9k.apps.googleusercontent.com`:
   - Verify Authorized JavaScript Origins:
     - `https://digitalseba.pages.dev`
     - `https://digiseba.shop`

---

## 5. Cloudflare Zero Trust (Access) Configuration for Admin Routes

Because Cloudflare Pages hosts static assets without a backend application server, any administrative route (such as `/admin`, `/resources/admin`, or future admin tools) must be guarded at the edge:

1. Log into **Cloudflare Zero Trust Dashboard** (`one.dash.cloudflare.com`).
2. Navigate to **Access** > **Applications** > **Add an application** > select **Self-hosted**.
3. **Application Configuration:**
   - **Application name:** `Digital Seba Admin Portal`
   - **Application domain:** `digitalseba.pages.dev`
   - **Path:** `/admin*` (and `/resources/out/admin*` if ever published)
4. **Policy Configuration:**
   - **Action:** `Allow`
   - **Rule name:** `Authorized Administrators Only`
   - **Include Rule:** Selector = `Emails` -> add your authorized administrator email(s).
5. **Identity Providers:**
   - Enable One-Time PIN (OTP) or Google Workspace OAuth.
6. **Result:** Any request to protected admin paths triggers an edge authentication challenge before any asset is loaded. Unauthorized requests are rejected with HTTP 403 at Cloudflare edge with zero exposure.

---

## 6. Cloudflare Pages Deployment Verification

1. Review Git working tree status:
   Confirm only the intended 11 tracked + 5 new files are modified/created:
2. Commit and push (ONLY upon explicit owner authorization):
   ```bash
   git add live-tv/js/live-chat.js assets/js/resources-render.js tools/js/wpformatter.js tools/js/onseba.js tools/js/tele.js services/Voteshondhan/app.js about/index.html live-tv/index.html services/index.html tools/index.html _headers .gitignore SECURITY_*.md
   git commit -m "fix(security): resolve stored XSS, token persistence, PII leak, and add security headers"
   git push origin main
   ```
3. Post-deployment verification:
   ```bash
   curl -I https://digitalseba.pages.dev
   ```
   Confirm presence of:
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Content-Security-Policy: default-src 'self' ...`

---

## 7. Rollback Playbook

If any client functionality breaks after deployment:
1. Revert Git commit:
   ```bash
   git revert HEAD --no-edit
   git push origin main
   ```
2. Cloudflare Pages will automatically deploy the previous revision within 60 seconds.
