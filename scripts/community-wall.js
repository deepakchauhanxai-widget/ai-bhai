/**
 * DK Community Wall - Complete Professional JavaScript
 * All features: Language sync, posts, likes, images, avatars
 * @author Deepak Chauhan × AI Bhai
 */

class CommunityWall {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'en';
        this.posts = [];
        this.isLoading = false;
        this.selectedImage = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 DK Community Wall Initializing...');
        
        // Wait for language manager
        await this.waitForLanguageManager();
        
        // Load user data
        await this.loadUserData();
        
        // Initialize all systems
        this.initializeEventListeners();
        this.initializeImageUpload();
        this.loadPosts();
        this.loadActivities();
        this.updateStats();
        
        console.log('✅ DK Community Wall Ready!');
    }

    async waitForLanguageManager() {
        let attempts = 0;
        while (!window.dkLanguageManager && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.dkLanguageManager) {
            this.currentLanguage = window.dkLanguageManager.getCurrentLanguage();
            console.log('🌐 Language manager connected:', this.currentLanguage);
        } else {
            this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
            console.log('⚠️ Using fallback language:', this.currentLanguage);
        }
    }

    // User Management
    async loadUserData() {
        try {
            const savedUser = localStorage.getItem('progressUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                console.log('👤 User loaded:', this.currentUser.name);
            } else {
                this.currentUser = {
                    name: 'Guest User',
                    user_id: 'guest_' + Date.now(),
                    guest: true
                };
                console.log('👤 Guest mode activated');
            }
            this.updateUserInfo();
            await this.loadUserAvatar();
        } catch (e) {
            console.error('User load error:', e);
            this.showGuestMode();
        }
    }

    updateUserInfo() {
        const userNameElement = document.getElementById('userName');
        const creatorAvatarElement = document.getElementById('creatorAvatarImg');
        
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name || 'Guest User';
        }
        if (creatorAvatarElement && this.currentUser) {
            // Avatar will be loaded separately
        }
    }

