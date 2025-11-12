// Energy Chamber Management System - FIXED
class EnergyChamber {
    constructor() {
        this.currentLanguage = 'en';
        this.energyData = null;
        this.baseURL = 'https://deepakchauhanxai.xyz/testing-dk/assets/energy-chamber/';
        
        this.initializeEnergyChamber();
    }

    // Language detection
    syncWithWebsiteLanguage() {
        if (typeof window.getCurrentLanguage === 'function') {
            return window.getCurrentLanguage();
        }
        
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['en', 'hi', 'ur', 'mr'].includes(savedLang)) {
            return savedLang;
        }
        
        const htmlLang = document.documentElement.lang;
        if (htmlLang && ['en', 'hi', 'ur', 'mr'].includes(htmlLang)) {
            return htmlLang;
        }
        
        return 'en';
    }

    // Fetch energy chamber data
    async fetchEnergyData(language) {
        try {
            const response = await fetch(`${this.baseURL}${language}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching energy chamber data:', error);
            // Fallback to English
            if (language !== 'en') {
                return this.fetchEnergyData('en');
            }
            throw error;
        }
    }

    // Update ONLY energy chamber content - FIXED
    updateEnergyChamberContent() {
        if (!this.energyData) return;

        // ONLY target elements INSIDE energy chamber section
        const energySection = document.getElementById('energyChamber');
        if (!energySection) {
            console.log('Energy Chamber section not found');
            return;
        }

        // Update elements ONLY within energy chamber
        const elements = {
            'energy_chamber_title': energySection.querySelector('.main-title'),
            'energy_chamber_subtitle': energySection.querySelector('.energy-subtitle'),
            'fire_dialogues_part1': energySection.querySelector('[data-translate="fire_dialogues_part1"]'),
            'fire_dialogues_part2': energySection.querySelector('[data-translate="fire_dialogues_part2"]'),
            'energy_chamber_credits': energySection.querySelector('.credits')
        };

        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && this.energyData[key]) {
                if (key === 'energy_chamber_subtitle') {
                    element.innerHTML = this.energyData[key];
                } else {
                    element.textContent = this.energyData[key];
                }
                console.log(`✅ Updated: ${key}`);
            }
        });
    }

    // Open fire dialogues (button click handlers)
    openFireDialogues(part) {
        const pageUrls = {
            'part1': 'fire-dialogues-part1.html',
            'part2': 'fire-dialogues-part2.html'
        };

        const url = pageUrls[part];
        if (url) {
            window.open(url, '_blank');
        } else {
            console.log('Page URL not defined for part:', part);
        }
    }

    // Language change handler
    async handleLanguageChange(newLanguage) {
        if (newLanguage !== this.currentLanguage) {
            this.currentLanguage = newLanguage;
            await this.loadEnergyData(newLanguage);
            this.updateEnergyChamberContent();
        }
    }

    // Load energy data
    async loadEnergyData(language) {
        try {
            this.energyData = await this.fetchEnergyData(language);
            console.log('Energy chamber data loaded for language:', language);
        } catch (error) {
            console.error('Failed to load energy chamber data:', error);
        }
    }

    // Setup language listener
    setupLanguageListener() {
        document.addEventListener('languageChanged', (event) => {
            this.handleLanguageChange(event.detail.language);
        });

        // Periodic check
        setInterval(() => {
            const newLang = this.syncWithWebsiteLanguage();
            if (newLang !== this.currentLanguage) {
                this.handleLanguageChange(newLang);
            }
        }, 1000);
    }

    // Initialize energy chamber
    async initializeEnergyChamber() {
        this.setupLanguageListener();
        
        this.currentLanguage = this.syncWithWebsiteLanguage();
        await this.loadEnergyData(this.currentLanguage);
        this.updateEnergyChamberContent();

        console.log('Energy Chamber initialized with language:', this.currentLanguage);
    }
}

// Initialize energy chamber
let energyChamber;

document.addEventListener('DOMContentLoaded', () => {
    energyChamber = new EnergyChamber();
});

// Fallback initialization
setTimeout(() => {
    if (!energyChamber) {
        energyChamber = new EnergyChamber();
    }
}, 2000);

// Global functions for button clicks (for onclick attributes)
function openFireDialogues(part) {
    if (energyChamber) {
        energyChamber.openFireDialogues(part);
    } else {
        // Fallback if energyChamber not initialized
        const pageUrls = {
            'part1': 'fire-dialogues-part1.html',
            'part2': 'fire-dialogues-part2.html'
        };
        const url = pageUrls[part];
        if (url) {
            window.open(url, '_blank');
        }
    }
}