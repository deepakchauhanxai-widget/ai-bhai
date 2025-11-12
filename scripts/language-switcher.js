// scripts/language-switcher.js (Auto-Detect Language)

// Language switcher functionality with auto-detection
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSwitcher();
    autoDetectLanguage(); // Auto detect on page load
});

function initializeLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langToggle && langDropdown) {
        // Toggle dropdown
        langToggle.addEventListener('click', function() {
            langDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.language-switcher')) {
                langDropdown.classList.remove('show');
            }
        });
        
        // Language selection
        const langButtons = langDropdown.querySelectorAll('button');
        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                changeLanguage(selectedLang);
                langDropdown.classList.remove('show');
                
                // Update current language display
                updateFlagDisplay(selectedLang);
            });
        });
    }
}

function autoDetectLanguage() {
    // Priority order for language detection:
    // 1. Saved preference in localStorage
    // 2. Browser language
    // 3. Default English
    
    let detectedLang = 'en'; // Default
    
    // Check saved preference first
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['en', 'hi', 'ur', 'mr'].includes(savedLang)) {
        detectedLang = savedLang;
    } 
    // Else check browser language
    else {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            if (browserLang.startsWith('hi')) detectedLang = 'hi'; // Hindi
            else if (browserLang.startsWith('ur')) detectedLang = 'ur'; // Urdu
            else if (browserLang.startsWith('mr')) detectedLang = 'mr'; // Marathi
        }
    }
    
    console.log('Auto-detected language:', detectedLang);
    changeLanguage(detectedLang, true); // Silent change - no toast
}

async function changeLanguage(lang, silent = false) {
    console.log('Changing language to:', lang);
    
    try {
        // Load translations from JSON file
        const response = await fetch(`languages/${lang}.json`);
        const translations = await response.json();
        
        // Update all UI elements
        updateUIWithTranslations(translations, lang);
        
        // Store preferred language
        localStorage.setItem('preferredLanguage', lang);
        
        // Update flag display
        updateFlagDisplay(lang);
        
        // Trigger language change for other components
        const event = new CustomEvent('languageChanged', { 
            detail: { 
                language: lang,
                translations: translations 
            } 
        });
        document.dispatchEvent(event);
        
        if (!silent) {
            showLanguageToast(getLanguageChangeMessage(lang));
        }
        
    } catch (error) {
        console.error('Error loading language file:', error);
        if (!silent) {
            showLanguageToast('Error changing language!');
        }
    }
}

function updateUIWithTranslations(t, lang) {
    try {
        // Header
        const tagline = document.querySelector('.tagline');
        const mainTitle = document.querySelector('.main-title');
        
        if (tagline) tagline.textContent = t.header.tagline;
        if (mainTitle) {
            mainTitle.innerHTML = t.header.main_title.replace('×', '<span class="highlight">×</span>');
        }
        
        // Navigation buttons
        updateNavigationButtons(t.navigation);
        
        // Footer
        updateFooterElements(t.footer);
        
        // Loading text
        const loadingText = document.querySelector('#loadingScreen p');
        if (loadingText) loadingText.textContent = t.loading;
        
        // ✅ ENERGY CHAMBER UPDATE - ADD THIS SECTION
        if (t.section) {
            updateEnergyChamber(t.section);
        }
        
        // Install prompt (if exists)
        if (t.install) {
            updateInstallPrompt(t.install);
        }
        
        console.log('UI updated with', lang, 'translations');
        
    } catch (error) {
        console.error('Error updating UI with translations:', error);
    }
}

// ✅ NEW FUNCTION FOR ENERGY CHAMBER
function updateEnergyChamber(sectionTranslations) {
    console.log('🎯 Updating Energy Chamber with section translations');
    
    // Update energy chamber elements if they exist
    const energyChamber = document.getElementById('energyChamber');
    if (!energyChamber) {
        console.log('ℹ️ Energy Chamber not found on this page');
        return;
    }
    
    // Update title
    const titleElement = energyChamber.querySelector('[data-translate="energy_chamber_title"]');
    if (titleElement && sectionTranslations.energy_chamber_title) {
        titleElement.textContent = sectionTranslations.energy_chamber_title;
    }
    
    // Update subtitle
    const subtitleElement = energyChamber.querySelector('[data-translate="energy_chamber_subtitle"]');
    if (subtitleElement && sectionTranslations.energy_chamber_subtitle) {
        subtitleElement.innerHTML = sectionTranslations.energy_chamber_subtitle;
    }
    
    // Update buttons
    const button1 = energyChamber.querySelector('[data-translate="fire_dialogues_part1"]');
    const button2 = energyChamber.querySelector('[data-translate="fire_dialogues_part2"]');
    
    if (button1 && sectionTranslations.fire_dialogues_part1) {
        button1.innerHTML = sectionTranslations.fire_dialogues_part1;
    }
    if (button2 && sectionTranslations.fire_dialogues_part2) {
        button2.innerHTML = sectionTranslations.fire_dialogues_part2;
    }
    
    // Update credits
    const creditsElement = energyChamber.querySelector('[data-translate="energy_chamber_credits"]');
    if (creditsElement && sectionTranslations.energy_chamber_credits) {
        creditsElement.textContent = sectionTranslations.energy_chamber_credits;
    }
    
    console.log('✅ Energy Chamber updated successfully');
}

