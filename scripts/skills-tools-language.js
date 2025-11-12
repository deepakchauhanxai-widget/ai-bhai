// Skills & Tools Language System - Completely Separate
console.log('💼 skills-tools-language.js loaded');

class SkillsToolsLanguage {
    constructor() {
        this.currentLanguage = this.getCurrentLanguage();
        this.translations = {};
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Skills & Tools Language System...');
        await this.loadTranslations(this.currentLanguage);
        this.setupLanguageListeners();
        this.updateSkillsToolsBox();
        console.log('✅ Skills & Tools Language System Ready!');
    }

    getCurrentLanguage() {
        return localStorage.getItem('preferredLanguage') || 'en';
    }

    setupLanguageListeners() {
        document.addEventListener('languageChanged', (e) => {
            console.log('🌐 Skills & Tools: Language change detected', e.detail.language);
            this.handleLanguageChange(e.detail.language);
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'preferredLanguage') {
                this.handleLanguageChange(e.newValue);
            }
        });
    }

    async handleLanguageChange(newLanguage) {
        console.log('🔄 Skills & Tools: Changing language to', newLanguage);
        
        if (newLanguage !== this.currentLanguage) {
            this.currentLanguage = newLanguage;
            await this.loadTranslations(newLanguage);
            this.updateSkillsToolsBox();
        }
    }

    async loadTranslations(lang) {
        try {
            console.log(`📁 Loading Skills & Tools translations for: ${lang}`);
            
            const paths = [
                `languages/skills-tools/${lang}.json`,
                `../languages/skills-tools/${lang}.json`,
                `./languages/skills-tools/${lang}.json`
            ];
            
            let response;
            for (const path of paths) {
                try {
                    response = await fetch(path);
                    if (response.ok) break;
                } catch (e) {
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Failed to load skills-tools/${lang}.json`);
            }
            
            this.translations = await response.json();
            console.log('✅ Skills & Tools translations loaded:', this.translations);
            
        } catch (error) {
            console.error('❌ Error loading Skills & Tools translations:', error);
            await this.loadFallbackTranslations();
        }
    }

    async loadFallbackTranslations() {
        console.log('🔄 Loading fallback English translations for Skills & Tools');
        try {
            const response = await fetch('languages/skills-tools/en.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('❌ Even fallback failed, using hardcoded');
            this.translations = {
                freelancing_skills_title: "Freelancing Skills 🚀",
                work_from_anywhere: "Work From Anywhere",
                skills_mantra: "Learn Skills × Get Projects × Earn Online",
                get_started_btn: "Start Freelancing Journey",
                tools_panel_title: "Deepak Chauhan × AI Bhai Tools Panel",
                tools_mantra: "Learn, Grow and Create Your Future with AI ✨",
                tools_tags: "Tools × AI × Motivation",
                open_tools_btn: "Open Full Tools Panel",
                performance_note: "Tools now load separately to reduce homepage load time.",
                left_inspiration: "Skills are the new currency",
                right_inspiration: "Work from anywhere",
                ai_future_text: "AI is the future",
                create_destiny_text: "Create your destiny"
            };
        }
    }

    updateSkillsToolsBox() {
        const skillsToolsBox = document.getElementById('skillsToolsBox');
        if (!skillsToolsBox) {
            console.log('ℹ️ Skills & Tools Box not found on this page');
            return;
        }

        console.log('🎨 Updating Skills & Tools Box with language:', this.currentLanguage);
        
        const elements = skillsToolsBox.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[key];
                } else {
                    element.innerHTML = this.translations[key];
                }
                console.log(`✅ Updated: ${key}`);
            } else {
                console.warn(`❌ Translation not found: ${key}`);
            }
        });

        console.log('✅ Skills & Tools Box updated successfully');
    }

    forceUpdate() {
        this.updateSkillsToolsBox();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Ready - Initializing Skills & Tools Language');
    window.skillsToolsLanguage = new SkillsToolsLanguage();
});

setTimeout(() => {
    if (!window.skillsToolsLanguage) {
        console.log('🔄 Fallback initialization for Skills & Tools Language');
        window.skillsToolsLanguage = new SkillsToolsLanguage();
    }
}, 1000);

console.log('✅ skills-tools-language.js loaded successfully');