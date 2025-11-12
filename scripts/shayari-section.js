// Motivational Shayari Section with Random Feature
class ShayariSection {
    constructor() {
        this.currentLanguage = this.getStoredLanguage();
        this.currentSlide = 0;
        this.shayarisData = [];
        this.isMobileView = window.innerWidth <= 768;
        this.displayedIndices = new Set(); // Track displayed shayaris
        
        this.init();
    }

    async init() {
        await this.loadShayaris();
        this.setupRandomOrder();
        this.renderShayaris();
        this.setupEventListeners();
        this.setupLanguageListener();
        this.handleResize();
        console.log('✅ Shayari Section Initialized!');
    }

    async loadShayaris() {
        try {
            console.log('📁 Loading shayaris from JSON...');
            
            const response = await fetch('./assets/motivational-shayari.json');
            
            if (!response.ok) {
                throw new Error('JSON not found');
            }
            
            const data = await response.json();
            console.log('✅ JSON loaded successfully');
            this.shayarisData = data.shayaris;
            
        } catch (error) {
            console.error('❌ Error loading JSON:', error);
            console.log('🔄 Using fallback shayaris data');
            this.loadFallbackShayaris();
        }
    }

    loadFallbackShayaris() {
        this.shayarisData = [
            {
                id: 1,
                en: {
                    shayari: "The mountains that seem high today, will become steps of your success tomorrow. Keep climbing!",
                    signature: "Deepak Chauhan × AI Bhai ♥️"
                },
                hi: {
                    shayari: "आज जो पहाड़ ऊंचे लगते हैं, कल वो आपकी सफलता की सीढ़ियां बन जाएंगे। चलते रहो!",
                    signature: "दीपक चौहान × AI भाई ♥️"
                }
            },
            {
                id: 2,
                en: {
                    shayari: "Your dreams are not too big, your efforts are just too small. Dream bigger, work harder!",
                    signature: "Deepak Chauhan × AI Bhai ♥️"
                },
                hi: {
                    shayari: "आपके सपने बहुत बड़े नहीं हैं, आपके प्रयास बस थोड़े छोटे हैं। बड़े सपने देखो, ज्यादा मेहनत करो!",
                    signature: "दीपक चौहान × AI भाई ♥️"
                }
            },
            {
                id: 3,
                en: {
                    shayari: "The night is darkest just before dawn. Your success story is being written in these struggles.",
                    signature: "Deepak Chauhan × AI Bhai ♥️"
                },
                hi: {
                    shayari: "सुबह होने से पहले रात सबसे अंधेरी होती है। आपकी सफलता की कहानी इन्हीं संघर्षों में लिखी जा रही है।",
                    signature: "दीपक चौहान × AI भाई ♥️"
                }
            },
            {
                id: 4,
                en: {
                    shayari: "Don't wait for the perfect moment. Take this moment and make it perfect. Start now!",
                    signature: "Deepak Chauhan × AI Bhai ♥️"
                },
                hi: {
                    shayari: "सही मौके का इंतज़ार मत करो। इस पल को लो और इसे सही बनाओ। अभी शुरू करो!",
                    signature: "दीपक चौहान × AI भाई ♥️"
                }
            },
            {
                id: 5,
                en: {
                    shayari: "You are not here to be ordinary. You are here to create magic. Believe in yourself!",
                    signature: "Deepak Chauhan × AI Bhai ♥️"
                },
                hi: {
                    shayari: "आप यहाँ साधारण बनने के लिए नहीं हैं। आप यहाँ जादू रचने के लिए हैं। खुद पर विश्वास रखो!",
                    signature: "दीपक चौहान × AI भाई ♥️"
                }
            }
        ];
    }

    setupRandomOrder() {
        // Reset displayed indices
        this.displayedIndices.clear();
        
        // Select 3 random unique shayaris
        this.currentShayaris = this.getRandomShayaris(3);
    }

    getRandomShayaris(count) {
        const availableIndices = Array.from({length: this.shayarisData.length}, (_, i) => i)
            .filter(i => !this.displayedIndices.has(i));
        
        // If we don't have enough unique shayaris, reset
        if (availableIndices.length < count) {
            this.displayedIndices.clear();
            return this.shayarisData.slice(0, count);
        }
        
        const randomIndices = [];
        while (randomIndices.length < count && availableIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
            randomIndices.push(selectedIndex);
            this.displayedIndices.add(selectedIndex);
        }
        
        return randomIndices.map(index => this.shayarisData[index]);
    }

