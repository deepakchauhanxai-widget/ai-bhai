// AI Progress Tracker - Professional JavaScript
class AIProgressTracker {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'en';
        this.autoTracking = {
            isTracking: false,
            totalTime: 0,
            learningTime: 0,
            workTime: 0,
            activities: [],
            learnings: [],
            intervals: []
        };
        
        this.init();
    }

    init() {
        console.log('🤖 AI Progress Tracker Initializing...');
        this.loadUserData();
        this.loadLanguage();
        this.setupEventListeners();
        this.loadLeaderboard();
        
        console.log('✅ AI Progress Tracker Ready!');
    }

    // Language Management
    loadLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        this.currentLanguage = savedLang;
        this.applyLanguage(this.currentLanguage);
    }

    applyLanguage(lang) {
        this.currentLanguage = lang;
        const translations = this.getTranslations();
        
        // Update all elements with data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
    }

    getTranslations() {
        return {
            en: {
                // Main Titles
                'main_title': 'AI Progress Tracker',
                'main_subtitle': 'Your success, automatically tracked 🤖',
                
                // Welcome Section
                'welcome_title': 'Start Your AI Journey',
                'welcome_text': 'Join thousands tracking their success automatically',
                'enter_name': 'Enter your full name',
                'generate_id': 'Generate AI ID',
                'your_id': 'Your AI ID:',
                'start_tracking': 'Start AI Tracking',
                
                // Dashboard
                'ai_tracking': 'AI Tracking Active',
                'day_streak': 'Day Streak',
                'tasks_completed': 'Tasks Completed',
                'time_invested': 'Time Invested',
                'topics_learned': 'Topics Learned',
                'ai_score': 'AI Score',
                'goal_progress': 'Goal Progress',
                'productivity': 'Productivity',
                'ai_activities': '🤖 AI Activities',
                'live': 'LIVE',
                'auto_save': 'Auto-saving progress',
                
                // Leaderboard
                'top_performers': '🏆 Top Performers',
                'loading': 'Loading...',
                'days': 'days',
                'points': 'points',
                
                // Activities
                'welcome_activity': 'AI tracking initialized. Ready to track your success!',
                
                // Footer
                'motivational_quote': '"Excellence is not a skill, it\'s an attitude. Track it with AI!"',
                'powered_by': 'Powered by'
            },
            
            hi: {
                'main_title': 'AI प्रोग्रेस ट्रैकर',
                'main_subtitle': 'आपकी सफलता, अपने आप ट्रैक 🤖',
                'welcome_title': 'अपनी AI यात्रा शुरू करें',
                'welcome_text': 'हजारों लोगों से जुड़ें जो अपनी सफलता अपने आप ट्रैक कर रहे हैं',
                'enter_name': 'अपना पूरा नाम डालें',
                'generate_id': 'AI आईडी जनरेट करें',
                'your_id': 'आपकी AI आईडी:',
                'start_tracking': 'AI ट्रैकिंग शुरू करें',
                'ai_tracking': 'AI ट्रैकिंग सक्रिय',
                'day_streak': 'दिन स्ट्रीक',
                'tasks_completed': 'काम पूरे',
                'time_invested': 'लगाया गया समय',
                'topics_learned': 'टॉपिक सीखे',
                'ai_score': 'AI स्कोर',
                'goal_progress': 'लक्ष्य प्रगति',
                'productivity': 'उत्पादकता',
                'ai_activities': '🤖 AI गतिविधियाँ',
                'live': 'लाइव',
                'auto_save': 'प्रोग्रेस ऑटो-सेव',
                'top_performers': '🏆 टॉप परफॉर्मर्स',
                'loading': 'लोड हो रहा...',
                'days': 'दिन',
                'points': 'पॉइंट्स',
                'welcome_activity': 'AI ट्रैकिंग शुरू। आपकी सफलता ट्रैक करने के लिए तैयार!',
                'motivational_quote': '"उत्कृष्टता कोई कौशल नहीं, यह एक दृष्टिकोण है। इसे AI से ट्रैक करें!"',
                'powered_by': 'द्वारा संचालित'
            },
            
            ur: {
                'main_title': 'AI پروگریس ٹریکر',
                'main_subtitle': 'آپ کی کامیابی، خود بخود ٹریک 🤖',
                'welcome_title': 'اپنی AI سفر شروع کریں',
                'welcome_text': 'ہزاروں لوگوں سے جڑیں جو اپنی کامیابی خود بخود ٹریک کر رہے ہیں',
                'enter_name': 'اپنا پورا نام درج کریں',
                'generate_id': 'AI آئی ڈی بنائیں',
                'your_id': 'آپ کی AI آئی ڈی:',
                'start_tracking': 'AI ٹریکنگ شروع کریں',
                'ai_tracking': 'AI ٹریکنگ فعال',
                'day_streak': 'دنوں کی لڑی',
                'tasks_completed': 'کام مکمل',
                'time_invested': 'وقت لگایا',
                'topics_learned': 'ٹاپکس سیکھے',
                'ai_score': 'AI اسکور',
                'goal_progress': 'ہدف کی پیشرفت',
                'productivity': 'پیداواریت',
                'ai_activities': '🤖 AI سرگرمیاں',
                'live': 'لائیو',
                'auto_save': 'خود بخود سیو ہو رہا ہے',
                'top_performers': '🏆 ٹاپ پرفارمرز',
                'loading': 'لوڈ ہو رہا ہے...',
                'days': 'دن',
                'points': 'پوائنٹس',
                'welcome_activity': 'AI ٹریکنگ شروع۔ آپ کی کامیابی ٹریک کرنے کے لیے تیار!',
                'motivational_quote': '"فضیلت کوئی مہارت نہیں، یہ ایک رویہ ہے۔ اسے AI سے ٹریک کریں!"',
                'powered_by': 'کی طرف سے چلایا گیا'
            },
            
            mr: {
                'main_title': 'AI प्रोग्रेस ट्रॅकर',
                'main_subtitle': 'तुमची यश, स्वयंचलित ट्रॅक 🤖',
                'welcome_title': 'तुमची AI प्रवास सुरू करा',
                'welcome_text': 'हजारो लोकांसो जोडा जे त्यांचे यश स्वयंचलित ट्रॅक करत आहेत',
                'enter_name': 'तुमचे पूर्ण नाव टाका',
                'generate_id': 'AI आयडी जनरेट करा',
                'your_id': 'तुमची AI आयडी:',
                'start_tracking': 'AI ट्रॅकिंग सुरू करा',
                'ai_tracking': 'AI ट्रॅकिंग सक्रिय',
                'day_streak': 'दिवस स्ट्रीक',
                'tasks_completed': 'कामे पूर्ण',
                'time_invested': 'वेळ गुंतवला',
                'topics_learned': 'विषय शिकले',
                'ai_score': 'AI स्कोर',
                'goal_progress': 'लक्ष्य प्रगती',
                'productivity': 'उत्पादकता',
                'ai_activities': '🤖 AI क्रियाकलाप',
                'live': 'लाइव्ह',
                'auto_save': 'स्वयंचलित सेव्ह होत आहे',
                'top_performers': '🏆 टॉप परफॉर्मर्स',
                'loading': 'लोड होत आहे...',
                'days': 'दिवस',
                'points': 'पॉइंट्स',
                'welcome_activity': 'AI ट्रॅकिंग सुरू। तुमचे यश ट्रॅक करण्यासाठी तयार!',
                'motivational_quote': '"उत्कृष्टता हे कौशल्य नाही, तो एक दृष्टीकोन आहे. ते AI सह ट्रॅक करा!"',
                'powered_by': 'द्वारे चालवले'
            }
        };
    }

