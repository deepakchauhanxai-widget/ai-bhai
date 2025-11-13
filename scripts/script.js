// scripts/script.js

// ===== LOADING SCREEN MANAGEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DK Community - Script loaded successfully!');
    
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
    });

// Brand Footer Banner Initialization
function initBrandFooter() {
    // This will be handled by brand-footer.js
    console.log('Brand Footer Banner Ready!');
}

// Call this in your main init function
initBrandFooter();

    // Fallback: if still loading after 3 seconds, force hide
    setTimeout(() => {
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 3000);

    // ===== BUTTON CLICK HANDLERS =====
    initializeNavigation();
    
    // ===== INSTALL PROMPT =====
    initializeInstallPrompt();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            handleNavigation(page);
        });
    });
}

function handleNavigation(page) {
    console.log('Navigating to:', page);
    
    // Play click sound if available
    playClickSound();
    
    // Show loading screen during navigation
    showLoadingScreen();
    
    // For motivational page, open in new tab
    if (page === 'motivational') {
        setTimeout(() => {
            hideLoadingScreen();
            window.open('pages/motivational.html', '_blank');
        }, 1000);
    } else {
        // For other pages, show coming soon message
        setTimeout(() => {
            hideLoadingScreen();
            alert(`🚀 **${page.toUpperCase()} Feature**\n\nBro, this feature is launching soon!\n\n✅ Interactive Content\n✅ Amazing Features\n✅ Surprises!\n\n📅 Coming Soon...`);
        }, 1500);
    }
}

// ===== LOADING SCREEN FUNCTIONS =====
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('fade-out');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== INSTALL PROMPT FUNCTIONALITY =====
function initializeInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const cancelBtn = document.getElementById('cancelInstall');
    
    if (installBtn) {
        installBtn.addEventListener('click', function() {
            alert('📱 App Install ready!');
            hideInstallPrompt();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            hideInstallPrompt();
        });
    }
    
    // Show install prompt after 5 seconds
    setTimeout(() => {
        showInstallPrompt();
    }, 5000);
}

function showInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.classList.remove('hidden');
    }
}

function hideInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.classList.add('hidden');
    }
}

// ===== AUDIO FUNCTIONS =====
function playClickSound() {
    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    hideLoadingScreen();
});

// Force hide loading screen if everything else fails
window.addEventListener('load', function() {
    setTimeout(hideLoadingScreen, 2000);
});
