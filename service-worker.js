const CACHE_NAME = 'save2dropbox-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/save.js',
  '/save2.html',
  '/dropbox.png',
  '/favicon.ico',
  '/manifest.json',
  '/style.css',
  '/all.min.css',
  '/webfonts/fa-brands-400.woff2',
  '/webfonts/fa-brands-400.ttf',
  '/404.html'
];

// ✅ Install primary cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // To activate the update immediatelyاً
});

// ✅ Activate the new version of the cache and remove the old one.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ✅ Order Handling — Offline Support + Automatic Updates
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    //If the user is offline, view the page offline.html
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  } else {
   // Download from cache first, then update in the background
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          }).catch(() => response);
          return response || fetchPromise;
        })
    );
  }
});
