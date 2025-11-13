// scripts/install-prompt.js

let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const cancelBtn = document.getElementById('cancelInstall');

// PWA Install Logic
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 8 seconds
    setTimeout(showInstallPrompt, 8000);
});

function showInstallPrompt() {
    if (deferredPrompt && installPrompt) {
        installPrompt.classList.remove('hidden');
    }
}

function hideInstallPrompt() {
    if (installPrompt) {
        installPrompt.classList.add('hidden');
    }
}

// Install Button Click
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            deferredPrompt = null;
            hideInstallPrompt();
        }
    });
}

// Cancel Button Click
if (cancelBtn) {
    cancelBtn.addEventListener('click', hideInstallPrompt);
}
