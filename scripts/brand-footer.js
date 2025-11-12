// Simple Banner Functionality
class SimpleBanner {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBannerLanguage();
    }

    setupEventListeners() {
        const joinBtn = document.querySelector('.banner-join-btn');
        if (joinBtn) {
            joinBtn.addEventListener('click', this.handleJoinClick.bind(this));
        }

        // Language change detection
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                    this.updateBannerLanguage();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
    }

    handleJoinClick() {
        this.playClickSound();
        this.showSimpleMessage();
        this.animateButton();
    }

    playClickSound() {
        const clickSound = document.getElementById('clickSound');
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    showSimpleMessage() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            border: 1px solid #333;
            animation: simplePopIn 0.3s ease-out;
            font-size: 14px;
            text-align: center;
        `;
        
        const currentLang = document.documentElement.lang || 'en';
        const messages = {
            'en': '🚀 Welcome to DK Community!',
            'hi': '🚀 डीके कम्युनिटी में स्वागत है!',
            'ur': '🚀 ڈی کے کمیونٹی میں خوش آمدید!',
            'mr': '🚀 डीके कम्युनिटीमध्ये स्वागत आहे!'
        };
        
        notification.textContent = messages[currentLang] || messages['en'];
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'simplePopOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 1500);
    }

    animateButton() {
        const joinBtn = document.querySelector('.banner-join-btn');
        if (joinBtn) {
            joinBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                joinBtn.style.transform = '';
            }, 150);
        }
    }

    updateBannerLanguage() {
        const currentLang = document.documentElement.lang || 'en';
        this.updateText(currentLang);
    }

    updateText(lang) {
        const translations = {
            'en': {
                mainText: 'DK Community',
                subText: 'Deepak Chauhan × AI Bhai',
                joinText: 'Join'
            },
            'hi': {
                mainText: 'डीके कम्युनिटी',
                subText: 'दीपक चौहान × AI भाई',
                joinText: 'जुड़ें'
            },
            'ur': {
                mainText: 'ڈی کے کمیونٹی',
                subText: 'دیپک چوہان × AI بھائی',
                joinText: 'شامل'
            },
            'mr': {
                mainText: 'डीके कम्युनिटी',
                subText: 'दीपक चौहान × AI भाऊ',
                joinText: 'जोडा'
            }
        };

        const translation = translations[lang] || translations['en'];
        
        // Update main text
        const mainText = document.querySelector('.main-text');
        if (mainText) mainText.textContent = translation.mainText;
        
        // Update sub text
        const subText = document.querySelector('.sub-text');
        if (subText) subText.textContent = translation.subText;
        
        // Update join button
        const joinBtn = document.querySelector('.banner-join-btn');
        if (joinBtn) {
            const joinText = joinBtn.querySelector('span:last-child');
            if (joinText && joinText.textContent !== '🚀') {
                joinText.textContent = translation.joinText;
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SimpleBanner();
});

// Global function for join community
function joinCommunity() {
    const simpleBanner = new SimpleBanner();
    simpleBanner.handleJoinClick();
}

// Add simple CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes simplePopIn {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes simplePopOut {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);
