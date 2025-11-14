// service-worker.js - SIMPLE VERSION
const CACHE_NAME = 'dk-community-v3.0';

self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker Installing...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker Activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
