// trending-stories.js - Clean Design with Share & Copy Only
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
        console.log('Close button found:', !!this.closeBtn);
        console.log('Stories grid found:', !!this.storiesGrid);
        
        if (!this.popup || !this.openBtn) {
            console.error('❌ Required elements not found!');
            return;
        }
        
        this.currentLanguage = 'en';
        this.stories = [];
        this.displayedStoryIds = new Set();
        this.storiesPerPage = 3;
        this.allStories = [];
        
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Trending Stories Popup...');
        await this.loadStoriesFromJSON();
        this.setupEventListeners();
        this.updateStats();
        console.log('✅ Trending Stories Popup Ready!');
    }

    async loadStoriesFromJSON() {
        try {
            console.log('📁 Loading stories from JSON...');
            
            const paths = [
                'https://deepakchauhanxai.xyz/testing-dk/assets/trending-stories.json',
                'https://deepakchauhanxai.xyz/testing/data/trending-stories.json',
                '/testing-dk/assets/trending-stories.json'
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
            this.allStories = data.stories;
            console.log(`✅ Stories loaded from JSON: ${this.allStories.length} stories`);
            
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

        if (availableStories.length < count) {
            console.log('🔄 Resetting displayed stories');
            this.displayedStoryIds.clear();
            return this.allStories.slice(0, count);
        }

        const shuffled = [...availableStories].sort(() => 0.5 - Math.random());
        const selectedStories = shuffled.slice(0, count);

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
        } else {
            console.log('⚠️ Language handler not available, using default');
        }
        
        this.stories = this.getRandomStories(this.storiesPerPage);
        console.log('🎲 Selected random stories:', this.stories.map(s => s.id));
        
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.renderStories();
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
                    
                    <!-- 🔥 ONLY SHARE & COPY BUTTONS -->
                    <div class="story-actions">
                        <button class="story-action-btn share-btn" onclick="trendingPopup.shareStory(${story.id})">
                            <span>📤</span>
                            <span data-lang="en">Share</span>
                            <span data-lang="hi">शेयर</span>
                            <span data-lang="ur">شیئر</span>
                        </button>
                        <button class="story-action-btn copy-btn" onclick="trendingPopup.copyStory(${story.id})">
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
        this.updateStats();
        this.updateLoadMoreButton();
        console.log('✅ Stories rendered successfully');
    }

    // 🔥 SHARE STORY FUNCTION
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

    // 🔥 COPY STORY FUNCTION
    copyStory(storyId) {
        const story = this.allStories.find(s => s.id === storyId);
        if (!story) return;

        const content = story.content[this.currentLanguage] || story.content.en;
        const copyText = `${story.user.name}: ${content}`;
        
        this.copyToClipboard(copyText);
    }

    // 🔥 COPY TO CLIPBOARD
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard! 📋');
        }).catch(() => {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Copied to clipboard! 📋');
        });
    }

    updateLanguageTexts() {
        // Update all language texts in the popup
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            element.style.display = 'none';
        });

        const currentLangElements = document.querySelectorAll(`[data-lang="${this.currentLanguage}"]`);
        currentLangElements.forEach(element => {
            element.style.display = 'inline';
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
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
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

setTimeout(() => {
    if (!window.trendingPopup) {
        console.log('🔄 Fallback initialization');
        window.trendingPopup = new TrendingStoriesPopup();
    }
}, 1000);

console.log('✅ trending-stories.js execution complete');