    renderShayaris() {
        const container = document.getElementById('shayariContainer');
        const currentSlideEl = document.getElementById('currentSlide');
        const totalSlidesEl = document.getElementById('totalSlides');
        
        if (!container) {
            console.error('❌ shayariContainer not found!');
            return;
        }

        container.innerHTML = '';

        if (!this.currentShayaris || this.currentShayaris.length === 0) {
            container.innerHTML = `
                <div class="shayari-card active" style="text-align: center;">
                    <div class="shayari-text">No shayaris available.</div>
                </div>
            `;
            return;
        }

        // Update counter
        if (currentSlideEl && totalSlidesEl) {
            currentSlideEl.textContent = this.currentSlide + 1;
            totalSlidesEl.textContent = this.currentShayaris.length;
        }

        // Create shayari cards
        this.currentShayaris.forEach((shayari, index) => {
            const content = shayari[this.currentLanguage] || shayari.en;
            
            const cardHTML = `
                <div class="shayari-card ${index === this.currentSlide ? 'active' : ''}" 
                     data-index="${index}">
                    <div class="card-number">${index + 1}</div>
                    <div class="shayari-text">"${content.shayari}"</div>
                    <div class="shayari-signature">- ${content.signature}</div>
                    <div class="shayari-actions">
                        <button class="shayari-action-btn copy-btn" onclick="copyShayari(${index})">
                            📋 Copy
                        </button>
                        <button class="shayari-action-btn share-btn" onclick="shareShayari(${index})">
                            📤 Share
                        </button>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

        this.updateNavigation();
    }

    updateNavigation() {
        const dotsContainer = document.getElementById('shayariDots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        this.currentShayaris.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === this.currentSlide ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prevShayari');
        const nextBtn = document.getElementById('nextShayari');
        const refreshBtn = document.getElementById('refreshShayari');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshShayaris());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        this.setupSwipe();
    }

    setupLanguageListener() {
        // Listen for language changes from existing buttons
        document.addEventListener('languageChanged', (event) => {
            this.currentLanguage = event.detail?.language || this.getStoredLanguage();
            this.renderShayaris();
        });

        // Also listen to existing language buttons
        const langButtons = document.querySelectorAll('[data-lang]');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.currentLanguage = lang;
                localStorage.setItem('preferredLanguage', lang);
                this.renderShayaris();
            });
        });
    }

    getStoredLanguage() {
        return localStorage.getItem('preferredLanguage') || 'en';
    }

    setupSwipe() {
        if (!this.isMobileView) return;
        
        let startX = 0;
        const container = document.getElementById('shayariContainer');

        if (!container) return;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', (e) => {
            if (!startX) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            startX = 0;
        });
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.isMobileView = window.innerWidth <= 768;
            this.renderShayaris();
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.currentShayaris.length;
        this.renderShayaris();
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.currentShayaris.length) % this.currentShayaris.length;
        this.renderShayaris();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.renderShayaris();
    }

    refreshShayaris() {
        console.log('🔄 Refreshing with new random shayaris');
        this.setupRandomOrder();
        this.currentSlide = 0;
        this.renderShayaris();
        showNotification('New motivational shayaris loaded! ✨');
    }
}

// Global functions
function copyShayari(index) {
    const shayariSection = window.shayariInstance;
    if (!shayariSection) return;

    const shayari = shayariSection.currentShayaris[index];
    const content = shayari[shayariSection.currentLanguage] || shayari.en;
    const text = `"${content.shayari}"\n\n- ${content.signature}`;

    navigator.clipboard.writeText(text).then(() => {
        showNotification('Shayari copied to clipboard! 📋');
    }).catch(() => {
        showNotification('Failed to copy shayari');
    });
}

function shareShayari(index) {
    const shayariSection = window.shayariInstance;
    if (!shayariSection) return;

    const shayari = shayariSection.currentShayaris[index];
    const content = shayari[shayariSection.currentLanguage] || shayari.en;
    const text = `"${content.shayari}"\n\n- ${content.signature}\n\nShared via DK Community`;

    if (navigator.share) {
        navigator.share({
            title: 'Motivational Shayari',
            text: text
        });
    } else {
        copyShayari(index);
    }
}

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.shayariInstance = new ShayariSection();
});