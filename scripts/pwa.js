// scripts/pwa.js - UPDATED

// Service Worker Registration Only
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('✅ DK Community: ServiceWorker registered successfully');
            })
            .catch(function(error) {
                console.log('❌ DK Community: ServiceWorker registration failed: ', error);
            });
    });
}

// PWA Installation events moved to install-prompt.js
console.log('PWA JS loaded - Service worker only');
