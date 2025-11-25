// trending-stories.js - With Auto Update System
console.log('🔥 scripts/trending-stories.js loaded successfully!');

class TrendingStoriesPopup {
    constructor() {
        console.log('🔧 Constructor called - looking for elements...');
        
        this.popup = document.getElementById('trendingPopup');
        this.openBtn = document.getElementById('trendingStoriesBtn');
        this.closeBtn = document.getElementById('closeTrendingPopup');
        this.loadMoreBtn = document.getElementById('loadMoreStories');
        this.storiesGrid = document.getElementById('storiesGrid');
        this.storiesCount = document.getElementById('storiesCount');
        
        console.log('Popup found:', !!this.popup);
        console.log('Open button found:', !!this.openBtn);
        
        if (!this.popup || !this.openBtn) {
            console.error('❌ Required elements not found!');
            return;
        }
        
        this.currentLanguage = 'en';
        this.stories = [];
        this.displayedStoryIds = new Set();
        this.storiesPerPage = 5; // 🔥 Multiple stories
        this.allStories = [];
        this.lastUpdateTime = null;
        this.updateInterval = null;
        
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Trending Stories Popup...');
        await this.loadStoriesFromJSON();
        this.setupEventListeners();
        this.startAutoUpdate();
        console.log('✅ Trending Stories Popup Ready!');
    }

    // 🔥 AUTO UPDATE SYSTEM
    startAutoUpdate() {
        // हर 2 मिनट में automatically check for updates
        this.updateInterval = setInterval(async () => {
            console.log('🔄 Auto-checking for JSON updates...');
            await this.checkForUpdates();
        }, 2 * 60 * 1000); // 2 minutes
        
        console.log('🔄 Auto-update system started (every 2 minutes)');
    }

    async checkForUpdates() {
        try {
            const response = await fetch('https://deepakchauhanxai.xyz/testing-dk/assets/trending-stories.json?v=' + Date.now());
            
            if (!response.ok) return;
            
            const data = await response.json();
            const newStories = data.stories || [];
            
            // Check if new stories are available
            if (this.hasNewStories(newStories)) {
                console.log('🆕 New stories found! Updating...');
                this.allStories = newStories;
                this.displayedStoryIds.clear(); // Reset displayed stories
                
                // If popup is open, refresh the stories
                if (this.popup.classList.contains('active')) {
                    this.stories = this.getRandomStories(this.storiesPerPage);
                    this.renderStories();
                    this.showNotification('New stories updated! 🎉');
                }
                
                this.lastUpdateTime = Date.now();
            }
        } catch (error) {
            console.log('❌ Auto-update check failed:', error);
        }
    }

    hasNewStories(newStories) {
        if (newStories.length !== this.allStories.length) return true;
        
        // Check if any story content has changed
        for (let i = 0; i < newStories.length; i++) {
            const newStory = newStories[i];
            const oldStory = this.allStories[i];
            
            if (!oldStory || newStory.id !== oldStory.id || 
                JSON.stringify(newStory.content) !== JSON.stringify(oldStory.content)) {
                return true;
            }
        }
        
        return false;
    }

