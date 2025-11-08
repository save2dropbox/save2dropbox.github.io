const CACHE_NAME = 'save2dropbox-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request))
  );
});
