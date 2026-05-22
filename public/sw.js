const CACHE_NAME = 'gkjw-sukolilo-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo.png',
  '/favlogo.png',
  '/logo_maskable.png',
  '/logo_maskable_192.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate & Network Fallback)
self.addEventListener('fetch', (event) => {
  // Hanya intercept GET requests
  if (event.request.method !== 'GET') return;

  // Bypass Google Sheets API / GAS API / non-http requests agar tidak merusak request POST/PUT
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Bypass Vite dev server internal files and source files to prevent routing & HMR bugs in development
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@vite/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('@id') ||
    url.searchParams.has('import') ||
    url.searchParams.has('vue')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch di latar belakang untuk memperbarui cache (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch((err) => console.log('Offline: Gagal update background cache', err));

        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Jika gagal fetch (misal offline total), fallback ke index.html untuk Single Page Application
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
