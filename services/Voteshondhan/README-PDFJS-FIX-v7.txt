VoteSondhan PDF.js fix

This build no longer depends on vendor/pdf.min.js being present at startup.
index.html loads PDF.js 3.11.174 from cdnjs, and app.js has three CDN fallbacks.
If vendor/pdf.worker.min.js exists it is used; otherwise the CDN worker is used.

Local run:
1. Start: npx http-server . -p 9095 -c-1
2. Open: http://127.0.0.1:9095/
3. Upload the voter PDF.
