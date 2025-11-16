// Motivational Box Functionality for Home Page - JSON Version
class HomeMotivationalBox {
    constructor() {
        this.currentQuoteIndex = 0;
        this.likeCount = 0;
        this.quotesData = [];
        this.isDataLoaded = false;
        
        this.init();
    }

    async init() {
        await this.loadQuotesFromJSON();
        this.renderBox();
        this.setupLanguageListener();
        this.startAutoRotate();
        this.loadLikeCount();
    }

    async loadQuotesFromJSON() {
        try {
            console.log('🔄 Loading JSON from URL...');
            
            // USE THIS ABSOLUTE URL - IT WILL WORK 100%
            
            const response = await fetch('https://deepakchauhanxai.xyz/testing-dk/dk-community/data/motivational.json?v=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.quotesData = data.motivational_quotes;
            this.isDataLoaded = true;
            console.log('✅ Quotes loaded successfully:', this.quotesData.length);
            
        } catch (error) {
            console.error('❌ Error loading JSON:', error);
            console.log('🔄 Using default quotes as fallback...');
            this.loadDefaultQuotes();
        }
    }

    loadDefaultQuotes() {
        this.quotesData = [
            {
                "id": 1,
                "image": "https://deepakchauhanxai.xyz/images/AI-bhai.png",
                "hi": {
                    "title": "सफलता का रहस्य",
                    "shayari": "हौसले बुलंद हो तो मंजिलें भी मिल जाती हैं, कोशिश करने वालों की कभी हार नहीं होती।"
                },
                "en": {
                    "title": "Secret of Success", 
                    "shayari": "If your courage is high, you will find your destination, those who try never lose."
                },
                "ur": {
                    "title": "کامیابی کا راز",
                    "shayari": "ہمت بلند ہو تو منزلیں بھی مل جاتی ہیں، کوشش کرنے والوں کی کبھی ہار نہیں ہوتی۔"
                },
                "mr": {
                    "title": "यशाचे रहस्य",
                    "shayari": "हौसले उंच असले तर मंजिल मिळते, प्रयत्न करणाऱ्यांचे कधीच पराभव होत नाहीत."
                }
            }
        ];
        this.isDataLoaded = true;
    }

    // ... rest of the code remains same as previous
    renderBox() {
        if (!this.isDataLoaded) {
            this.showLoadingState();
            return;
        }
        this.updateContent();
    }

    showLoadingState() {
        const titleElement = document.getElementById('boxTitle');
        const shayariElement = document.getElementById('boxShayari');
        
        if (titleElement) titleElement.textContent = "Loading...";
        if (shayariElement) shayariElement.textContent = "Motivational quotes are loading...";
    }

    updateContent() {
        if (!this.isDataLoaded || this.quotesData.length === 0) {
            this.showLoadingState();
            return;
        }

        const currentLanguage = this.getCurrentLanguage();
        const currentQuote = this.quotesData[this.currentQuoteIndex];
        const content = currentQuote[currentLanguage] || currentQuote.en;

        const titleElement = document.getElementById('boxTitle');
        const shayariElement = document.getElementById('boxShayari');
        const imageElement = document.getElementById('boxImage');
        const likeCountElement = document.getElementById('likeCount');

        if (titleElement) titleElement.textContent = content.title;
        if (shayariElement) shayariElement.textContent = content.shayari;
        if (imageElement) {
            imageElement.src = currentQuote.image;
            imageElement.alt = content.title;
        }
        if (likeCountElement) likeCountElement.textContent = this.likeCount;
    }

    getCurrentLanguage() {
        const currentLangBtn = document.querySelector('.lang-option.active');
        if (currentLangBtn) {
            return currentLangBtn.getAttribute('data-lang') || 'en';
        }
        return localStorage.getItem('preferredLanguage') || 'en';
    }

    nextQuote() {
        if (!this.isDataLoaded || this.quotesData.length === 0) return;
        
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotesData.length;
        this.updateContent();
    }

    startAutoRotate() {
        // Change quote every 15 seconds
        setInterval(() => {
            this.nextQuote();
        }, 15000);
    }

    like() {
        this.likeCount++;
        this.updateContent();
        this.saveLikeCount();
        
        const likeBtn = document.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.classList.add('liked');
            setTimeout(() => {
                likeBtn.classList.remove('liked');
            }, 600);
        }
    }

    share() {
        if (!this.isDataLoaded || this.quotesData.length === 0) return;
        
        const currentQuote = this.quotesData[this.currentQuoteIndex];
        const currentLanguage = this.getCurrentLanguage();
        const content = currentQuote[currentLanguage] || currentQuote.en;
        
        const shareText = `${content.title}\n\n"${content.shayari}"\n\n- Deepak Chauhan × AI Bhai ♥️\n\nShared via DK Community`;

        if (navigator.share) {
            navigator.share({
                title: content.title,
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Quote copied to clipboard! 📋');
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff0080, #7928ca);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-family: 'Poppins', sans-serif;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    loadLikeCount() {
        const savedLikes = localStorage.getItem('motivationalBoxLikes');
        if (savedLikes) {
            this.likeCount = parseInt(savedLikes);
        }
    }

    saveLikeCount() {
        localStorage.setItem('motivationalBoxLikes', this.likeCount.toString());
    }
}

// Global functions
function likeMotivationalBox() {
    if (window.motivationalBoxInstance) {
        window.motivationalBoxInstance.like();
    }
}

function shareMotivationalBox() {
    if (window.motivationalBoxInstance) {
        window.motivationalBoxInstance.share();
    }
}

function nextMotivationalQuote() {
    if (window.motivationalBoxInstance) {
        window.motivationalBoxInstance.nextQuote();
    }
}

// CSS for animations
const motivationalBoxStyles = document.createElement('style');
motivationalBoxStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .like-btn.liked {
        animation: heartBeat 0.6s ease;
    }
    @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.1); }
        50% { transform: scale(0.9); }
        75% { transform: scale(1.1); }
    }
`;
document.head.appendChild(motivationalBoxStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.motivationalBoxInstance = new HomeMotivationalBox();
});
