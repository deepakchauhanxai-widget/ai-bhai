// Simple Progress Tracker Language Support
const progressTranslations = {
    en: {
        'progress_title': 'Daily Progress Tracker',
        'progress_subtitle': 'Your Journey to Success Starts Here! 🚀',
        'start_journey': '🚀 Start Your Success Journey',
        'enter_name': 'Enter your full name',
        'generate_id': 'Generate Unique ID',
        'start_tracking': 'Start Tracking Progress'
    },
    
    hi: {
        'progress_title': 'दैनिक प्रगति ट्रैकर',
        'progress_subtitle': 'आपकी सफलता की यात्रा यहाँ से शुरू होती है! 🚀',
        'start_journey': '🚀 अपनी सफलता की यात्रा शुरू करें',
        'enter_name': 'अपना पूरा नाम दर्ज करें',
        'generate_id': 'यूनिक आईडी जनरेट करें',
        'start_tracking': 'प्रगति ट्रैकिंग शुरू करें'
    }
};

// Simple language apply function
function applyProgressLanguage(lang) {
    const langData = progressTranslations[lang] || progressTranslations.en;
    
    // Update elements with data attributes
    const elements = document.querySelectorAll('[data-progress-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-progress-translate');
        if (langData[key]) {
            element.textContent = langData[key];
        }
    });
    
    // Update placeholders
    const nameInput = document.getElementById('userName');
    if (nameInput && langData.enter_name) {
        nameInput.placeholder = langData.enter_name;
    }
}

// Listen for language changes
document.addEventListener('languageChanged', function(e) {
    applyProgressLanguage(e.detail.lang);
});

// Apply initial language
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setTimeout(() => {
        applyProgressLanguage(savedLang);
    }, 1000);
});