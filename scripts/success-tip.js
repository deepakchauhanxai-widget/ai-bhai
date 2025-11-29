class SuccessTipPopup {
    constructor() {
        this.currentTip = null;
        this.currentLanguage = 'en';
        this.animations = ['left', 'right', 'top', 'bottom'];
        this.tipsJsonUrl = 'https://deepakchauhanxai.xyz/testing-dk/assets/success-tip.json';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLanguage();
    }

    bindEvents() {
        // Success tip button click
        const successTipBtn = document.getElementById('successTipBtn');
        if (successTipBtn) {
            successTipBtn.addEventListener('click', () => {
                this.showRandomTip();
            });
        }

        // Close popup when clicking outside
        const popup = document.getElementById('successTipPopup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.hidePopup();
                }
            });
        }

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
            // ✅ CACHE BUSTING ADD KARDI - timestamp ke saath
            const timestamp = new Date().getTime();
            const cacheBustedUrl = `${this.tipsJsonUrl}?t=${timestamp}`;
            
            console.log('Loading tips from:', cacheBustedUrl);
            
            const response = await fetch(cacheBustedUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Loaded data:', data);
            
            // Check if notifications array exists
            if (!data.notifications || !Array.isArray(data.notifications)) {
                throw new Error('Invalid data format: notifications array not found');
            }
            
            // Get random notification
            const randomIndex = Math.floor(Math.random() * data.notifications.length);
            const selectedNotification = data.notifications[randomIndex];
            
            // Convert notification format to tip format
            this.currentTip = this.convertNotificationToTip(selectedNotification, data.avatar);
            
            this.showPopup();
            
        } catch (error) {
            console.error('Error loading success tips:', error);
            alert('Tips load nahi ho paye. Internet check karo bhai!');
            this.showDefaultTip();
        }
    }

    // ✅ REFRESH METHOD ADD KARDI
    async refreshTips() {
        console.log('🔄 Refreshing tips...');
        await this.showRandomTip();
    }

    convertNotificationToTip(notification, avatarUrl) {
        // Convert notification format to tip format that your code expects
        return {
            content: {
                en: notification.en?.message || "Believe in yourself and all that you are.",
                hi: notification.hi?.message || "खुद पर और उन सब चीजों पर विश्वास करो जो तुम हो।",
                ur: notification.ur?.message || "اپنے آپ پر اور ان سب چیزوں پر یقین رکھو جو تم ہو۔",
                mr: notification.mr?.message || "स्वतःवर आणि तुम्ही जे काही आहात त्यावर विश्वास ठेवा."
            },
            avatar: avatarUrl || "images/AI-bhai.png",
            signature: {
                en: "- AI Bhai × Deepak Chauhan",
                hi: "- AI भाई × दीपक चौहान",
                ur: "- AI بھائی × دیپک چوہان", 
                mr: "- AI भाऊ × दीपक चौहान"
            }
        };
    }

    showDefaultTip() {
        this.currentTip = {
            content: {
                en: "Believe in yourself and all that you are. You're capable of amazing things!",
                hi: "खुद पर और उन सब चीजों पर विश्वास करो जो तुम हो। तुम अद्भुत चीजों के लिए सक्षम हो!",
                ur: "اپنے آپ پر اور ان سب چیزوں پر یقین رکھو جو تم ہو۔ تم حیرت انگیز چیزوں کے قابل ہو!",
                mr: "स्वतःवर आणि तुम्ही जे काही आहात त्यावर विश्वास ठेवा. तुम आश्चर्यकारक गोष्टींसाठी सक्षम आहात!"
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
        
        if (!popup || !container) {
            console.error('Popup elements not found!');
            return;
        }
        
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
        if (popup) {
            popup.style.display = 'none';
        }
        
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
        if (!container) return;

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
                <!-- ✅ REFRESH BUTTON ADD KARDI -->
                <button class="action-btn refresh-btn" onclick="successTipPopup.refreshTips()">
                    <span class="btn-icon">🔄</span>
                    <span data-translate="refresh">Refresh</span>
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
            },
            // ✅ REFRESH TRANSLATION ADD KARDI
            'refresh': {
                'en': 'Refresh',
                'hi': 'रिफ्रेश',
                'ur': 'ریفریش',
                'mr': 'रिफ्रेश'
            }
        };

        return translations[key]?.[this.currentLanguage] || translations[key]?.['en'];
    }

    handleLike() {
        // Like functionality
        alert('Thanks for liking this tip! ❤️');
    }

    handleShare() {
        if (!this.currentTip) return;
        
        const content = this.currentTip.content[this.currentLanguage] || this.currentTip.content.en;
        
        // Share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Success Tip - DK Community',
                text: content,
                url: window.location.href
            });
        } else {
            // Fallback
            navigator.clipboard.writeText(content);
            alert('Tip copied to clipboard! 📋');
        }
    }
}

// ✅ GLOBAL REFRESH FUNCTION ADD KARDI
function refreshSuccessTips() {
    console.log('🌍 Global refresh success tips called');
    if (window.successTipPopup) {
        window.successTipPopup.refreshTips();
    }
}

// Initialize the success tip popup
const successTipPopup = new SuccessTipPopup();
