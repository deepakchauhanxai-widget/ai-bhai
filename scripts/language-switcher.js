class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadLanguage('en');
        this.setupEventListeners();
        this.updatePageContent();
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`languages/${lang}.json`);
            this.translations = await response.json();
            this.currentLang = lang;
            
            // Update flag in switcher
            const flagMap = {
                'en': '🇺🇸',
                'hi': '🇮🇳', 
                'ur': '🇵🇰',
                'mr': '🇮🇳'
            };
            
            document.querySelector('.current-lang').textContent = flagMap[lang];
            
        } catch (error) {
            console.error('Error loading language:', error);
        }
    }

    setupEventListeners() {
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('langDropdown');
            dropdown.classList.toggle('show');
        });

        // Language selection
        document.querySelectorAll('.lang-dropdown button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
                document.getElementById('langDropdown').classList.remove('show');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            document.getElementById('langDropdown').classList.remove('show');
        });
    }

    async switchLanguage(lang) {
        await this.loadLanguage(lang);
        this.updatePageContent();
        this.savePreference(lang);
    }

    updatePageContent() {
        const t = this.translations;

        // Header
        document.querySelector('.tagline').textContent = t.header.tagline;
        document.querySelector('.main-title').innerHTML = 
            t.header.main_title.replace('×', '<span class="highlight">×</span>');

        // Navigation buttons
        document.querySelectorAll('[data-page="motivational"] .btn-text').forEach(el => {
            el.textContent = t.navigation.motivational;
        });
        document.querySelectorAll('[data-page="photos"] .btn-text').forEach(el => {
            el.textContent = t.navigation.photos;
        });
        document.querySelectorAll('[data-page="stories"] .btn-text').forEach(el => {
            el.textContent = t.navigation.stories;
        });
        document.querySelectorAll('[data-page="memories"] .btn-text').forEach(el => {
            el.textContent = t.navigation.memories;
        });
        document.querySelectorAll('[data-page="unlock"] .btn-text').forEach(el => {
            el.textContent = t.navigation.unlock;
        });
        document.querySelectorAll('[data-page="about"] .btn-text').forEach(el => {
            el.textContent = t.navigation.about;
        });
        document.querySelectorAll('[data-page="team"] .btn-text').forEach(el => {
            el.textContent = t.navigation.team;
        });
        document.querySelectorAll('[data-page="privacy"] .btn-text').forEach(el => {
            el.textContent = t.navigation.privacy;
        });
        document.querySelectorAll('[data-page="training"] .btn-text').forEach(el => {
            el.textContent = t.navigation.training;
        });
        document.querySelectorAll('[data-page="digital"] .btn-text').forEach(el => {
            el.textContent = t.navigation.digital;
        });

        // Footer
        document.querySelector('.banner-text .main-text').textContent = t.footer.community;
        document.querySelector('.banner-join-btn').innerHTML = 
            `<span class="btn-emoji">🚀</span> ${t.footer.join}`;

        // Loading text
        document.querySelector('#loadingScreen p').textContent = t.loading;

        // Install prompt
        const installTitle = document.querySelector('.install-title h4');
        const installSubtitle = document.querySelector('.install-title p');
        const installBtn = document.querySelector('#installBtn span');
        const cancelBtn = document.querySelector('#cancelInstall');

        if (installTitle) installTitle.textContent = t.install.title;
        if (installSubtitle) installSubtitle.textContent = t.install.subtitle;
        if (installBtn) installBtn.textContent = t.install.install_btn;
        if (cancelBtn) cancelBtn.textContent = t.install.later_btn;
    }

    savePreference(lang) {
        localStorage.setItem('preferredLanguage', lang);
    }

    loadPreference() {
        return localStorage.getItem('preferredLanguage') || 'en';
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});