setupEventListeners() {
    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
        this.applyLanguage(e.detail.lang);
    });

    // ✅ YEH 3 LINES ADD KAR DI HAI:
    // Apply current language immediately
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    this.applyLanguage(currentLang);
    
    // Check for language changes every 2 seconds
    setInterval(() => {
        const newLang = localStorage.getItem('preferredLanguage') || 'en';
        if (newLang !== this.currentLanguage) {
            this.applyLanguage(newLang);
        }
    }, 2000);

    // Auto-save before page unload
    window.addEventListener('beforeunload', () => {
        this.saveAutoTrackingData();
    });

    // Track page visibility for activity detection
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.autoTracking.isTracking) {
            this.addActivity('User returned to page', 'auto');
        }
    });
}

    // User Management
    loadUserData() {
        const savedUser = localStorage.getItem('progressUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showDashboard();
                this.startAutoTracking();
            } catch (e) {
                this.showWelcome();
            }
        } else {
            this.showWelcome();
        }
    }

    showWelcome() {
        document.getElementById('welcomeState').classList.remove('hidden');
        document.getElementById('dashboardState').classList.add('hidden');
    }

    showDashboard() {
        if (!this.currentUser) {
            this.showWelcome();
            return;
        }
        
        document.getElementById('welcomeState').classList.add('hidden');
        document.getElementById('dashboardState').classList.remove('hidden');
        
        this.updateUserInfo();
        this.loadUserProgress();
    }

    updateUserInfo() {
        document.getElementById('displayUserName').textContent = this.currentUser.name;
        document.getElementById('displayUserId').textContent = `ID: ${this.currentUser.user_id}`;
    }

    // ID Generation
    generateUserID() {
        const nameInput = document.getElementById('userName');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.showNotification('Please enter your name first!', 'error');
            return;
        }
        
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const userId = `${name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}_${randomStr}`;
        
        document.getElementById('userIdValue').textContent = userId;
        document.getElementById('userIdDisplay').style.display = 'block';
        
        return userId;
    }

    copyUserID() {
        const userId = document.getElementById('userIdValue').textContent;
        if (userId === '-') {
            this.showNotification('Please generate an ID first!', 'error');
            return;
        }
        
        navigator.clipboard.writeText(userId).then(() => {
            this.showNotification('User ID copied to clipboard! 📋', 'success');
        });
    }

    // User Registration
    async registerUser() {
        const name = document.getElementById('userName').value.trim();
        const userId = document.getElementById('userIdValue').textContent;
        
        if (!name || userId === '-') {
            this.showNotification('Please generate your ID first!', 'error');
            return;
        }
        
        try {
            this.showNotification('Creating your AI account...', 'loading');
            
            const response = await fetch('https://deepakchauhanxai.xyz/dk-api/daily-progress.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'register',
                    name: name,
                    user_id: userId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = {
                    name: name,
                    user_id: userId,
                    registered_at: new Date().toISOString(),
                    streak: 0,
                    total_points: 0
                };
                
                localStorage.setItem('progressUser', JSON.stringify(this.currentUser));
                
                this.showNotification('🎉 AI Account Created! Starting automatic tracking...', 'success');
                this.showDashboard();
                this.startAutoTracking();
                this.loadLeaderboard();
                
            } else {
                throw new Error(data.message);
            }
            
        } catch (error) {
            // Fallback to local storage
            this.currentUser = {
                name: name,
                user_id: userId,
                registered_at: new Date().toISOString(),
                streak: 0,
                total_points: 0,
                local_storage: true
            };
            
            localStorage.setItem('progressUser', JSON.stringify(this.currentUser));
            
            this.showNotification('🎉 AI Account Created (Local Mode)!', 'success');
            this.showDashboard();
            this.startAutoTracking();
        }
    }

    // Automatic Tracking System
    startAutoTracking() {
        if (!this.currentUser || this.autoTracking.isTracking) return;
        
        this.autoTracking.isTracking = true;
        this.initAutoTracking();
        
        // Start all tracking systems
        this.startTimeTracking();
        this.startActivityDetection();
        this.startAutoSave();
        
        this.addActivity('AI tracking system activated', 'start');
        this.updateTrackingStatus('ACTIVE');
        
        this.showNotification('🤖 Automatic tracking started!', 'success');
    }

    initAutoTracking() {
        // Load saved tracking data
        const savedData = localStorage.getItem('autoTrackingData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const today = new Date().toDateString();
                const lastSave = localStorage.getItem('lastAutoSaveDate');
                
                if (lastSave === today) {
                    this.autoTracking = { ...this.autoTracking, ...parsed };
                }
            } catch (e) {
                console.error('Error loading tracking data:', e);
            }
        }
        
        this.updateAllDisplays();
    }

    startTimeTracking() {
        const timeInterval = setInterval(() => {
            if (!this.autoTracking.isTracking) {
                clearInterval(timeInterval);
                return;
            }
            
            this.autoTracking.totalTime++;
            this.detectActivityType();
            this.updateTimeDisplays();
            this.updateProgress();
            
        }, 60000); // Every minute
        
        this.autoTracking.intervals.push(timeInterval);
    }

    startActivityDetection() {
        const activityInterval = setInterval(() => {
            if (!this.autoTracking.isTracking) {
                clearInterval(activityInterval);
                return;
            }
            
            // Auto-detect and add activities
            this.autoDetectActivities();
            
        }, 300000); // Every 5 minutes
        
        this.autoTracking.intervals.push(activityInterval);
    }

    startAutoSave() {
        const saveInterval = setInterval(() => {
            if (!this.autoTracking.isTracking) {
                clearInterval(saveInterval);
                return;
            }
            
            this.autoSaveProgress();
            this.updateLastSaveTime();
            
        }, 300000); // Every 5 minutes
        
        this.autoTracking.intervals.push(saveInterval);
    }

    detectActivityType() {
        const hour = new Date().getHours();
        
        if (hour >= 6 && hour <= 10) {
            this.autoTracking.workTime++;
            this.autoTracking.currentActivity = 'morning_routine';
        } else if (hour >= 9 && hour <= 12) {
            this.autoTracking.learningTime++;
            this.autoTracking.currentActivity = 'learning';
        } else if (hour >= 14 && hour <= 18) {
            this.autoTracking.workTime++;
            this.autoTracking.currentActivity = 'work';
        } else {
            this.autoTracking.currentActivity = 'personal_time';
        }
        
        // Auto learning every 30 minutes
        if (this.autoTracking.totalTime > 0 && this.autoTracking.totalTime % 30 === 0) {
            this.addAutoLearning();
        }
        
        // Auto complete tasks
        this.autoCompleteTasks();
    }

    autoDetectActivities() {
        const activities = [
            'Working on personal goals',
            'Learning new skills',
            'Planning daily tasks',
            'Reviewing progress',
            'Networking with community',
            'Developing projects',
            'Research and development',
            'Skill practice session'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivity(randomActivity, 'auto');
    }

    autoCompleteTasks() {
        const hour = new Date().getHours();
        
        // Simulate task completion based on time and activity
        if (hour >= 8 && hour <= 10) {
            this.addActivity('Morning routine completed automatically', 'auto');
        }
        
        if (hour >= 11 && hour <= 13 && this.autoTracking.learningTime > 20) {
            this.addActivity('Learning session completed', 'auto');
        }
        
        if (hour >= 15 && hour <= 17 && this.autoTracking.workTime > 40) {
            this.addActivity('Work goals achieved', 'auto');
        }
        
        if (hour >= 19 && hour <= 21) {
            this.addActivity('Evening review completed', 'auto');
        }
    }

    addActivity(text, type = 'auto') {
        const activity = {
            text: text,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            type: type,
            timestamp: new Date()
        };
        
        this.autoTracking.activities.unshift(activity);
        
        // Keep only last 10 activities
        if (this.autoTracking.activities.length > 10) {
            this.autoTracking.activities = this.autoTracking.activities.slice(0, 10);
        }
        
        this.updateActivitiesFeed();
    }

    addAutoLearning() {
        const learningTopics = [
            'Artificial Intelligence concepts',
            'Web development frameworks',
            'Mobile app development',
            'Data science techniques',
            'Cloud computing platforms',
            'DevOps practices',
            'UI/UX design principles',
            'Digital marketing strategies',
            'Business development skills',
            'Personal growth methodologies'
        ];
        
        const randomTopic = learningTopics[Math.floor(Math.random() * learningTopics.length)];
        const learning = {
            text: `Learned: ${randomTopic}`,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date()
        };
        
        this.autoTracking.learnings.unshift(learning);
        
        if (this.autoTracking.learnings.length > 8) {
            this.autoTracking.learnings = this.autoTracking.learnings.slice(0, 8);
        }
        
        this.updateLearningStats();
    }

    // Display Updates
    updateAllDisplays() {
        this.updateTimeDisplays();
        this.updateProgress();
        this.updateActivitiesFeed();
        this.updateLearningStats();
    }

    updateTimeDisplays() {
        const totalHours = Math.floor(this.autoTracking.totalTime / 60);
        const totalMinutes = this.autoTracking.totalTime % 60;
        
        const learningHours = Math.floor(this.autoTracking.learningTime / 60);
        const learningMinutes = this.autoTracking.learningTime % 60;
        
        const workHours = Math.floor(this.autoTracking.workTime / 60);
        const workMinutes = this.autoTracking.workTime % 60;
        
        document.getElementById('timeSpent').textContent = `${totalHours}h ${totalMinutes}m`;
        
        // Update progress bars
        this.updateProgressBars();
    }

    updateProgress() {
        // Calculate completion percentage (simulated)
        const completion = Math.min(this.autoTracking.totalTime / 2, 100);
        const productivity = Math.min(
            (this.autoTracking.learningTime * 0.7) + 
            (this.autoTracking.workTime * 0.3) + 
            (this.autoTracking.activities.length * 2), 
        100);
        
        document.getElementById('tasksCompleted').textContent = `${Math.floor(completion/20)}/5`;
        document.getElementById('topicsLearned').textContent = this.autoTracking.learnings.length;
        document.getElementById('productivityScore').textContent = `${Math.round(productivity)}%`;
        
        // Update circular progress
        this.updateCircularProgress(completion, productivity);
    }

    updateProgressBars() {
        const tasksBar = document.getElementById('tasksBar');
        const timeBar = document.getElementById('timeBar');
        const learnBar = document.getElementById('learnBar');
        const scoreBar = document.getElementById('scoreBar');
        
        if (tasksBar) tasksBar.style.width = `${Math.min(this.autoTracking.totalTime / 2, 100)}%`;
        if (timeBar) timeBar.style.width = `${Math.min(this.autoTracking.totalTime, 100)}%`;
        if (learnBar) learnBar.style.width = `${Math.min(this.autoTracking.learnings.length * 10, 100)}%`;
        if (scoreBar) {
            const score = Math.min(
                (this.autoTracking.learningTime * 0.7) + 
                (this.autoTracking.workTime * 0.3) + 
                (this.autoTracking.activities.length * 2), 
            100);
            scoreBar.style.width = `${score}%`;
        }
    }

    updateCircularProgress(goalPercent, productivityPercent) {
        const goalCircle = document.getElementById('goalCircle');
        const productivityCircle = document.getElementById('productivityCircle');
        const goalPercentText = document.getElementById('goalPercent');
        const productivityPercentText = document.getElementById('productivityPercent');
        
        if (goalCircle) {
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (goalPercent / 100) * circumference;
            goalCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            goalCircle.style.strokeDashoffset = offset;
        }
        
        if (productivityCircle) {
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (productivityPercent / 100) * circumference;
            productivityCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            productivityCircle.style.strokeDashoffset = offset;
        }
        
        if (goalPercentText) goalPercentText.textContent = `${Math.round(goalPercent)}%`;
        if (productivityPercentText) productivityPercentText.textContent = `${Math.round(productivityPercent)}%`;
    }

    updateActivitiesFeed() {
        const feed = document.getElementById('activitiesFeed');
        if (!feed) return;
        
        feed.innerHTML = '';
        
        this.autoTracking.activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
            feed.appendChild(item);
        });
    }

    updateLearningStats() {
        document.getElementById('topicsLearned').textContent = this.autoTracking.learnings.length;
    }

    getActivityIcon(type) {
        const icons = {
            'start': '🤖',
            'auto': '⚡',
            'morning_routine': '🌅',
            'learning': '📚',
            'work': '💼',
            'personal_time': '😴'
        };
        return icons[type] || '📌';
    }

    // Auto Save System
    autoSaveProgress() {
        if (!this.currentUser || !this.autoTracking.isTracking) return;
        
        const completedTasks = Math.floor(Math.min(this.autoTracking.totalTime / 2, 100) / 20);
        const productivity = Math.min(
            (this.autoTracking.learningTime * 0.7) + 
            (this.autoTracking.workTime * 0.3) + 
            (this.autoTracking.activities.length * 2), 
        100);
        
        try {
            fetch('https://deepakchauhanxai.xyz/dk-api/daily-progress.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'save_progress',
                    user_id: this.currentUser.user_id,
                    name: this.currentUser.name,
                    tasks_completed: completedTasks,
                    time_spent: this.autoTracking.totalTime,
                    mood: 'auto',
                    productivity_score: Math.round(productivity),
                    date: new Date().toISOString().split('T')[0],
                    auto_data: {
                        total_time: this.autoTracking.totalTime,
                        learning_time: this.autoTracking.learningTime,
                        work_time: this.autoTracking.workTime,
                        activities_count: this.autoTracking.activities.length,
                        learnings_count: this.autoTracking.learnings.length
                    }
                })
            }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.autoTracking.lastSave = new Date();
                    this.saveAutoTrackingData();
                    
                    if (data.streak) {
                        this.currentUser.streak = data.streak;
                        localStorage.setItem('progressUser', JSON.stringify(this.currentUser));
                        document.getElementById('streakCount').textContent = data.streak;
                    }
                    
                    this.loadLeaderboard();
                }
            });
        } catch (error) {
            this.saveAutoTrackingData();
        }
    }

    saveAutoTrackingData() {
        localStorage.setItem('autoTrackingData', JSON.stringify(this.autoTracking));
        localStorage.setItem('lastAutoSaveDate', new Date().toDateString());
    }

    updateLastSaveTime() {
        const saveTimeEl = document.getElementById('lastSaveTime');
        if (saveTimeEl) {
            saveTimeEl.textContent = new Date().toLocaleTimeString('en-IN', { 
                hour: '2-digit', minute: '2-digit' 
            });
        }
    }

    updateTrackingStatus(status) {
        const statusEl = document.querySelector('.ai-status span:last-child');
        if (statusEl) {
            statusEl.textContent = status;
        }
    }

    // Leaderboard System
    async loadLeaderboard() {
        try {
            const response = await fetch('https://deepakchauhanxai.xyz/dk-api/daily-progress.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'get_leaderboard' })
            });
            
            const data = await response.json();
            this.updateLeaderboard(data);
        } catch (error) {
            // Show sample leaderboard
            this.updateLeaderboard({
                success: true,
                leaderboard: [
                    {name: 'Deepak Chauhan', streak: 7, points: 450},
                    {name: 'AI Bhai', streak: 5, points: 380},
                    {name: 'DK Community', streak: 3, points: 290},
                    {name: 'Tech Explorer', streak: 2, points: 210},
                    {name: 'Digital Creator', streak: 1, points: 150}
                ]
            });
        }
    }

    updateLeaderboard(data) {
        const leaderboardGrid = document.getElementById('leaderboardGrid');
        if (!leaderboardGrid) return;
        
        if (data.success && data.leaderboard && data.leaderboard.length > 0) {
            leaderboardGrid.innerHTML = '';
            
            data.leaderboard.slice(0, 5).forEach((user, index) => {
                const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#667eea', '#764ba2'];
                const rankIcons = ['👑', '🥈', '🥉', '⭐', '🎯'];
                
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = `
                    <div class="rank-badge" style="background: linear-gradient(45deg, ${rankColors[index]}, ${rankColors[index]}dd)">${index + 1}</div>
                    <div class="player-info">
                        <div class="player-avatar">${rankIcons[index] || '👤'}</div>
                        <div class="player-details">
                            <span class="player-name">${user.name}</span>
                            <span class="player-stats">🔥 ${user.streak || 0} days • ⭐ ${user.points || 0} points</span>
                        </div>
                    </div>
                `;
                leaderboardGrid.appendChild(item);
            });
        }
    }

    // User Progress
    async loadUserProgress() {
        if (!this.currentUser) return;
        
        try {
            const response = await fetch('https://deepakchauhanxai.xyz/dk-api/daily-progress.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    action: 'get_user_stats', 
                    user_id: this.currentUser.user_id 
                })
            });
            
            const data = await response.json();
            if (data.success) {
                document.getElementById('streakCount').textContent = data.streak || 0;
                this.currentUser.streak = data.streak;
                localStorage.setItem('progressUser', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Load progress error:', error);
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.progress-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `progress-notification progress-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            border-left: 4px solid ${this.getNotificationBorderColor(type)};
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            'loading': '⏳'
        };
        return icons[type] || '💡';
    }

    getNotificationColor(type) {
        const colors = {
            'success': 'linear-gradient(45deg, #00b09b, #96c93d)',
            'error': 'linear-gradient(45deg, #ff416c, #ff4b2b)',
            'warning': 'linear-gradient(45deg, #f7971e, #ffd200)',
            'info': 'linear-gradient(45deg, #4facfe, #00f2fe)',
            'loading': 'linear-gradient(45deg, #667eea, #764ba2)'
        };
        return colors[type] || '#667eea';
    }

    getNotificationBorderColor(type) {
        const colors = {
            'success': '#00b09b',
            'error': '#ff416c',
            'warning': '#f7971e',
            'info': '#4facfe',
            'loading': '#667eea'
        };
        return colors[type] || '#667eea';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize tracker
    setTimeout(() => {
        window.aiProgressTracker = new AIProgressTracker();
    }, 1000);
});

// Global functions for HTML onclick
window.generateUserID = function() {
    if (window.aiProgressTracker) {
        window.aiProgressTracker.generateUserID();
    }
};

window.copyUserID = function() {
    if (window.aiProgressTracker) {
        window.aiProgressTracker.copyUserID();
    }
};

window.registerUser = function() {
    if (window.aiProgressTracker) {
        window.aiProgressTracker.registerUser();
    }
};