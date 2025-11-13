// scripts/install-prompt.js - UPDATED

let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const cancelBtn = document.getElementById('cancelInstall');

// PWA Install Event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA Install triggered');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 5 seconds
    setTimeout(showInstallPrompt, 5000);
});

function showInstallPrompt() {
    if (deferredPrompt && installPrompt) {
        console.log('Showing install prompt');
        installPrompt.classList.remove('hidden');
        
        // Add animation
        installPrompt.style.animation = 'slideInUp 0.5s ease-out';
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
        console.log('Install button clicked');
        
        if (deferredPrompt) {
            console.log('Prompting user to install');
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            console.log(`User response: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('PWA installed successfully');
                // Show success message
                showInstallSuccess();
            } else {
                console.log('User cancelled PWA installation');
            }
            
            // Clear the deferredPrompt variable
            deferredPrompt = null;
            
            // Hide our custom prompt
            hideInstallPrompt();
        } else {
            console.log('No deferred prompt available');
            // Fallback: redirect to manual install instructions
            showManualInstallGuide();
        }
    });
}

// Cancel Button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        console.log('Install cancelled by user');
        hideInstallPrompt();
        
        // Show again after 1 hour
        setTimeout(showInstallPrompt, 3600000);
    });
}

// Success Message
function showInstallSuccess() {
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 15px; border-radius: 10px; z-index: 10000; animation: slideInRight 0.5s ease-out;">
            <strong>✅ Success!</strong> DK Community app installed successfully!
        </div>
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Manual Install Guide
function showManualInstallGuide() {
    const guide = document.createElement('div');
    guide.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 20px; border-radius: 15px; max-width: 400px; text-align: center;">
                <h3>📱 Install DK Community App</h3>
                <p><strong>For Android:</strong> Tap Chrome menu (⋮) → "Add to Home screen"</p>
                <p><strong>For iOS:</strong> Tap Share button (⎙) → "Add to Home Screen"</p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #ff0080; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(guide);
}

// Check if app is already installed
window.addEventListener('appinstalled', (evt) => {
    console.log('DK Community PWA was successfully installed');
    hideInstallPrompt();
});

// Remove pwa.js file completely - don't need duplicate code
console.log('Install Prompt JS loaded successfully');
