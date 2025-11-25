// trending-stories.js - Main functionality only
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
        this.viewsCount = document.getElementById('viewsCount');
        this.likesCount = document.getElementById('likesCount');
        
        console.log('Popup found:', !!this.popup);
        console.log('Open button found:', !!this.openBtn);
        console.log('Close button found:', !!this.closeBtn);
        console.log('Stories grid found:', !!this.storiesGrid);
        
        if (!this.popup || !this.openBtn) {
            console.error('❌ Required elements not found!');
            return;
        }
        
        // Language will be handled by trending-stories-language.js
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
        // Same fallback stories as before...
        this.allStories = [
            // Your existing fallback stories here...
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
        
        // Get current language from language handler
        if (window.trendingStoriesLanguage) {
            this.currentLanguage = window.trendingStoriesLanguage.currentLanguage;
            console.log('🌐 Current language from handler:', this.currentLanguage);
        } else {
            console.log('⚠️ Language handler not available, using default');
        }
        
        // 3 random stories select karo
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
                                 onerror="this.src='images/AI-bhai.png'">
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
                    
                    <div class="story-stats">
                        <div class="story-stat">
                            <span>👁️</span>
                            <span>${this.formatNumber(story.stats.views)}</span>
                        </div>
                        <div class="story-stat">
                            <span>❤️</span>
                            <span>${this.formatNumber(story.stats.likes)}</span>
                        </div>
                        <div class="story-stat">
                            <span>📤</span>
                            <span>${this.formatNumber(story.stats.shares)}</span>
                        </div>
                        <div class="story-stat">
                            <span>📅</span>
                            <span>${this.formatDate(story.stats.timestamp)}</span>
                        </div>
                    </div>
                </div>
            `;
            
            this.storiesGrid.innerHTML += storyHTML;
        });

        this.updateStats();
        this.updateLoadMoreButton();
        console.log('✅ Stories rendered successfully');
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
        const totalViews = this.allStories.reduce((sum, story) => sum + story.stats.views, 0);
        const totalLikes = this.allStories.reduce((sum, story) => sum + story.stats.likes, 0);

        if (this.storiesCount) this.storiesCount.textContent = totalStories;
        if (this.viewsCount) this.viewsCount.textContent = this.formatNumber(totalViews);
        if (this.likesCount) this.likesCount.textContent = this.formatNumber(totalLikes);
    }

    updateLoadMoreButton() {
        if (this.displayedStoryIds.size >= this.allStories.length) {
            this.loadMoreBtn.style.display = 'none';
            this.showNotification('All stories loaded! 🎉');
        } else {
            this.loadMoreBtn.style.display = 'flex';
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }

    showNotification(message) {
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
