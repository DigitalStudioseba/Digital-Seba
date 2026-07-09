/**
 * DIGITAL SEBA - Service Worker
 * PWA offline support with cache-first strategy
 * Author: Monir Hossain
 */

const CACHE_NAME = 'digital-seba-v1.0.0';
const STATIC_CACHE = 'ds-static-v1';
const DYNAMIC_CACHE = 'ds-dynamic-v1';

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/animations.css',
  '/assets/css/components.css',
  '/assets/css/responsive.css',
  '/assets/js/main.js',
  '/assets/js/theme.js',
  '/assets/js/language.js',
  '/assets/js/search.js',
  '/assets/js/animations.js',
  '/pages/dashboard/index.html',
  '/pages/tools/pdf/index.html',
  '/pages/tools/ai/index.html',
  '/pages/tools/passport/index.html',
  '/pages/tools/nid/index.html',
  '/pages/tools/birth/index.html',
  '/pages/tools/land/index.html',
  '/pages/tools/photo/index.html',
  '/pages/tools/utility/index.html',
  '/404.html',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Digital Seba Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching app shell...');
        return cache.addAll(PRECACHE_URLS.filter(url => !url.startsWith('http')));
      })
      .catch(err => console.warn('[SW] Cache install error:', err))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Digital Seba Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache-first for static, Network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and Firebase/auth requests
  if (request.method !== 'GET') return;
  if (url.hostname.includes('firebaseapp.com')) return;
  if (url.hostname.includes('googleapis.com') && !url.pathname.includes('fonts')) return;
  if (url.pathname.includes('/api/')) return;

  // Cache-first for static assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stale-while-revalidate for everything else
  event.respondWith(staleWhileRevalidate(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return fallbackResponse(request);
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('/offline.html') || fallbackResponse(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  return cached || await fetchPromise || fallbackResponse(request);
}

// Fallback response
function fallbackResponse(request) {
  if (request.headers.get('accept')?.includes('text/html')) {
    return caches.match('/offline.html') || new Response('<h1>Offline</h1><p>Please check your internet connection.</p>', {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  return new Response('', { status: 408, statusText: 'Request Timeout' });
}

// Check if URL is a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com');
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Sync any offline actions when connection is restored
  console.log('[SW] Syncing offline data...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'New update from Digital Seba',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Digital Seba', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});
