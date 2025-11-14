// scripts/install-prompt.js - COMPLETE NEW VERSION

let deferredPrompt;

// Universal Install Guide - MAIN FUNCTION
function showUniversalInstallGuide() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Don't show if already installed
    if (isStandalone || window.navigator.standalone) {
        showAlreadyInstalledMessage();
        return;
    }
    
    if (isIOS) {
        showIOSInstallGuide();
    } else if (isAndroid && deferredPrompt) {
        // Use native Android install prompt
        triggerAndroidInstall();
    } else {
        showManualInstallGuide();
    }
}

// iOS Specific Guide
function showIOSInstallGuide() {
    const iosGuide = document.createElement('div');
    iosGuide.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Poppins', sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 20px; max-width: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 2px solid #ff0080;">
                <div style="font-size: 40px; margin-bottom: 15px;">📱</div>
                <h3 style="margin: 0 0 15px 0; font-size: 24px; color: white;">Install DK Community</h3>
                <p style="margin: 0 0 20px 0; line-height: 1.5; opacity: 0.9;">Follow these steps to install the app:</p>
                
                <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                        <div style="background: #ff0080; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; flex-shrink: 0;">1</div>
                        <p style="margin: 0;">Tap the <strong>Share</strong> button (⎙) at the bottom</p>
                    </div>
                    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                        <div style="background: #ff0080; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; flex-shrink: 0;">2</div>
                        <p style="margin: 0;">Scroll and tap <strong>"Add to Home Screen"</strong></p>
                    </div>
                    <div style="display: flex; align-items: flex-start;">
                        <div style="background: #ff0080; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; flex-shrink: 0;">3</div>
                        <p style="margin: 0;">Tap <strong>"Add"</strong> in top right</p>
                    </div>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.3s ease;">
                    Got It! 👍
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(iosGuide);
}

// Android Install Trigger
async function triggerAndroidInstall() {
    if (deferredPrompt) {
        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                showInstallSuccess();
            }
            
            deferredPrompt = null;
        } catch (error) {
            console.log('Android install failed:', error);
            showManualInstallGuide();
        }
    } else {
        showManualInstallGuide();
    }
}

// Manual Install Guide for other browsers
function showManualInstallGuide() {
    const guide = document.createElement('div');
    guide.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Poppins', sans-serif;">
            <div style="background: linear-gradient(135deg, #ff0080, #667eea); color: white; padding: 30px; border-radius: 20px; max-width: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="margin: 0 0 15px 0; font-size: 24px;">📱 Install DK Community App</h3>
                <p style="margin: 0 0 20px 0; line-height: 1.5;"><strong>For Android:</strong> Tap Chrome menu (⋮) → "Add to Home screen"</p>
                <p style="margin: 0 0 20px 0; line-height: 1.5;"><strong>For iOS:</strong> Tap Share button (⎙) → "Add to Home Screen"</p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: white; color: #ff0080; border: none; padding: 12px 30px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 16px;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(guide);
}

// Success Message
function showInstallSuccess() {
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 15px; border-radius: 10px; z-index: 10000; animation: slideInRight 0.5s ease-out; font-family: 'Poppins', sans-serif;">
            <strong>✅ Success!</strong> DK Community app installed successfully!
        </div>
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Already Installed Message
function showAlreadyInstalledMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 15px; border-radius: 10px; z-index: 10000; animation: slideInRight 0.5s ease-out; font-family: 'Poppins', sans-serif;">
            <strong>✅ Already Installed!</strong> App is already on your home screen.
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// PWA Install Event (for Android)
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA Install triggered');
    e.preventDefault();
    deferredPrompt = e;
});

// Check if app is already installed
window.addEventListener('appinstalled', (evt) => {
    console.log('DK Community PWA was successfully installed');
    deferredPrompt = null;
});

console.log('Install Prompt JS loaded successfully - Universal Button Version');
