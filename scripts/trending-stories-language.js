// trending-stories-language.js - Language handler for Trending Stories
console.log('🌐 trending-stories-language.js loaded');

class TrendingStoriesLanguage {
    constructor() {
        this.currentLanguage = this.getCurrentLanguage();
        this.storiesData = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        console.log('🎯 Initializing Trending Stories Language...');
        this.setupLanguageListeners();
        this.isInitialized = true;
        console.log('✅ Trending Stories Language Ready!');
    }

    getCurrentLanguage() {
        // Multiple ways to detect current language
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) return urlLang;

        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) return storedLang;

        const htmlLang = document.documentElement.lang;
        if (htmlLang) return htmlLang;

        return 'en';
    }

    setupLanguageListeners() {
        // Listen for custom language change event
        document.addEventListener('languageChanged', (e) => {
            console.log('🎯 Language change event received:', e.detail);
            this.handleLanguageChange(e.detail.language);
        });

        // Listen for storage changes (localStorage)
        window.addEventListener('storage', (e) => {
            if (e.key === 'preferredLanguage') {
                console.log('💾 Storage change detected:', e.newValue);
                this.handleLanguageChange(e.newValue);
            }
        });

        // Listen for URL changes
        let currentUrl = window.location.href;
        const observer = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                const newLang = this.getCurrentLanguage();
                if (newLang !== this.currentLanguage) {
                    this.handleLanguageChange(newLang);
                }
            }
        });
        observer.observe(document, { subtree: true, childList: true });

        console.log('🔗 Language listeners setup complete');
    }

    handleLanguageChange(newLanguage) {
        console.log('🔄 Language changing from', this.currentLanguage, 'to', newLanguage);
        
        if (newLanguage !== this.currentLanguage) {
            this.currentLanguage = newLanguage;
            this.updateTrendingStories();
        }
    }

    updateTrendingStories() {
        console.log('🎨 Updating trending stories for language:', this.currentLanguage);
        
        // Check if trending popup exists and is active
        if (window.trendingPopup && window.trendingPopup.popup) {
            const isPopupOpen = window.trendingPopup.popup.classList.contains('active');
            console.log('📊 Popup open status:', isPopupOpen);
            
            if (isPopupOpen) {
                // Force update the stories with current language
                window.trendingPopup.currentLanguage = this.currentLanguage;
                window.trendingPopup.renderStories();
                console.log('✅ Stories updated with new language');
            } else {
                console.log('ℹ️ Popup not open, no update needed');
            }
        } else {
            console.log('❌ Trending popup not available');
        }
    }

    // Method to force update (can be called from anywhere)
    forceUpdate() {
        console.log('⚡ Force updating trending stories language');
        this.currentLanguage = this.getCurrentLanguage();
        this.updateTrendingStories();
    }
}

// Global function to trigger language update
function updateTrendingStoriesLanguage(lang) {
    console.log('🌍 Global function called with language:', lang);
    
    if (window.trendingStoriesLanguage) {
        window.trendingStoriesLanguage.handleLanguageChange(lang);
    } else {
        console.log('🔄 Creating new language instance');
        window.trendingStoriesLanguage = new TrendingStoriesLanguage();
        setTimeout(() => {
            window.trendingStoriesLanguage.handleLanguageChange(lang);
        }, 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Ready - Initializing Trending Stories Language');
    window.trendingStoriesLanguage = new TrendingStoriesLanguage();
});

// Fallback initialization
setTimeout(() => {
    if (!window.trendingStoriesLanguage) {
        console.log('🔄 Fallback initialization');
        window.trendingStoriesLanguage = new TrendingStoriesLanguage();
    }
}, 500);

console.log('✅ trending-stories-language.js loaded successfully');