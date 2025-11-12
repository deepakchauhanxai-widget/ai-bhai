/**
 * DK Shared Language Manager
 * Syncs language across all DK websites
 * @author Deepak Chauhan × AI Bhai
 */

class SharedLanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🌐 DK Shared Language Manager Initializing...');
        
        this.loadCurrentLanguage();
        this.setupCrossTabSync();
        this.setupURLLanguageDetection();
        
        this.isInitialized = true;
        console.log('✅ DK Shared Language Manager Ready!');
    }

    loadCurrentLanguage() {
        // Priority: URL > LocalStorage > Browser > Default
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const savedLang = localStorage.getItem('preferredLanguage');
        const browserLang = this.detectBrowserLanguage();

        this.currentLanguage = urlLang || savedLang || browserLang || 'en';
        console.log('🔍 Current language:', this.currentLanguage);
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        if (browserLang.startsWith('hi')) return 'hi';
        if (browserLang.startsWith('ur')) return 'ur';
        if (browserLang.startsWith('mr')) return 'mr';
        return 'en';
    }

    setupCrossTabSync() {
        // Listen for storage changes (other tabs/pages)
        window.addEventListener('storage', (event) => {
            if (event.key === 'preferredLanguage' && event.newValue) {
                console.log('🔄 Language change from other tab:', event.newValue);
                this.applyLanguage(event.newValue, true);
            }
        });

        // Periodic sync check
        setInterval(() => {
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && savedLang !== this.currentLanguage) {
                console.log('🔄 Language sync detected:', savedLang);
                this.applyLanguage(savedLang, true);
            }
        }, 1000);
    }

    setupURLLanguageDetection() {
        // URL change detection
        let currentURL = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentURL) {
                currentURL = window.location.href;
                this.loadCurrentLanguage();
                this.applyLanguage(this.currentLanguage, true);
            }
        }, 500);
    }

    async changeLanguage(lang) {
        if (!['en', 'hi', 'ur', 'mr'].includes(lang)) return;
        if (lang === this.currentLanguage) return;

        console.log('🔄 Changing language to:', lang);
        
        // Update storage
        localStorage.setItem('preferredLanguage', lang);
        
        // Apply changes
        await this.applyLanguage(lang);
        
        // Update URL
        this.updateURLParameter(lang);
        
        // Show notification
        this.showNotification(lang);
    }

    async applyLanguage(lang, silent = false) {
        this.currentLanguage = lang;
        
        try {
            // Load and apply translations
            await this.loadAndApplyTranslations(lang);
            
            // Update UI
            this.updateLanguageSwitcherUI(lang);
            
            // Dispatch event for current page
            if (!silent) {
                this.dispatchLanguageEvent(lang);
            }
            
            console.log('✅ Language applied:', lang);
        } catch (error) {
            console.error('Language apply error:', error);
        }
    }

    async loadAndApplyTranslations(lang) {
        try {
            const response = await fetch(`../languages/${lang}.json`);
            const translations = await response.json();
            this.applyTranslationsToPage(translations, lang);
        } catch (error) {
            console.warn('Using fallback translations');
            this.applyTranslationsToPage(this.getFallbackTranslations(lang), lang);
        }
    }

    applyTranslationsToPage(translations, lang) {
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
    }

    getFallbackTranslations(lang) {
        const fallback = {
            'en': { 'community_wall': 'Community Wall', 'loading': 'Loading...' },
            'hi': { 'community_wall': 'कम्युनिटी वॉल', 'loading': 'लोड हो रहा...' },
            'ur': { 'community_wall': 'کمیونٹی وال', 'loading': 'لوڈ ہو رہا ہے...' },
            'mr': { 'community_wall': 'कम्युनिटी वॉल', 'loading': 'लोड होत आहे...' }
        };
        return fallback[lang] || fallback.en;
    }

    updateLanguageSwitcherUI(lang) {
        const flagMap = { 'en': '🇺🇸', 'hi': '🇮🇳', 'ur': '🇵🇰', 'mr': '🇮🇳' };
        const currentLangElement = document.getElementById('currentLanguage');
        
        if (currentLangElement) {
            currentLangElement.textContent = flagMap[lang] || '🇺🇸';
        }
    }

    updateURLParameter(lang) {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    }

    dispatchLanguageEvent(lang) {
        const event = new CustomEvent('dkLanguageChanged', {
            detail: { language: lang, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    showNotification(lang) {
        const messages = {
            'en': 'Language changed to English!',
            'hi': 'भाषा हिंदी में बदल गई!',
            'ur': 'زبان اردو میں تبدیل ہوگئی!',
            'mr': 'भाषा मराठी मध्ये बदलली!'
        };
        
        // Simple toast
        const toast = document.createElement('div');
        toast.textContent = messages[lang] || 'Language changed!';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: #10b981; color: white; padding: 12px 20px;
            border-radius: 8px; z-index: 10000; font-family: inherit;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize globally
window.dkLanguageManager = new SharedLanguageManager();