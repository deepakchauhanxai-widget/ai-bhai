// service-worker.js - UPDATED
const CACHE_NAME = 'dk-community-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/styles/responsive.css', 
  '/styles/animations.css',
  '/scripts/script.js',
  '/scripts/language-switcher.js',
  '/scripts/pwa.js',
  '/scripts/navigation.js',
  '/scripts/install-prompt.js',
  '/images/dk-community.png',
  '/images/AI-bhai.png',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  console.log('🚀 DK Community Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ DK Community: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('✅ DK Community Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ DK Community: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
