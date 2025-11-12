class DailyProgressTracker {
    constructor() {
        this.username = null;
        this.baseURL = 'https://deepakchauhanxai.xyz/dk-api';
        this.progress = null;
        this.init();
    }

    async init() {
        await this.getUsername();
        await this.loadProgress();
        this.updateDisplay();
        this.bindEvents();
    }

    async getUsername() {
        this.username = localStorage.getItem('dkCommunityUsername');
        if (!this.username) {
            this.username = prompt('Enter your name:') || 'anonymous';
            localStorage.setItem('dkCommunityUsername', this.username);
        }
        this.showUsername();
    }

    showUsername() {
        // Add username to progress box
        setTimeout(() => {
            const progressBox = document.querySelector('.progress-tracker-section');
            if (progressBox && !progressBox.querySelector('.username-display')) {
                const usernameDiv = document.createElement('div');
                usernameDiv.className = 'username-display';
                usernameDiv.innerHTML = `👤 User: ${this.username}`;
                usernameDiv.style.cssText = `
                    background: rgba(255,255,255,0.2);
                    padding: 10px 15px;
                    border-radius: 20px;
                    margin: 10px 0;
                    text-align: center;
                    font-weight: bold;
                    color: white;
                `;
                progressBox.insertBefore(usernameDiv, progressBox.firstChild);
            }
        }, 1000);
    }

    async loadProgress() {
        try {
            console.log('Loading progress for:', this.username);
            const response = await fetch(`${this.baseURL}/save-progress.php?username=${this.username}&t=${Date.now()}`);
            
            if (!response.ok) throw new Error('Network error');
            
            const data = await response.json();
            console.log('API response:', data);
            
            if (data.success) {
                this.progress = data.progress;
            } else {
                this.progress = this.getDefaultProgress();
                await this.saveProgress();
            }
        } catch (error) {
            console.log('Using default progress due to error:', error);
            this.progress = this.getDefaultProgress();
        }
        
        this.updateDisplay();
    }

    getDefaultProgress() {
        return {
            streak: 0,
            lastDate: null,
            totalDays: 0,
            totalGoalsCompleted: 0,
            goals: {
                motivation: false,
                story: false,
                share: false,
                learn: false
            },
            achievements: []
        };
    }

    async saveProgress() {
        try {
            const response = await fetch(`${this.baseURL}/save-progress.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.username,
                    progress: this.progress
                })
            });
            
            const data = await response.json();
            console.log('Save response:', data);
        } catch (error) {
            console.log('Save failed:', error);
        }
    }

    async updateGoal(goalType) {
        if (!this.progress) return;
        
        const checkbox = document.getElementById(`goal${goalType.charAt(0).toUpperCase() + goalType.slice(1)}`);
        if (checkbox) {
            this.progress.goals[goalType] = checkbox.checked;
            
            if (checkbox.checked) {
                this.progress.totalGoalsCompleted++;
            }
            
            await this.saveProgress();
            this.updateDisplay();
        }
    }

    updateDisplay() {
        if (!this.progress) return;

        // Update streak
        const streakElement = document.getElementById('streakCount');
        if (streakElement) {
            streakElement.textContent = this.progress.streak;
        }

        // Update goals
        for (const goal in this.progress.goals) {
            const checkbox = document.getElementById(`goal${goal.charAt(0).toUpperCase() + goal.slice(1)}`);
            if (checkbox) {
                checkbox.checked = this.progress.goals[goal];
            }
        }

        // Update stats
        const totalGoalsElement = document.getElementById('totalGoals');
        const totalDaysElement = document.getElementById('totalDays');
        
        if (totalGoalsElement) {
            totalGoalsElement.textContent = this.progress.totalGoalsCompleted;
        }
        if (totalDaysElement) {
            totalDaysElement.textContent = this.progress.totalDays;
        }

        // Update completion rate
        const completionRateElement = document.getElementById('completionRate');
        if (completionRateElement) {
            const completionRate = this.progress.totalDays > 0 
                ? Math.round((this.progress.totalGoalsCompleted / (this.progress.totalDays * 4)) * 100)
                : 0;
            completionRateElement.textContent = completionRate + '%';
        }
    }

    bindEvents() {
        // Language change
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
        });
    }

    async resetProgress() {
        if (confirm('Are you sure you want to reset all progress?')) {
            this.progress = this.getDefaultProgress();
            await this.saveProgress();
            this.updateDisplay();
            alert('Progress reset successfully!');
        }
    }

    shareProgress() {
        const text = `I've maintained a ${this.progress.streak}-day streak on DK Community! 🚀`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Progress - DK Community',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Progress copied to clipboard!');
        }
    }
}

// Initialize and make global
const progressTracker = new DailyProgressTracker();

// Global functions for HTML
window.updateGoal = function(goalType) {
    progressTracker.updateGoal(goalType);
};

window.shareProgress = function() {
    progressTracker.shareProgress();
};

window.resetProgress = function() {
    progressTracker.resetProgress();
};