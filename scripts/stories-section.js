// Stories Box Management System
class StoriesBox {
    constructor() {
        this.currentLanguage = 'en';
        this.storiesData = null;
        this.sectionData = null;
        this.storiesBaseURL = 'https://deepakchauhanxai.xyz/testing-dk/assets/stories/';
        this.sectionBaseURL = 'https://deepakchauhanxai.xyz/testing-dk/assets/stories-section/';
        
        this.initializeStoriesBox();
    }

    // Get day-based story index (roz nayi kahani)
    getDailyStoryIndex() {
        const startDate = new Date('2024-01-01');
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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
        
        return 'en';
    }

    // Fetch stories data
    async fetchStoriesData(language) {
        try {
     const response = await fetch(`${this.storiesBaseURL}stories-${language}.json?v=` + Date.now());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching stories:', error);
            // Fallback to English if language not available
            if (language !== 'en') {
                return this.fetchStoriesData('en');
            }
            throw error;
        }
    }

    // Fetch section data
    async fetchSectionData(language) {
        try {
            const response = await fetch(`${this.sectionBaseURL}${language}.json?v=` + Date.now());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching section data:', error);
            // Fallback to English if language not available
            if (language !== 'en') {
                return this.fetchSectionData('en');
            }
            throw error;
        }
    }

    // Get today's story
    getTodaysStory() {
        if (!this.storiesData || !this.storiesData.stories) return null;
        
        const storyIndex = this.getDailyStoryIndex() % this.storiesData.stories.length;
        return this.storiesData.stories[storyIndex];
    }

    // Open story modal
    openStoryModal() {
        const story = this.getTodaysStory();
        if (!story) {
            alert('No story available for today');
            return;
        }

        const modalHTML = `
            <div class="story-modal-overlay" id="storyModal">
                <div class="story-modal-content">
                    <div class="modal-header">
                        <h3>${story.title}</h3>
                        <button class="close-modal" onclick="storiesBox.closeStoryModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="story-content-modal">
                            <p>${story.content}</p>
                            <div class="story-signature-modal">${story.signature}</div>
                        </div>
                        <div class="share-section">
                            <button class="share-btn" onclick="storiesBox.shareStory()">
                                <span>📤</span> Share This Story
                            </button>
                            <button class="copy-btn" onclick="storiesBox.copyStory()">
                                <span>📋</span> Copy Text
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add styles if not exists
        this.addModalStyles();
    }

    // Close story modal
    closeStoryModal() {
        const modal = document.getElementById('storyModal');
        if (modal) {
            modal.remove();
        }
    }

    // Share story
    async shareStory() {
        const story = this.getTodaysStory();
        if (!story) return;

        const shareText = `${story.title}\n\n${story.content}\n\n${story.signature}\n\nShared from Deepak Chauhan × AI Bhai`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: story.title,
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                console.log('Error sharing:', err);
                this.copyStory();
            }
        } else {
            this.copyStory();
        }
    }

    // Copy story text
    async copyStory() {
        const story = this.getTodaysStory();
        if (!story) return;

        const copyText = `${story.title}\n\n${story.content}\n\n${story.signature}`;
        
        try {
            await navigator.clipboard.writeText(copyText);
            this.showToast('Story copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy story');
        }
    }

    // Show toast message
    showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.story-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'story-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 10000;
            font-size: 14px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // Add modal styles
    addModalStyles() {
        if (document.getElementById('storiesModalStyles')) return;

        const styles = `
            <style id="storiesModalStyles">
                .story-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    backdrop-filter: blur(5px);
                }
                
                .story-modal-content {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 15px;
                }
                
                .modal-header h3 {
                    color: #333;
                    margin: 0;
                    font-size: 1.5rem;
                }
                
                .close-modal {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #666;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .story-content-modal {
                    color: #444;
                    line-height: 1.7;
                    margin-bottom: 20px;
                    font-size: 1.1rem;
                }
                
