class SuccessTipPopup {
    constructor() {
        this.currentTip = null;
        this.currentLanguage = 'en';
        this.animations = ['left', 'right', 'top', 'bottom'];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLanguage();
    }

    bindEvents() {
        // Success tip button click
        document.getElementById('successTipBtn').addEventListener('click', () => {
            this.showRandomTip();
        });

        // Close popup when clicking outside
        document.getElementById('successTipPopup').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hidePopup();
            }
        });

        // Language change event
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.updatePopupContent();
        });
    }

    loadLanguage() {
        // Get current language from main language switcher
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            const currentLang = langBtn.querySelector('.current-lang').textContent;
            this.currentLanguage = this.getLanguageFromEmoji(currentLang);
        }
    }

    getLanguageFromEmoji(emoji) {
        const langMap = {
            '🇮🇳': 'hi',
            '🇺🇸': 'en', 
            '🇵🇰': 'ur',
            'mr': 'mr'
        };
        return langMap[emoji] || 'en';
    }

    async showRandomTip() {
        try {
            const response = await fetch('data/success-tips.json');
            const data = await response.json();
            
            const randomIndex = Math.floor(Math.random() * data.success_tips.length);
            this.currentTip = data.success_tips[randomIndex];
            
            this.showPopup();
        } catch (error) {
            console.error('Error loading success tips:', error);
            this.showDefaultTip();
        }
    }

    showDefaultTip() {
        this.currentTip = {
            content: {
                en: "Believe in yourself and all that you are.",
                hi: "खुद पर और उन सब चीजों पर विश्वास करो जो तुम हो।",
                ur: "اپنے آپ پر اور ان سب چیزوں پر یقین رکھو جو تم ہو۔",
                mr: "स्वतःवर आणि तुम्ही जे काही आहात त्यावर विश्वास ठेवा."
            },
            avatar: "images/AI-bhai.png",
            signature: {
                en: "- AI Bhai × Deepak Chauhan",
                hi: "- AI भाई × दीपक चौहान",
                ur: "- AI بھائی × دیپک چوہان", 
                mr: "- AI भाऊ × दीपक चौहान"
            }
        };
        this.showPopup();
    }

    showPopup() {
        const popup = document.getElementById('successTipPopup');
        const container = document.getElementById('successTipContainer');
        
        // Random animation direction
        const randomAnim = this.animations[Math.floor(Math.random() * this.animations.length)];
        container.className = `success-tip-popup popup-slide-${randomAnim}`;
        
        this.updatePopupContent();
        popup.style.display = 'flex';
        
        // Add escape key listener
        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    hidePopup() {
        const popup = document.getElementById('successTipPopup');
        popup.style.display = 'none';
        
        // Remove escape key listener
        document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    handleEscapeKey(e) {
        if (e.key === 'Escape') {
            this.hidePopup();
        }
    }

    updatePopupContent() {
        if (!this.currentTip) return;

        const container = document.getElementById('successTipContainer');
        const content = this.currentTip.content[this.currentLanguage] || this.currentTip.content.en;
        const signature = this.currentTip.signature[this.currentLanguage] || this.currentTip.signature.en;

        container.innerHTML = `
            <button class="popup-close-btn" onclick="successTipPopup.hidePopup()">
                <span>✕</span>
            </button>
            
            <div class="popup-header">
                <div class="popup-avatar">
                    <img src="${this.currentTip.avatar}" alt="AI Bhai" onerror="this.src='images/AI-bhai.png'">
                </div>
                <div class="popup-title">
                    <h3 data-translate="success_tip">Success Tip</h3>
                    <p data-translate="daily_motivation">Daily Motivation</p>
                </div>
            </div>
            
            <div class="popup-content">
                <p class="tip-text">"${content}"</p>
                <div class="popup-signature">${signature}</div>
            </div>
            
            <div class="popup-actions">
                <button class="action-btn like-btn" onclick="successTipPopup.handleLike()">
                    <span class="btn-icon">❤️</span>
                    <span data-translate="like">Like</span>
                </button>
                <button class="action-btn share-btn" onclick="successTipPopup.handleShare()">
                    <span class="btn-icon">📤</span>
                    <span data-translate="share">Share</span>
                </button>
                <button class="action-btn next-btn" onclick="successTipPopup.showRandomTip()">
                    <span class="btn-icon">🔁</span>
                    <span data-translate="next_tip">Next Tip</span>
                </button>
            </div>
        `;

        // Update translations
        this.updateTranslations();
    }

    updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    getTranslation(key) {
        const translations = {
            'success_tip_btn': {
                'en': 'Success Tip of the Day',
                'hi': 'आज का सफलता टिप',
                'ur': 'آج کی کامیابی کا ٹپ',
                'mr': 'आजचा यश टिप'
            },
            'success_tip': {
                'en': 'Success Tip',
                'hi': 'सफलता टिप',
                'ur': 'کامیابی کا ٹپ', 
                'mr': 'यश टिप'
            },
            'daily_motivation': {
                'en': 'Daily Motivation',
                'hi': 'दैनिक प्रेरणा',
                'ur': 'روزانہ کی حوصلہ افزائی',
                'mr': 'दैनिक प्रेरणा'
            },
            'like': {
                'en': 'Like',
                'hi': 'लाइक',
                'ur': 'لائک',
                'mr': 'लाइक'
            },
            'share': {
                'en': 'Share', 
                'hi': 'शेयर',
                'ur': 'شیئر',
                'mr': 'शेयर'
            },
            'next_tip': {
                'en': 'Next Tip',
                'hi': 'अगला टिप',
                'ur': 'اگلا ٹپ',
                'mr': 'पुढील टिप'
            }
        };

        return translations[key]?.[this.currentLanguage] || translations[key]?.['en'];
    }

    handleLike() {
        // Like functionality
        alert('Thanks for liking this tip! ❤️');
    }

    handleShare() {
        // Share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Success Tip - DK Community',
                text: this.currentTip.content[this.currentLanguage],
                url: window.location.href
            });
        } else {
            // Fallback
            navigator.clipboard.writeText(this.currentTip.content[this.currentLanguage]);
            alert('Tip copied to clipboard! 📋');
        }
    }
}

// Initialize the success tip popup
const successTipPopup = new SuccessTipPopup();