function updateFlagDisplay(lang) {
    const flagMap = {
        'en': '🇺🇸',
        'hi': '🇮🇳',
        'ur': '🇵🇰', 
        'mr': '🇮🇳'
    };
    
    const currentLang = document.querySelector('.current-lang');
    if (currentLang) {
        currentLang.textContent = flagMap[lang] || '🇺🇸';
    }
}

function getLanguageChangeMessage(lang) {
    const messages = {
        'hi': 'भाषा हिंदी में बदल गई!',
        'en': 'Language changed to English!',
        'ur': 'زبان اردو میں تبدیل ہوگئی!',
        'mr': 'भाषा मराठी مین بدللی!'
    };
    return messages[lang] || 'Language changed!';
}

function updateUIWithTranslations(t, lang) {
    try {
        // Header
        const tagline = document.querySelector('.tagline');
        const mainTitle = document.querySelector('.main-title');
        
        if (tagline) tagline.textContent = t.header.tagline;
        if (mainTitle) {
            mainTitle.innerHTML = t.header.main_title.replace('×', '<span class="highlight">×</span>');
        }
        
        // Navigation buttons
        updateNavigationButtons(t.navigation);
        
        // Footer
        updateFooterElements(t.footer);
        
        // Loading text
        const loadingText = document.querySelector('#loadingScreen p');
        if (loadingText) loadingText.textContent = t.loading;
        
        // Install prompt (if exists)
        if (t.install) {
            updateInstallPrompt(t.install);
        }
        
        console.log('UI updated with', lang, 'translations');
        
    } catch (error) {
        console.error('Error updating UI with translations:', error);
    }
}

function updateNavigationButtons(navTranslations) {
    const navData = {
        'motivational': navTranslations.motivational,
        'photos': navTranslations.photos,
        'stories': navTranslations.stories,
        'memories': navTranslations.memories,
        'unlock': navTranslations.unlock,
        'about': navTranslations.about,
        'team': navTranslations.team,
        'privacy': navTranslations.privacy,
        'training': navTranslations.training,
        'digital': navTranslations.digital
    };
    
    Object.keys(navData).forEach(page => {
        const buttons = document.querySelectorAll(`[data-page="${page}"] .btn-text`);
        buttons.forEach(button => {
            button.textContent = navData[page];
        });
    });
}

function updateFooterElements(footerTranslations) {
    // Update community text
    const communityText = document.querySelector('.banner-text .main-text');
    if (communityText) {
        communityText.textContent = footerTranslations.community;
    }
    
    // Update join button
    const joinButton = document.querySelector('.banner-join-btn');
    if (joinButton) {
        joinButton.innerHTML = `<span class="btn-emoji">🚀</span> ${footerTranslations.join}`;
    }
}

function updateInstallPrompt(installTranslations) {
    const installTitle = document.querySelector('.install-title h4');
    const installSubtitle = document.querySelector('.install-title p');
    const installBtn = document.querySelector('#installBtn span');
    const cancelBtn = document.querySelector('#cancelInstall');
    
    if (installTitle) installTitle.textContent = installTranslations.title;
    if (installSubtitle) installSubtitle.textContent = installTranslations.subtitle;
    if (installBtn) installBtn.textContent = installTranslations.install_btn;
    if (cancelBtn) cancelBtn.textContent = installTranslations.later_btn;
}

function showLanguageToast(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Export for other scripts to use
window.getCurrentLanguage = function() {
    return localStorage.getItem('preferredLanguage') || 'en';
};

window.getTranslations = async function() {
    const lang = window.getCurrentLanguage();
    try {
        const response = await fetch(`languages/${lang}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
};