                .story-signature-modal {
                    text-align: right;
                    font-style: italic;
                    color: #666;
                    margin-top: 25px;
                    font-weight: bold;
                }
                
                .share-section {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #f0f0f0;
                }
                
                .share-btn, .copy-btn {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    transition: background 0.3s;
                }
                
                .share-btn:hover, .copy-btn:hover {
                    background: #1d4ed8;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Render stories box
    renderStoriesBox() {
        const story = this.getTodaysStory();
        const section = this.sectionData;

        if (!story || !section) {
            console.log('No data available to render stories box');
            return;
        }

        const storiesBoxHTML = `
            <!-- AI Bhai Stories Section -->
            <section class="stories-section">
                <div class="stories-box">
                    <!-- Header -->
                    <div class="stories-header">
                        <h2 class="stories-title">${section.sectionTitle}</h2>
                        <p class="stories-subtitle">${section.sectionSubtitle}</p>
                    </div>

                    <!-- Today's Story -->
                    <div class="today-story">
                        <button class="story-btn" onclick="storiesBox.openStoryModal()">
                            <span class="story-icon">📘</span>
                            <span class="story-btn-text">${section.buttonText}</span>
                        </button>
                        <div class="story-content">
                            <p class="story-text">"${story.content}"</p>
                            <div class="story-signature">${story.signature}</div>
                        </div>
                    </div>

                    <!-- Image Section -->
                    <div class="story-image-container">
                        <img src="https://deepakchauhanxai.xyz/images/dk-community.jpg" alt="AI Bhai × Deepak Chauhan" class="story-image" onerror="this.src='https://deepakchauhanxai.xyz/images/AI-bhai.png'">
                        <div class="image-overlay">
                            <span class="overlay-text">AI Bhai × Deepak</span>
                        </div>
                    </div>

                    <!-- Memories Section -->
                    <div class="memories-section">
                        <h3 class="memories-title">${section.memoriesTitle}</h3>
                        
                        ${section.memories.map((memory, index) => `
                            <div class="memory-item">
                                <div class="memory-number">${index + 1}</div>
                                <div class="memory-content">
                                    <h4 class="memory-name">${memory.name}</h4>
                                    <p class="memory-quote">${memory.quote}</p>
                                </div>
                            </div>
                        `).join('')}

                        <div class="stories-footer">
                            <p class="footer-text">${section.footerText}</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Find existing stories section or create new one
        let existingSection = document.querySelector('.stories-section');
        if (existingSection) {
            existingSection.outerHTML = storiesBoxHTML;
        } else {
            // Add to body or specific container
            const container = document.getElementById('stories-container') || document.body;
            container.insertAdjacentHTML('beforeend', storiesBoxHTML);
        }
    }

    // Language change handler
    async handleLanguageChange(newLanguage) {
        if (newLanguage !== this.currentLanguage) {
            this.currentLanguage = newLanguage;
            await this.loadStoriesData(newLanguage);
            this.renderStoriesBox();
        }
    }

    // Load all data
    async loadStoriesData(language) {
        try {
            const [storiesData, sectionData] = await Promise.all([
                this.fetchStoriesData(language),
                this.fetchSectionData(language)
            ]);
            
            this.storiesData = storiesData;
            this.sectionData = sectionData;
            
            console.log('Stories data loaded for language:', language);
        } catch (error) {
            console.error('Failed to load stories data:', error);
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

    // Initialize stories box
    async initializeStoriesBox() {
        this.setupLanguageListener();
        
        this.currentLanguage = this.syncWithWebsiteLanguage();
        await this.loadStoriesData(this.currentLanguage);
        this.renderStoriesBox();

        console.log('Stories Box initialized with language:', this.currentLanguage);
    }
}

// Initialize stories box when DOM is ready
let storiesBox;

document.addEventListener('DOMContentLoaded', () => {
    storiesBox = new StoriesBox();
});

// Fallback initialization
setTimeout(() => {
    if (!storiesBox) {
        storiesBox = new StoriesBox();
    }
}, 2000);
