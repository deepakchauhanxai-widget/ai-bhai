// scripts/script.js - CLEAN VERSION (No Duplicate Install Code)

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
        console.log('Brand Footer Banner Ready!');
    }

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
        // Silent navigation - no alert message
        setTimeout(() => {
            hideLoadingScreen();
            console.log(`Navigating to ${page} page`);
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
