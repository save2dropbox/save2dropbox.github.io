const CACHE_NAME = 'save2dropbox-cache-v2';
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

// ✅ تثبيت الكاش الأساسي
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // لتفعيل التحديث فوراً
});

// ✅ تفعيل النسخة الجديدة من الكاش وإزالة القديمة
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

// ✅ التعامل مع الطلبات — دعم Offline + تحديث تلقائي
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // إذا المستخدم بدون إنترنت، عرض صفحة offline.html
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  } else {
    // تحميل من الكاش أولاً ثم التحديث بالخلفية
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
