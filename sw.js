// Minimal safe service worker for Digital Seba PWA migration
const CURRENT_CACHE_VERSION = 'digital-seba-v2';

self.addEventListener('install', (event) => {
  // Take control immediately to overwrite any legacy ghost workers
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients immediately so the new PWA identity takes effect
  event.waitUntil(self.clients.claim());
});

