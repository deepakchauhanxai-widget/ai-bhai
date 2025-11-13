// scripts/install-prompt.js - COMPLETELY FIXED

let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const cancelBtn = document.getElementById('cancelInstall');

// Check if app is already installed
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// PWA Install Event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🔵 PWA Install triggered');
    
    // Check if app is already installed
    if (isAppInstalled()) {
        console.log('✅ App already installed, hiding prompt');
        hideInstallPrompt();
        return;
    }
    
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 5 seconds
    setTimeout(() => {
        if (!isAppInstalled() && deferredPrompt) {
            showInstallPrompt();
        }
    }, 5000);
});

function showInstallPrompt() {
    if (deferredPrompt && installPrompt) {
        console.log('🟡 Showing install prompt');
        installPrompt.classList.remove('hidden');
    }
}

function hideInstallPrompt() {
    if (installPrompt) {
        installPrompt.classList.add('hidden');
    }
}

// Install Button Click - WORKING VERSION
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        console.log('🟢 Install button clicked');
        
        if (deferredPrompt) {
            console.log('🟡 Prompting user to install');
            
            // Hide our custom prompt first
            hideInstallPrompt();
            
            // Show browser's native install prompt
            deferredPrompt.prompt();
            
            // Wait for user response
            const { outcome } = await deferredPrompt.userChoice;
            
            console.log(`🟢 User response: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('✅ PWA installed successfully');
                // Success - don't show again
                deferredPrompt = null;
            } else {
                console.log('❌ User cancelled installation');
                // Show again after 1 hour if cancelled
                setTimeout(() => {
                    if (!isAppInstalled()) {
                        showInstallPrompt();
                    }
                }, 3600000); // 1 hour
            }
            
            deferredPrompt = null;
        } else {
            console.log('❌ No install prompt available');
            // Fallback for browsers that don't support PWA install
            showManualInstallGuide();
        }
    });
}

// Cancel Button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        console.log('⏸️ Install cancelled by user');
        hideInstallPrompt();
        
        // Show again after 2 hours
        setTimeout(() => {
            if (!isAppInstalled() && deferredPrompt) {
                showInstallPrompt();
            }
        }, 7200000); // 2 hours
    });
}

// Manual Install Guide (Fallback)
function showManualInstallGuide() {
    const guide = document.createElement('div');
    guide.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
            <div style="background: white; padding: 30px; border-radius: 20px; max-width: 400px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h3 style="color: #333; margin-bottom: 20px;">📱 Install DK Community App</h3>
                
                <div style="text-align: left; margin-bottom: 25px;">
                    <p style="margin: 10px 0;"><strong>For Android (Chrome):</strong></p>
                    <p style="margin: 5px 0; color: #666;">1. Tap Chrome menu (⋮)</p>
                    <p style="margin: 5px 0; color: #666;">2. Tap "Add to Home screen"</p>
                    
                    <p style="margin: 10px 0;"><strong>For iOS (Safari):</strong></p>
                    <p style="margin: 5px 0; color: #666;">1. Tap Share button (⎙)</p>
                    <p style="margin: 5px 0; color: #666;">2. Tap "Add to Home Screen"</p>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="background: #ff0080; color: white; border: none; padding: 12px 30px; border-radius: 10px; font-size: 16px; cursor: pointer;">
                    Got It!
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(guide);
}

// Detect when app is successfully installed
window.addEventListener('appinstalled', (evt) => {
    console.log('🎉 DK Community PWA installed successfully!');
    deferredPrompt = null;
    hideInstallPrompt();
});

// Check on page load if app is already installed
window.addEventListener('load', () => {
    if (isAppInstalled()) {
        console.log('✅ App already installed on load');
        hideInstallPrompt();
    }
});

console.log('✅ Install Prompt JS loaded successfully');
