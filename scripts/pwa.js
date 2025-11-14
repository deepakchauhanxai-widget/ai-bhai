// scripts/pwa.js - SERVICE WORKER ONLY
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('✅ ServiceWorker registered successfully: ', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ ServiceWorker registration failed: ', error);
            });
    });
}
