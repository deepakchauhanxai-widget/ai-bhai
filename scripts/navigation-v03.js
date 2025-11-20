// scripts/navigation.js (Updated - All Pages Open in New Tab)

const pageConfig = {
    'motivational': {
        title: 'Motivational Content - DK Community',
        html: 'pages/motivational.html',
        icon: '💪',
        type: 'external'
    },
    'photos': {
        title: 'Photos Gallery - DK Community', 
        html: 'pages/photos.html',
        icon: '📸',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'stories': {
        title: 'Your Stories - DK Community',
        html: 'pages/stories.html',
        icon: '📖',
        type: 'modal'  // Changed from 'modal' to 'external'
    },
    'memories': {
        title: 'Old Memories - DK Community',
        html: 'pages/memories.html',
        icon: '🕰️',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'unlock': {
        title: 'Unlock Features - DK Community',
        html: 'pages/unlock.html',
        icon: '🔓',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'about': {
        title: 'About Us - DK Community',
        html: 'pages/about.html',
        icon: '👥',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'team': {
        title: 'Our Team - DK Community',
        html: 'pages/team.html',
        icon: '🚀',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'privacy': {
        title: 'Privacy Policy - DK Community',
        html: 'pages/privacy.html',
        icon: '🔒',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'training': {
        title: 'AI Training - DK Community',
        html: 'pages/training-v03.html',
        icon: '🤖',
        type: 'external'  // Changed from 'modal' to 'external'
    },
    'digital': {
        title: 'Digital Jodi - DK Community',
        html: 'pages/digital.html',
        icon: '❤️',
        type: 'external'  // Changed from 'modal' to 'external'
    }
};

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page && pageConfig[page]) {
                navigateToPage(page);
            } else {
                showComingSoon(page);
            }
        });
    });
}

function navigateToPage(page) {
    const pageInfo = pageConfig[page];
    
    if (!pageInfo) {
        showComingSoon(page);
        return;
    }
    
    // Show loading
    showLoadingScreen();
    
    // Update page title
    document.title = pageInfo.title;
    
    // AB SABHI PAGES NEW TAB MEIN OPEN HONGE
    setTimeout(() => {
        hideLoadingScreen();
        window.open(pageInfo.html, '_blank');
        document.title = 'Deepak Chauhan × AI Bhai - DK Community';
    }, 1000);
}

function showComingSoon(feature) {
    alert(`🚀 **${feature} Feature**\n\nभाई, ये feature जल्दी ही launch हो रहा है!\n\n✅ Interactive Content\n✅ Amazing Features\n✅ Surprises!\n\n📅 Coming Soon...`);
}

function showLoadingScreen() {
    // Loading screen logic yahan add karein
    const loadingHTML = `
        <div id="loadingScreen" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:9999; color:white; font-size:20px;">
            <div style="text-align:center;">
                <div style="font-size:40px; margin-bottom:20px;">⏳</div>
                <p>Loading... ${document.title}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeNavigation);
