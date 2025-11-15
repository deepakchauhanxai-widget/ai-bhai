/**
 * Professional Community Wall Box
 * Shows only top 3 members with beautiful design
 */

class ProfessionalCommunityBox {
    constructor() {
        this.topMembers = [];
        this.isLoading = false;
        this.currentLanguage = 'en';
        this.API_BASE_URL = 'https://deepakchauhanxai.xyz/community-wall/api';
        this.init();
    }

    async init() {
        console.log('🚀 Professional Community Box Initializing...');
        
        // Load language
        await this.loadLanguage();
        
        // Load top members
        await this.loadTopMembers();
        
        // Auto refresh every 30 seconds
        setInterval(() => {
            this.loadTopMembers();
        }, 30000);
        
        // Setup language listener
        this.setupLanguageListener();
        
        console.log('✅ Professional Community Box Ready!');
    }

    async loadLanguage() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.updateBoxContent();
    }

    updateBoxContent() {
        // Update title based on language
        const titles = {
            'en': 'Top Community Members',
            'hi': 'शीर्ष समुदाय सदस्य',
            'ur': 'ٹاپ کمیونٹی ممبرز',
            'mr': 'अग्रणी समुदाय सदस्य'
        };
        
        const titleElement = document.getElementById('communityBoxTitle');
        if (titleElement) {
            titleElement.textContent = titles[this.currentLanguage] || titles['en'];
        }

        // Update button text
        const buttonTexts = {
            'en': 'Open Community Wall',
            'hi': 'कम्युनिटी वॉल खोलें',
            'ur': 'کمیونٹی وال کھولیں',
            'mr': 'कम्युनिटी वॉल उघडा'
        };
        
        const buttonElement = document.getElementById('openWallText');
        if (buttonElement) {
            buttonElement.textContent = buttonTexts[this.currentLanguage] || buttonTexts['en'];
        }

        // Update stat labels
        this.updateStatLabels();
    }

    updateStatLabels() {
        const labels = {
            'en': { online: 'Online', active: 'Active', posts: 'Posts' },
            'hi': { online: 'ऑनलाइन', active: 'सक्रिय', posts: 'पोस्ट' },
            'ur': { online: 'آن لائن', active: 'سرگرم', posts: 'پوسٹس' },
            'mr': { online: 'ऑनलाइन', active: 'सक्रिय', posts: 'पोस्ट' }
        };
        
        const currentLabels = labels[this.currentLanguage] || labels['en'];
        
        // Update all stat labels
        const statLabels = document.querySelectorAll('.stat-label');
        statLabels.forEach((label, index) => {
            if (index === 0) label.textContent = currentLabels.online;
            else if (index === 1) label.textContent = currentLabels.active;
            else if (index === 2) label.textContent = currentLabels.posts;
        });
    }

    setupLanguageListener() {
        // Listen for language changes
        document.addEventListener('languageChanged', (event) => {
            this.currentLanguage = event.detail;
            this.updateBoxContent();
        });

        // Check localStorage for changes
        setInterval(() => {
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && savedLang !== this.currentLanguage) {
                this.currentLanguage = savedLang;
                this.updateBoxContent();
            }
        }, 1000);
    }

    async loadTopMembers() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/get_top_members.php`);
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.top_members) {
                    this.topMembers = result.top_members.slice(0, 3); // Take only top 3
                    this.displayTopMembers();
                    this.updateStats();
                } else {
                    throw new Error(result.message || 'Failed to load members');
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Load top members error:', error);
            this.showError('Failed to load community data');
        } finally {
            this.isLoading = false;
        }
    }

    displayTopMembers() {
        const membersFeed = document.getElementById('communityMembersFeed');
        if (!membersFeed) return;
        
        if (this.topMembers.length === 0) {
            this.showNoMembers();
            return;
        }
        
        const membersHTML = `
            <div class="top-members-grid">
                ${this.topMembers.map((member, index) => this.createMemberHTML(member, index)).join('')}
            </div>
        `;
        
        membersFeed.innerHTML = membersHTML;
    }

    createMemberHTML(member, index) {
        const rank = index + 1;
        const avatarSrc = member.profile_pic && member.profile_pic !== 'default.png' 
            ? `${this.API_BASE_URL}/../assets/avatars/${member.profile_pic}`
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
        
        return `
        <div class="top-member-card">
            <div class="rank-badge rank-${rank}">${rank}</div>
            
            <div class="member-header">
                <img src="${avatarSrc}" 
                     alt="${member.username}" 
                     class="member-avatar"
                     onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'">
                <div class="member-info">
                    <div class="member-name">${this.escapeHtml(member.username)}</div>
                    <div class="member-stats">
                        <span class="stat">❤️ ${member.total_likes || 0}</span>
                        <span class="stat">💬 ${member.total_comments || 0}</span>
                        <span class="stat">📝 ${member.total_posts || 0}</span>
                    </div>
                </div>
            </div>
            
            <div class="member-performance">
                <div class="performance-item">
                    <span class="performance-value">${member.total_posts || 0}</span>
                    <span class="performance-label">POSTS</span>
                </div>
                <div class="performance-item">
                    <span class="performance-value">${member.total_likes || 0}</span>
                    <span class="performance-label">LIKES</span>
                </div>
                <div class="performance-item">
                    <span class="performance-value">${member.followers_count || 0}</span>
                    <span class="performance-label">FANS</span>
                </div>
            </div>
        </div>
        `;
    }

    updateStats() {
        // Update online count (simulated)
        const onlineCount = Math.floor(Math.random() * 50) + 50;
        const activeCount = Math.floor(Math.random() * 20) + 10;
        const postsCount = this.topMembers.reduce((sum, member) => sum + (member.total_posts || 0), 0);
        
        document.getElementById('onlineCount').textContent = onlineCount;
        document.getElementById('activeCount').textContent = activeCount;
        document.getElementById('postsCount').textContent = postsCount;
    }

    showLoading() {
        const membersFeed = document.getElementById('communityMembersFeed');
        if (membersFeed) {
            membersFeed.innerHTML = `
                <div class="loading-members">
                    <div class="loading-spinner"></div>
                    <p>Loading top members...</p>
                </div>
            `;
        }
    }

    showNoMembers() {
        const membersFeed = document.getElementById('communityMembersFeed');
        if (membersFeed) {
            membersFeed.innerHTML = `
                <div class="no-members">
                    <div class="no-members-icon">👥</div>
                    <p>No community members found</p>
                </div>
            `;
        }
    }

    showError(message) {
        const membersFeed = document.getElementById('communityMembersFeed');
        if (membersFeed) {
            membersFeed.innerHTML = `
                <div class="no-members">
                    <div class="no-members-icon">⚠️</div>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Open Community Wall function
function openCommunityWall() {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const communityWallUrl = `/community-wall.html?lang=${currentLang}`;
    
    console.log('🚀 Opening community wall:', communityWallUrl);
    window.open(communityWallUrl, '_blank');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.professionalCommunityBox = new ProfessionalCommunityBox();
    }, 500);
});

// Make it globally available
window.ProfessionalCommunityBox = ProfessionalCommunityBox;