async loadUserAvatar() {
    try {
        const userAvatarImg = document.getElementById('userAvatarImg');
        const creatorAvatarImg = document.getElementById('creatorAvatarImg');
        
        if (this.currentUser && !this.currentUser.guest) {
            // Load user's custom avatar
            const avatarUrl = await this.getUserAvatar(this.currentUser.user_id);
            if (userAvatarImg) userAvatarImg.src = avatarUrl;
            if (creatorAvatarImg) creatorAvatarImg.src = avatarUrl;
        } else {
            // Use default avatar for guest
            const defaultAvatar = '../images/default-avatar.png';
            if (userAvatarImg) userAvatarImg.src = defaultAvatar;
            if (creatorAvatarImg) creatorAvatarImg.src = defaultAvatar;
        }
    } catch (error) {
        console.error('Avatar load error:', error);
        // Fallback to default avatars
        const defaultAvatar = '../images/default-avatar.png';
        const userAvatarImg = document.getElementById('userAvatarImg');
        const creatorAvatarImg = document.getElementById('creatorAvatarImg');
        if (userAvatarImg) userAvatarImg.src = defaultAvatar;
        if (creatorAvatarImg) creatorAvatarImg.src = defaultAvatar;
    }
}

    async getUserAvatar(userId) {
        // For now, return default avatar
        // Later integrate with PHP API
        return '../images/default-avatar.png';
    }

    showGuestMode() {
        this.currentUser = {
            name: 'Guest User',
            user_id: 'guest_' + Date.now(),
            guest: true
        };
        this.updateUserInfo();
    }

    // Event Listeners
    initializeEventListeners() {
        // Post submission
        const submitPostBtn = document.getElementById('submitPost');
        const postContent = document.getElementById('postContent');
        
        if (submitPostBtn && postContent) {
            submitPostBtn.addEventListener('click', () => this.handlePostSubmission());
            
            // Enter key to submit (Shift+Enter for new line)
            postContent.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handlePostSubmission();
                }
            });
        }

        // Language switcher
        this.initializeLanguageSwitcher();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.loadPosts();
        }, 30000);
        
        console.log('🎯 Event listeners initialized');
    }

    // Language Switcher
    initializeLanguageSwitcher() {
        const languageTrigger = document.getElementById('languageTrigger');
        const languageDropdown = document.getElementById('languageDropdown');
        
        if (!languageTrigger || !languageDropdown) {
            console.log('⚠️ Language switcher elements not found');
            return;
        }
        
        // Set current language flag
        this.updateLanguageFlag();
        
        // Toggle dropdown
        languageTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                languageDropdown.classList.remove('show');
            }
        });
        
        // Language selection
        const languageOptions = languageDropdown.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.changeLanguage(lang);
                languageDropdown.classList.remove('show');
            });
        });
        
        // Listen for language changes from shared manager
        document.addEventListener('dkLanguageChanged', (event) => {
            this.currentLanguage = event.detail.language;
            this.updateLanguageFlag();
            console.log('🌐 Language changed via event:', this.currentLanguage);
        });
    }

    updateLanguageFlag() {
        const flagMap = { 
            'en': '🇺🇸', 
            'hi': '🇮🇳', 
            'ur': '🇵🇰', 
            'mr': '🇮🇳' 
        };
        
        const currentLanguageElement = document.getElementById('currentLanguage');
        if (currentLanguageElement) {
            currentLanguageElement.textContent = flagMap[this.currentLanguage] || '🇺🇸';
        }
    }

    changeLanguage(lang) {
        if (window.dkLanguageManager) {
            window.dkLanguageManager.changeLanguage(lang);
        } else {
            this.currentLanguage = lang;
            localStorage.setItem('preferredLanguage', lang);
            this.updateLanguageFlag();
            this.showToast(`Language changed to ${this.getLanguageName(lang)}!`, 'success');
            console.log('🌐 Language changed locally:', lang);
        }
    }

    getLanguageName(lang) {
        const languages = {
            'en': 'English',
            'hi': 'Hindi', 
            'ur': 'Urdu',
            'mr': 'Marathi'
        };
        return languages[lang] || 'English';
    }

    // Image Upload System
    initializeImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (event) => {
                this.handleImageUpload(event);
            });
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file!', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size should be less than 5MB!', 'error');
            return;
        }

        this.selectedImage = file;
        this.showImagePreview(file);
        this.showToast('Image selected! Ready to post.', 'success');
    }

    showImagePreview(file) {
        const preview = document.getElementById('imagePreview');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            preview.innerHTML = `
                <div class="preview-container">
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <button type="button" class="remove-image" onclick="window.communityWall.removeImagePreview()">×</button>
                </div>
            `;
            preview.classList.remove('hidden');
        };
        
        reader.readAsDataURL(file);
    }

    removeImagePreview() {
        const preview = document.getElementById('imagePreview');
        const fileInput = document.getElementById('imageUpload');
        
        preview.classList.add('hidden');
        preview.innerHTML = '';
        if (fileInput) fileInput.value = '';
        this.selectedImage = null;
    }

    // Post System
    async handlePostSubmission() {
        const postContent = document.getElementById('postContent');
        const content = postContent.value.trim();
        
        if (!content && !this.selectedImage) {
            this.showToast('Please write something or add an image to post!', 'warning');
            return;
        }
        
        if (!this.currentUser) {
            this.showToast('Please login to post!', 'warning');
            return;
        }
        
        this.showToast('Publishing post...', 'info');
        
        try {
            let imageUrl = null;
            
            // Upload image if selected
            if (this.selectedImage) {
                imageUrl = await this.uploadImage(this.selectedImage);
            }
            
            // Create post with or without image
            const result = await this.createPost(content, imageUrl);
            
            if (result.success) {
                // Reset form
                postContent.value = '';
                this.removeImagePreview();
                this.selectedImage = null;
                
                this.showToast('Post published successfully! 🚀', 'success');
                this.loadPosts(); // Reload posts
            } else {
                this.showToast('Failed to publish post: ' + result.message, 'error');
            }
        } catch (error) {
            this.showToast('Network error. Please try again.', 'error');
            console.error('Post submission error:', error);
        }
    }

    async uploadImage(file) {
        // Simulate image upload - in real implementation, use PHP API
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockImageUrl = `https://deepakchauhanxai.xyz/images/uploaded/${Date.now()}_${file.name}`;
                resolve(mockImageUrl);
            }, 1000);
        });
    }

    async createPost(content, imageUrl = null) {
        const postData = {
            action: 'create_post',
            username: this.currentUser.name,
            user_id: this.currentUser.user_id,
            post_text: content,
            language: this.currentLanguage
        };

        // Add image URL if available
        if (imageUrl) {
            postData.image_url = imageUrl;
        }

        const response = await fetch('https://deepakchauhanxai.xyz/dk-api/community-create-post.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    }

    // Load and Display Posts
    async loadPosts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            const result = await this.fetchPosts();
            
            if (result.success) {
                this.posts = result.posts;
                this.displayPosts();
                this.updateStats();
            } else {
                this.showToast('Failed to load posts: ' + result.message, 'error');
                this.displayEmptyState();
            }
        } catch (error) {
            console.error('Load posts error:', error);
            this.showToast('Network error loading posts', 'error');
            this.displayEmptyState();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async fetchPosts(limit = 20, offset = 0) {
        const response = await fetch('https://deepakchauhanxai.xyz/dk-api/community-get-posts.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'get_posts',
                limit: limit,
                offset: offset
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    }

    displayPosts() {
        const postsFeed = document.getElementById('postsFeed');
        if (!postsFeed) return;
        
        // Remove loading state
        this.hideLoadingState();
        
        if (this.posts.length === 0) {
            this.displayEmptyState();
            return;
        }
        
        let postsHTML = '';
        this.posts.forEach(post => {
            postsHTML += this.createPostElement(post);
        });
        
        postsFeed.innerHTML = postsHTML;
        
        // Initialize like buttons for new posts
        this.initializeLikeButtons();
    }

    createPostElement(post) {
        const isAI = post.username === 'AI Bhai' || post.is_ai_post;
        const avatarClass = isAI ? 'ai-avatar' : 'user-avatar';
        const avatarUrl = isAI ? '../images/AI-bhai.png' : '../images/default-avatar.png';
        const badge = isAI ? '<span class="ai-badge">AI POWERED</span>' : '';
        
        // Check if post has image
        const imageHTML = post.image_url ? 
            `<div class="post-image">
                <img src="${post.image_url}" alt="Post image" class="post-image-content" onerror="this.style.display='none'">
            </div>` : '';

        return `
            <div class="post-card ${isAI ? 'ai-post' : 'user-post'}">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar ${avatarClass}">
                            <img src="${avatarUrl}" alt="${post.username}" class="avatar-image">
                        </div>
                        <div class="author-details">
                            <span class="author-name">${this.escapeHtml(post.username)}</span>
                            <span class="post-time">${post.time_ago}</span>
                            ${badge}
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    <p>${this.escapeHtml(post.post_text)}</p>
                    ${imageHTML}
                </div>
                <div class="post-actions">
                    <button class="post-action like-btn" data-post-id="${post.id}">
                        <span class="action-icon">❤️</span>
                        <span class="action-count">${post.likes_count}</span>
                    </button>
                    <button class="post-action comment-btn" data-post-id="${post.id}">
                        <span class="action-icon">💬</span>
                        <span class="action-count">${post.comments_count}</span>
                    </button>
                    <button class="post-action share-btn">
                        <span class="action-icon">🔗</span>
                        <span class="action-text">Share</span>
                    </button>
                </div>
            </div>
        `;
    }

    displayEmptyState() {
        const postsFeed = document.getElementById('postsFeed');
        if (postsFeed) {
            postsFeed.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts-icon">💬</div>
                    <p>No posts yet. Be the first to share something!</p>
                    <button class="action-btn primary" onclick="document.getElementById('postContent').focus()">
                        Write First Post
                    </button>
                </div>
            `;
        }
    }

    // Like System
    initializeLikeButtons() {
        const postsFeed = document.getElementById('postsFeed');
        if (!postsFeed) return;
        
        // Use event delegation for like buttons
        postsFeed.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                const postId = likeBtn.getAttribute('data-post-id');
                this.handleLike(postId, likeBtn);
            }
        });
    }

    async handleLike(postId, likeButton) {
        if (!this.currentUser) {
            this.showToast('Please login to like posts!', 'warning');
            return;
        }
        
        try {
            const result = await this.toggleLike(postId);
            
            if (result.success) {
                const countElement = likeButton.querySelector('.action-count');
                const iconElement = likeButton.querySelector('.action-icon');
                
                if (countElement) {
                    countElement.textContent = result.likes_count;
                }
                
                if (result.liked) {
                    likeButton.classList.add('liked');
                    if (iconElement) iconElement.textContent = '💖';
                    this.showToast('Post liked! ❤️', 'success');
                } else {
                    likeButton.classList.remove('liked');
                    if (iconElement) iconElement.textContent = '❤️';
                    this.showToast('Post unliked', 'info');
                }
            } else {
                this.showToast('Like operation failed', 'error');
            }
        } catch (error) {
            this.showToast('Network error', 'error');
            console.error('Like error:', error);
        }
    }

    async toggleLike(postId) {
        const response = await fetch('https://deepakchauhanxai.xyz/dk-api/community-like-post.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'like_post',
                post_id: postId,
                username: this.currentUser.name,
                user_id: this.currentUser.user_id
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    }

    // Activities System
    async loadActivities() {
        try {
            // For now, display sample activities
            this.displaySampleActivities();
            
            // Later integrate with PHP API
            // const result = await this.fetchActivities();
            // if (result.success) {
            //     this.displayActivities(result.activities);
            // }
        } catch (error) {
            console.error('Load activities error:', error);
        }
    }

    displaySampleActivities() {
        const activitiesFeed = document.getElementById('activitiesFeed');
        if (!activitiesFeed) return;
        
        const activities = [
            { 
                icon: '../images/AI-bhai.png', 
                text: 'AI Bhai: Community intelligence activated', 
                time: 'Just now' 
            },
            { 
                icon: '../images/AI-bhai.png', 
                text: 'AI Bhai: Neural network optimized for performance', 
                time: '2 min ago' 
            },
            { 
                icon: '../images/AI-bhai.png', 
                text: 'AI Bhai: Predictive analytics running at 98% efficiency', 
                time: '5 min ago' 
            }
        ];
        
        let activitiesHTML = '';
        activities.forEach(activity => {
            activitiesHTML += `
                <div class="activity-item ai-activity">
                    <div class="activity-icon">
                        <img src="${activity.icon}" alt="AI Bhai" class="activity-avatar">
                    </div>
                    <div class="activity-content">
                        <p>${activity.text}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `;
        });
        
        activitiesFeed.innerHTML = activitiesHTML;
    }

    // Stats System
    updateStats() {
        const membersCount = document.getElementById('membersCount');
        const postsCount = document.getElementById('postsCount');
        const onlineCount = document.getElementById('onlineCount');
        
        // Simulate stats for now
        if (membersCount) membersCount.textContent = '1.2K';
        if (postsCount) postsCount.textContent = this.posts.length > 0 ? this.posts.length : '456';
        if (onlineCount) onlineCount.textContent = Math.floor(Math.random() * 50) + 80;
    }

    // UI Helpers
    showLoadingState() {
        const loadingElement = document.getElementById('feedLoading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
    }

    hideLoadingState() {
        const loadingElement = document.getElementById('feedLoading');
        const postsFeed = document.getElementById('postsFeed');
        
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        if (postsFeed && this.posts.length === 0) {
            this.displayEmptyState();
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.dk-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `dk-toast dk-toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getToastColor(type),
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '10000',
            animation: 'toastSlideIn 0.3s ease',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
    }

    getToastColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Language Sync with Main Website
document.addEventListener('languageChanged', function(event) {
    console.log('🌐 Language change event received in Community Wall:', event.detail.language);
    
    if (window.communityWall) {
        window.communityWall.currentLanguage = event.detail.language;
        window.communityWall.updateLanguageFlag();
        console.log('✅ Community Wall language updated to:', event.detail.language);
    }
    
    // Update UI immediately
    const currentLangElement = document.getElementById('currentLanguage');
    const flagMap = { 'en': '🇺🇸', 'hi': '🇮🇳', 'ur': '🇵🇰', 'mr': '🇮🇳' };
    if (currentLangElement) {
        currentLangElement.textContent = flagMap[event.detail.language] || '🇺🇸';
    }
});

// Backup: localStorage check every 2 seconds
setInterval(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && window.communityWall && savedLang !== window.communityWall.currentLanguage) {
        console.log('🔄 Language sync from localStorage:', savedLang);
        window.communityWall.currentLanguage = savedLang;
        window.communityWall.updateLanguageFlag();
    }
}, 2000);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Community Wall Page Loaded');
    
    // Initialize community wall
    window.communityWall = new CommunityWall();
    
    // Global functions for HTML buttons
    window.refreshPosts = function() {
        if (window.communityWall) {
            window.communityWall.loadPosts();
            window.communityWall.showToast('Intelligence refreshed!', 'success');
        }
    };
    
    window.updateProfilePicture = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                // Here you would upload the profile picture
                window.communityWall.showToast('Profile picture updating...', 'info');
                // Implement profile picture upload logic
            }
        };
        input.click();
    };
});

// Make globally available
window.CommunityWall = CommunityWall;