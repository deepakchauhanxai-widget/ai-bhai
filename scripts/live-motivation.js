class LiveMotivationFeed {
    constructor() {
        this.currentLanguage = 'en';
        this.messages = [];
        this.newMessagesCount = 0;
        this.notificationsEnabled = false;
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        this.loadLanguage();
        this.loadMessages();
        this.bindEvents();
        this.startAutoRefresh();
        this.checkNotificationPermission();
    }

    bindEvents() {
        // Language change event
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.renderMessages();
        });

        // Message input enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Scroll to load new messages
        document.getElementById('feedMessages').addEventListener('scroll', this.handleScroll.bind(this));
    }

    loadLanguage() {
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            const currentLang = langBtn.querySelector('.current-lang').textContent;
            this.currentLanguage = this.getLanguageFromEmoji(currentLang);
        }
    }

    getLanguageFromEmoji(emoji) {
        const langMap = {
            '🇮🇳': 'hi',
            '🇺🇸': 'en', 
            '🇵🇰': 'ur',
            'mr': 'mr'
        };
        return langMap[emoji] || 'en';
    }

    async loadMessages() {
        try {
            const response = await fetch('data/live-motivation.json');
            const data = await response.json();
            this.messages = data.live_messages;
            
            // Update stats
            document.getElementById('onlineCount').textContent = data.online_users;
            document.getElementById('activeCount').textContent = data.active_now;
            
            this.renderMessages();
        } catch (error) {
            console.error('Error loading messages:', error);
            this.loadSampleMessages();
        }
    }

    loadSampleMessages() {
        this.messages = [
            {
                id: 1,
                type: "motivation",
                author: "Deepak Chauhan",
                avatar: "images/AI-bhai.png",
                content: {
                    en: "Welcome to Live Motivation Feed! Get real-time inspiration! 🚀",
                    hi: "Live Motivation Feed में आपका स्वागत है! Real-time inspiration पाएं! 🚀",
                    ur: "Live Motivation Feed میں خوش آمدید! Real-time inspiration حاصل کریں! 🚀",
                    mr: "Live Motivation Feed मध्ये स्वागत आहे! Real-time प्रेरणा मिळवा! 🚀"
                },
                timestamp: new Date().toISOString(),
                likes: 15,
                reactions: ["🔥", "💪"],
                isLive: true
            }
        ];
        this.renderMessages();
    }

    renderMessages() {
        const container = document.getElementById('feedMessages');
        container.innerHTML = this.messages.map(message => this.createMessageHTML(message)).join('');
        this.updateTranslations();
    }

    createMessageHTML(message) {
        const content = message.content[this.currentLanguage] || message.content.en;
        const timeAgo = this.getTimeAgo(message.timestamp);
        
        return `
            <div class="message-card ${message.isLive ? 'live' : ''}" data-message-id="${message.id}">
                <div class="message-header">
                    <img src="${message.avatar}" alt="${message.author}" class="message-avatar" onerror="this.src='images/AI-bhai.png'">
                    <div class="message-author">
                        <h3 class="author-name">${message.author}</h3>
                        <p class="message-time">${timeAgo}</p>
                    </div>
                    ${message.isLive ? '<span class="live-badge" data-translate="live">LIVE</span>' : ''}
                </div>
                <div class="message-content">
                    <p class="message-text">${content}</p>
                </div>
                <div class="message-actions">
                    <div class="message-reactions">
                        ${message.reactions.map(reaction => `
                            <span class="reaction">${reaction} ${Math.floor(Math.random() * 10) + 1}</span>
                        `).join('')}
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="liveFeed.likeMessage(${message.id})">
                            <span class="action-icon">❤️</span>
                            <span>${message.likes}</span>
                        </button>
                        <button class="action-btn" onclick="liveFeed.shareMessage(${message.id})">
                            <span class="action-icon">📤</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - messageTime) / 1000);
        
        if (diffInSeconds < 60) return this.getTranslation('just_now');
        if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + this.getTranslation('min_ago');
        if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + this.getTranslation('hour_ago');
        return Math.floor(diffInSeconds / 86400) + this.getTranslation('day_ago');
    }

    startAutoRefresh() {
        // Simulate live updates every 30 seconds
        this.autoRefreshInterval = setInterval(() => {
            this.simulateNewMessage();
        }, 30000);
    }

    simulateNewMessage() {
        const newMessage = {
            id: Date.now(),
            type: "motivation",
            author: Math.random() > 0.5 ? "Deepak Chauhan" : "AI Bhai",
            avatar: "images/AI-bhai.png",
            content: {
                en: this.getRandomMotivation('en'),
                hi: this.getRandomMotivation('hi'),
                ur: this.getRandomMotivation('ur'),
                mr: this.getRandomMotivation('mr')
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            reactions: ["🔥", "💪", "🚀"].sort(() => 0.5 - Math.random()).slice(0, 2),
            isLive: Math.random() > 0.7
        };

        this.newMessagesCount++;
        this.showNewMessagesIndicator();
        
        if (this.notificationsEnabled) {
            this.showNotification(newMessage);
        }
    }

    getRandomMotivation(lang) {
        const motivations = {
            en: [
                "💪 Keep pushing! Your breakthrough is closer than you think!",
                "🚀 Success is not accidental. It's intentional!",
                "🌟 You have within you right now, everything you need to succeed!",
                "🔥 Don't stop when you're tired. Stop when you're done!",
                "🎯 Your only limit is you. Break through it!"
            ],
            hi: [
                "💪 Push करते रहो! आपका breakthrough आपकी सोच से करीब है!",
                "🚀 Success accidental नहीं होती। यह intentional होती है!",
                "🌟 आपके अंदर इसी समय, succeed होने के लिए सब कुछ है!",
                "🔥 थकने पर मत रुको। पूरा होने पर रुको!",
                "🎯 आपकी एकमात्र limit आप खुद हैं। इसे break through करो!"
            ],
            ur: [
                "💪 پش کرتے رہو! آپ کا بریک تھرو آپ کی سوچ سے قریب ہے!",
                "🚀 کامیابی حادثاتی نہیں ہوتی۔ یہ ارادی ہوتی ہے!",
                "🌟 آپ کے اندر اس وقت، کامیاب ہونے کے لیے سب کچھ ہے!",
                "🔥 تھک کر مت رکو۔ مکمل ہونے پر رکو!",
                "🎯 آپ کی واحد حد آپ خود ہیں۔ اسے توڑیں!"
            ],
            mr: [
                "💪 पुश करत रहा! तुमचा ब्रेकथ्रू तुमच्या विचारापेक्षा जवळ आहे!",
                "🚀 यश अपघाती नाही. ते हेतुपुरस्सर आहे!",
                "🌟 तुमच्याकडे या क्षणी, यशस्वी होण्यासाठी सर्व काही आहे!",
                "🔥 थकल्यावर थांबू नका. पूर्ण झाल्यावर थांबा!",
                "🎯 तुमची एकमेव मर्यादा तुम्हीच आहात. ती मोडून टाका!"
            ]
        };

        const list = motivations[lang] || motivations.en;
        return list[Math.floor(Math.random() * list.length)];
    }

    showNewMessagesIndicator() {
        const indicator = document.getElementById('newMessagesIndicator');
        indicator.style.display = 'flex';
        
        const text = indicator.querySelector('.indicator-text');
        text.textContent = this.getTranslation('new_messages_count')
            .replace('{count}', this.newMessagesCount);
    }

    loadNewMessages() {
        // Simulate loading new messages
        for (let i = 0; i < this.newMessagesCount; i++) {
            this.simulateNewMessage();
        }
        
        this.newMessagesCount = 0;
        document.getElementById('newMessagesIndicator').style.display = 'none';
        this.renderMessages();
    }

    sendQuickReaction(emoji) {
        this.showReactionPopup(emoji);
        
        // Simulate sending reaction to server
        setTimeout(() => {
            if (this.notificationsEnabled) {
                this.showNotification({
                    author: "System",
                    content: {
                        en: `Your ${emoji} reaction was sent to the community!`,
                        hi: `आपकी ${emoji} reaction community को भेज दी गई!`,
                        ur: `آپ کی ${emoji} ری ایکشن کمیونٹی کو بھیج دی گئی!`,
                        mr: `तुमची ${emoji} प्रतिक्रिया समुदायाला पाठवली गेली!`
                    }
                });
            }
        }, 1000);
    }

    showReactionPopup(emoji) {
        const popup = document.getElementById('reactionPopup');
        const emojiElement = document.getElementById('reactionEmoji');
        
        emojiElement.textContent = emoji;
        popup.style.display = 'block';
        
        setTimeout(() => {
            popup.style.display = 'none';
        }, 2000);
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const content = input.value.trim();
        
        if (!content) {
            alert(this.getTranslation('enter_message'));
            return;
        }

        const newMessage = {
            id: Date.now(),
            type: "user",
            author: this.getTranslation('you'),
            avatar: "images/user-avatar.png",
            content: {
                en: content,
                hi: content,
                ur: content,
                mr: content
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            reactions: [],
            isLive: false
        };

        this.messages.unshift(newMessage);
        this.renderMessages();
        input.value = '';
        
        // Scroll to top
        document.getElementById('feedMessages').scrollTop = 0;
        
        alert(this.getTranslation('message_sent'));
    }

    likeMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            message.likes++;
            this.renderMessages();
        }
    }

    shareMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            const content = message.content[this.currentLanguage] || message.content.en;
            
            if (navigator.share) {
                navigator.share({
                    title: 'DK Community Motivation',
                    text: content,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(content);
                alert(this.getTranslation('copied_clipboard'));
            }
        }
    }

    toggleNotifications() {
        const toggle = document.getElementById('notificationToggle');
        this.notificationsEnabled = toggle.checked;
        
        if (this.notificationsEnabled) {
            this.requestNotificationPermission();
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationsEnabled = permission === 'granted';
            
            if (!this.notificationsEnabled) {
                document.getElementById('notificationToggle').checked = false;
                alert(this.getTranslation('notification_blocked'));
            }
        }
    }

    checkNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'granted') {
            this.notificationsEnabled = true;
            document.getElementById('notificationToggle').checked = true;
        }
    }

    showNotification(message) {
        if ('Notification' in window && this.notificationsEnabled) {
            const content = message.content[this.currentLanguage] || message.content.en;
            
            new Notification('DK Community - New Message', {
                body: `${message.author}: ${content}`,
                icon: message.avatar,
                tag: 'dk-community'
            });
        }
    }

    handleScroll(event) {
        const container = event.target;
        const scrollThreshold = 100;
        
        if (container.scrollTop < scrollThreshold && this.newMessagesCount > 0) {
            this.showNewMessagesIndicator();
        }
    }

    updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    getTranslation(key) {
        const translations = {
            'live_now': {
                'en': 'LIVE NOW',
                'hi': 'लाइव नाउ',
                'ur': 'لائیو اب',
                'mr': 'लाइव्ह आत्ता'
            },
            'motivation_feed': {
                'en': 'Motivation Feed',
                'hi': 'मोटिवेशन फीड',
                'ur': 'حوصلہ افزائی فیڈ',
                'mr': 'प्रेरणा फीड'
            },
            'real_time_updates': {
                'en': 'Real-time updates from Deepak Chauhan × AI Bhai',
                'hi': 'Deepak Chauhan × AI Bhai से real-time updates',
                'ur': 'دیپک چوہان × AI بھائی سے ریئل ٹائم اپ ڈیٹس',
                'mr': 'दीपक चौहान × AI भाऊ कडून रिअल-टाइम अद्यतने'
            },
            'online': {
                'en': 'Online',
                'hi': 'ऑनलाइन',
                'ur': 'آن لائن',
                'mr': 'ऑनलाइन'
            },
            'active_now': {
                'en': 'Active Now',
                'hi': 'अभी Active',
                'ur': 'ابھی ایکٹو',
                'mr': 'आत्ता सक्रिय'
            },
            'fire': {
                'en': 'Fire',
                'hi': 'फायर',
                'ur': 'فائر',
                'mr': 'फायर'
            },
            'strong': {
                'en': 'Strong',
                'hi': 'स्ट्रॉन्ग',
                'ur': 'سٹرونگ',
                'mr': 'स्ट्रॉन्ग'
            },
            'rocket': {
                'en': 'Rocket',
                'hi': 'रॉकेट',
                'ur': 'راکٹ',
                'mr': 'रॉकेट'
            },
            'thanks': {
                'en': 'Thanks',
                'hi': 'थैंक्स',
                'ur': 'شکریہ',
                'mr': 'धन्यवाद'
            },
            'new_messages': {
                'en': 'New messages available',
                'hi': 'नए messages available',
                'ur': 'نئے messages available',
                'mr': 'नवीन संदेश उपलब्ध'
            },
            'new_messages_count': {
                'en': '{count} new messages',
                'hi': '{count} नए messages',
                'ur': '{count} نئے messages',
                'mr': '{count} नवीन संदेश'
            },
            'load_new': {
                'en': 'Load New',
                'hi': 'नए लोड करें',
                'ur': 'نئے لوڈ کریں',
                'mr': 'नवीन लोड करा'
            },
            'share_placeholder': {
                'en': 'Share your motivation...',
                'hi': 'अपनी motivation share करें...',
                'ur': 'اپنی motivation share کریں...',
                'mr': 'तुमची प्रेरणा शेअर करा...'
            },
            'enable_notifications': {
                'en': 'Enable Live Notifications',
                'hi': 'Live Notifications enable करें',
                'ur': 'لائیو اطلاعات فعال کریں',
                'mr': 'लाइव्ह सूचना सक्षम करा'
            },
            'reaction_sent': {
                'en': 'Reaction Sent!',
                'hi': 'Reaction भेज दी!',
                'ur': 'ری ایکشن بھیج دی!',
                'mr': 'प्रतिक्रिया पाठवली!'
            },
            'live': {
                'en': 'LIVE',
                'hi': 'लाइव',
                'ur': 'لائیو',
                'mr': 'लाइव्ह'
            },
            'just_now': {
                'en': 'Just now',
                'hi': 'अभी',
                'ur': 'ابھی',
                'mr': 'नुकतेच'
            },
            'min_ago': {
                'en': 'm ago',
                'hi': 'मिनट पहले',
                'ur': 'منٹ پہلے',
                'mr': 'मिनिटांपूर्वी'
            },
            'hour_ago': {
                'en': 'h ago',
                'hi': 'घंटे पहले',
                'ur': 'گھنٹے پہلے',
                'mr': 'तासांपूर्वी'
            },
            'day_ago': {
                'en': 'd ago',
                'hi': 'दिन पहले',
                'ur': 'دن پہلے',
                'mr': 'दिवसांपूर्वी'
            },
            'enter_message': {
                'en': 'Please enter a message',
                'hi': 'कृपया एक message enter करें',
                'ur': 'براہ کرم ایک میسج درج کریں',
                'mr': 'कृपया एक संदेश प्रविष्ट करा'
            },
            'you': {
                'en': 'You',
                'hi': 'आप',
                'ur': 'آپ',
                'mr': 'तू'
            },
            'message_sent': {
                'en': 'Message sent successfully!',
                'hi': 'Message successfully send हो गई!',
                'ur': 'پیغام کامیابی سے بھیج دیا!',
                'mr': 'संदेश यशस्वीरित्या पाठवला!'
            },
            'copied_clipboard': {
                'en': 'Copied to clipboard!',
                'hi': 'Clipboard में copy हो गया!',
                'ur': 'کلپ بورڈ میں کاپی ہو گیا!',
                'mr': 'क्लिपबोर्डवर कॉपी झाला!'
            },
            'notification_blocked': {
                'en': 'Notifications are blocked. Please enable them in browser settings.',
                'hi': 'Notifications blocked हैं। कृपया browser settings में enable करें।',
                'ur': 'اطلاعات بلاک ہیں۔ براہ کرم براؤزر کی ترتیبات میں انہیں فعال کریں۔',
                'mr': 'सूचना अवरोधित आहेत. कृपया ब्राउझर सेटिंग्जमध्ये त्या सक्षम करा.'
            }
        };

        const translation = translations[key]?.[this.currentLanguage] || translations[key]?.['en'];
        return typeof translation === 'string' ? translation : translation;
    }
}

// Initialize the live feed
const liveFeed = new LiveMotivationFeed();

// Make functions global for HTML onclick
function sendQuickReaction(emoji) {
    liveFeed.sendQuickReaction(emoji);
}

function loadNewMessages() {
    liveFeed.loadNewMessages();
}

function sendMessage() {
    liveFeed.sendMessage();
}

function toggleNotifications() {
    liveFeed.toggleNotifications();
}