    async loadStoriesFromJSON() {
        try {
            console.log('📁 Loading stories from JSON...');
            
            const paths = [
                'https://deepakchauhanxai.xyz/testing-dk/assets/trending-stories.json?v=' + Date.now(),
                'https://deepakchauhanxai.xyz/testing/data/trending-stories.json?v=' + Date.now()
            ];
            
            let response;
            
            for (const path of paths) {
                try {
                    console.log(`🔍 Trying JSON path: ${path}`);
                    response = await fetch(path);
                    if (response.ok) {
                        console.log(`✅ JSON found at: ${path}`);
                        break;
                    }
                } catch (e) {
                    console.log(`❌ Path failed: ${path}`, e.message);
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error('All JSON paths failed');
            }
            
            const data = await response.json();
            this.allStories = data.stories || [];
            this.lastUpdateTime = Date.now();
            
            console.log(`✅ Stories loaded: ${this.allStories.length} stories`);
            
            if (this.allStories.length === 0) {
                throw new Error('JSON loaded but no stories found');
            }
            
        } catch (error) {
            console.error('❌ Error loading JSON:', error);
            console.log('🔄 Using fallback stories data');
            this.loadFallbackStories();
        }
    }

    loadFallbackStories() {
        console.log('📝 Loading fallback stories...');
        
        this.allStories = [
            {
                id: 1,
                user: {
                    name: "Deepak Chauhan",
                    role: "Founder - DK Community",
                    avatar: "https://deepakchauhanxai.xyz/images/dk-community.jpg"
                },
                content: {
                    en: "Just launched our new AI-powered image sharing platform! 🚀 The response has been amazing with over 10K users in first week.",
                    hi: "हमने नया AI-powered image sharing platform लॉन्च किया है! 🚀 पहले ही हफ्ते में 10K+ users का amazing response मिला।",
                    ur: "ہم نے نیا AI-powered image sharing platform لانچ کیا ہے! 🚀 پہلے ہفتے میں 10K+ users کا زبردست response ملا۔"
                },
                tags: ["launch", "success", "ai", "community"]
            },
            {
                id: 2,
                user: {
                    name: "AI Bhai", 
                    role: "Artificial Intelligence",
                    avatar: "https://deepakchauhanxai.xyz/images/AI-bhai.png"
                },
                content: {
                    en: "Analyzed user behavior patterns and found that motivational content gets 3x more engagement! 💡",
                    hi: "User behavior patterns analyze करके पाया कि motivational content को 3x ज्यादा engagement मिलता है! 💡",
                    ur: "User behavior patterns کا تجزیہ کرکے پتہ چلا کہ motivational content کو 3x زیادہ engagement ملتا ہے! 💡"
                },
                tags: ["analysis", "insights", "motivation", "ai"]
            },
            {
                id: 3,
                user: {
                    name: "DK Community",
                    role: "Brand Official", 
                    avatar: "https://deepakchauhanxai.xyz/images/dk-community.jpg"
                },
                content: {
                    en: "New feature alert! 🎉 Now you can download images directly and share across social media platforms.",
                    hi: "New feature alert! 🎉 अब आप directly images download कर सकते हैं और social media पर share कर सकते हैं।",
                    ur: "New feature alert! 🎉 اب آپ براہ راست images ڈاؤن لوڈ کر سکتے ہیں اور سوشل میڈیا پر شیئر کر سکتے ہیں۔"
                },
                tags: ["feature", "update", "download", "share"]
            },
            {
                id: 4,
                user: {
                    name: "Deepak Chauhan",
                    role: "Visionary Leader",
                    avatar: "https://deepakchauhanxai.xyz/images/dk-community.jpg"
                },
                content: {
                    en: "Human + AI collaboration is the future! Together we're creating something truly amazing. 🤝",
                    hi: "Human + AI collaboration भविष्य है! साथ मिलकर हम कुछ truly amazing create कर रहे हैं। 🤝",
                    ur: "Human + AI collaboration مستقبل ہے! مل کر ہم کچھ واقعی حیرت انگیز تخلیق کر رہے ہیں۔ 🤝"
                },
                tags: ["collaboration", "future", "innovation", "teamwork"]
            },
            {
                id: 5,
                user: {
                    name: "AI Bhai",
                    role: "Machine Learning",
                    avatar: "https://deepakchauhanxai.xyz/images/AI-bhai.png"
                },
                content: {
                    en: "Just processed 50K+ images through our AI system. The learning never stops! 🧠",
                    hi: "हमारे AI system ने 50K+ images process की। Learning कभी नहीं रुकती! 🧠", 
                    ur: "ہمارے AI system نے 50K+ images پراسیس کی۔ سیکھنا کبھی نہیں رکتا! 🧠"
                },
                tags: ["processing", "learning", "scale", "technology"]
            }
        ];
        
        console.log('✅ Fallback stories loaded:', this.allStories.length);
    }

    getRandomStories(count) {
        const availableStories = this.allStories.filter(story => 
            !this.displayedStoryIds.has(story.id)
        );

        if (availableStories.length === 0) {
            console.log('🔄 All stories shown, resetting...');
            this.displayedStoryIds.clear();
            return this.allStories.slice(0, count);
        }

        const shuffled = [...availableStories].sort(() => 0.5 - Math.random());
        const selectedStories = shuffled.slice(0, Math.min(count, availableStories.length));

        selectedStories.forEach(story => {
            this.displayedStoryIds.add(story.id);
        });

        return selectedStories;
    }

    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => {
                console.log('🔥 Open button clicked');
                this.openPopup();
            });
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                console.log('❌ Close button clicked');
                this.closePopup();
            });
        }
        
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                console.log('🔄 Load more clicked');
                this.loadMoreStories();
            });
        }
        
        if (this.popup) {
            this.popup.addEventListener('click', (e) => {
                if (e.target === this.popup) {
                    console.log('🎯 Overlay clicked');
                    this.closePopup();
                }
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                console.log('⌨️ Escape key pressed');
                this.closePopup();
            }
        });
        
        console.log('✅ All event listeners setup');
    }

    openPopup() {
        console.log('🎯 Opening popup...');
        
        if (window.trendingStoriesLanguage) {
            this.currentLanguage = window.trendingStoriesLanguage.currentLanguage;
            console.log('🌐 Current language from handler:', this.currentLanguage);
        }
        
        // 🔥 Multiple stories load करो
        this.stories = this.getRandomStories(this.storiesPerPage);
        console.log('🎲 Selected stories:', this.stories.map(s => s.id));
        
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.renderStories();
        this.updateStats();
        console.log('✅ Popup opened successfully');
    }

    closePopup() {
        console.log('🎯 Closing popup...');
        this.popup.classList.remove('active');
        document.body.style.overflow = '';
        console.log('✅ Popup closed successfully');
    }

    renderStories() {
        if (!this.storiesGrid) {
            console.error('❌ Stories grid not found');
            return;
        }

        console.log('🎨 Rendering stories in language:', this.currentLanguage);
        this.storiesGrid.innerHTML = '';

        this.stories.forEach((story) => {
            const content = story.content[this.currentLanguage] || story.content.en;
            
            const storyHTML = `
                <div class="story-card">
                    <div class="story-header">
                        <div class="story-avatar">
                            <img src="${story.user.avatar}" alt="${story.user.name}" 
                                 onerror="this.src='https://deepakchauhanxai.xyz/images/AI-bhai.png'">
                        </div>
                        <div class="story-user-info">
                            <h4>${story.user.name}</h4>
                            <p>${story.user.role}</p>
                        </div>
                    </div>
                    
                    <div class="story-content">
                        ${content}
                    </div>
                    
                    <div class="story-tags">
                        ${story.tags.map(tag => `<span class="story-tag">#${tag}</span>`).join('')}
                    </div>
                    
                    <div class="story-actions">
                        <button class="story-action-btn share-btn" onclick="window.trendingPopup.shareStory(${story.id})">
                            <span>📤</span>
                            <span data-lang="en">Share</span>
                            <span data-lang="hi">शेयर</span>
                            <span data-lang="ur">شیئر</span>
                        </button>
                        <button class="story-action-btn copy-btn" onclick="window.trendingPopup.copyStory(${story.id})">
                            <span>📋</span>
                            <span data-lang="en">Copy</span>
                            <span data-lang="hi">कॉपी</span>
                            <span data-lang="ur">کاپی</span>
                        </button>
                    </div>
                </div>
            `;
            
            this.storiesGrid.innerHTML += storyHTML;
        });

        this.updateLanguageTexts();
        this.updateLoadMoreButton();
        console.log('✅ Stories rendered successfully');
    }

    updateLanguageTexts() {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            element.style.display = 'none';
        });

        const currentLangElements = document.querySelectorAll(`[data-lang="${this.currentLanguage}"]`);
        currentLangElements.forEach(element => {
            element.style.display = 'inline';
        });
    }

    shareStory(storyId) {
        const story = this.allStories.find(s => s.id === storyId);
        if (!story) return;

        const content = story.content[this.currentLanguage] || story.content.en;
        const shareText = `${story.user.name}: ${content}`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: 'DK Community Story',
                text: shareText,
                url: shareUrl,
            }).then(() => {
                this.showNotification('Story shared successfully! 📤');
            }).catch(() => {
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyStory(storyId) {
        const story = this.allStories.find(s => s.id === storyId);
        if (!story) return;

        const content = story.content[this.currentLanguage] || story.content.en;
        const copyText = `${story.user.name}: ${content}`;
        
        this.copyToClipboard(copyText);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard! 📋');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Copied to clipboard! 📋');
        });
    }

    loadMoreStories() {
        console.log('🔄 Loading more stories...');
        const moreStories = this.getRandomStories(this.storiesPerPage);
        this.stories = [...this.stories, ...moreStories];
        this.renderStories();
        this.showNotification('More stories loaded! ✨');
    }

    updateStats() {
        const totalStories = this.allStories.length;
        if (this.storiesCount) this.storiesCount.textContent = totalStories;
    }

    updateLoadMoreButton() {
        if (this.displayedStoryIds.size >= this.allStories.length) {
            this.loadMoreBtn.style.display = 'none';
            this.showNotification('All stories loaded! 🎉');
        } else {
            this.loadMoreBtn.style.display = 'flex';
        }
    }

    showNotification(message) {
        const existingNotification = document.querySelector('.story-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'story-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
            font-family: 'Segoe UI', 'Inter', sans-serif;
        `;
        
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

    // Cleanup on destroy
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Global functions
function openTrendingStories() {
    console.log('🌍 Global function openTrendingStories called');
    
    if (window.trendingPopup) {
        window.trendingPopup.openPopup();
    } else {
        console.log('🔄 Creating new instance');
        window.trendingPopup = new TrendingStoriesPopup();
        setTimeout(() => {
            if (window.trendingPopup) {
                window.trendingPopup.openPopup();
            }
        }, 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - Initializing Trending Stories');
    window.trendingPopup = new TrendingStoriesPopup();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.trendingPopup) {
        window.trendingPopup.destroy();
    }
});

console.log('✅ trending-stories.js execution complete');
