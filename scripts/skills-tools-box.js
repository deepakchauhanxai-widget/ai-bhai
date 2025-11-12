// Skills & Tools Power Box JavaScript
console.log('💼 skills-tools-box.js loaded');

class SkillsToolsBox {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎯 Initializing Skills & Tools Box...');
        this.setupEventListeners();
        this.setupAnimations();
        console.log('✅ Skills & Tools Box Ready!');
    }

    setupEventListeners() {
        // Button hover effects
        const buttons = document.querySelectorAll('.power-btn, .cta-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', this.handleButtonHover);
            btn.addEventListener('mouseleave', this.handleButtonLeave);
        });

        // Image load handling
        const images = document.querySelectorAll('.power-image');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            img.addEventListener('error', () => {
                console.warn('Image failed to load:', img.src);
                img.style.opacity = '0.5';
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.power-card');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    handleButtonHover(e) {
        const btn = e.target;
        btn.style.transform = 'translateY(-2px)';
    }

    handleButtonLeave(e) {
        const btn = e.target;
        btn.style.transform = 'translateY(0)';
    }
}

// Global Functions
function openFreelancingSkills() {
    showPowerNotification('🚀 Opening Freelancing Skills Portal...');
    // Add your navigation logic here
    setTimeout(() => {
        window.open('freelancing-skills.html', '_blank');
    }, 1000);
}

function startFreelancingJourney() {
    showPowerNotification('🎯 Starting Your Freelancing Journey...');
    // Add your navigation logic here
    setTimeout(() => {
        window.open('get-started.html', '_blank');
    }, 1000);
}

function exploreToolsPanel() {
    showPowerNotification('🛠️ Exploring AI Tools Panel...');
    // Add your navigation logic here
}

function openToolsPanel() {
    showPowerNotification('⚡ Opening Full Tools Panel...');
    // Add your navigation logic here
    setTimeout(() => {
        window.open('tools-panel.html', '_blank');
    }, 1000);
}

function showPowerNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.power-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'power-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✨</span>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #2980b9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 300px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.notification-icon {
    font-size: 1.2rem;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
}
`;

// Inject styles
if (!document.querySelector('#power-box-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'power-box-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.skillsToolsBox = new SkillsToolsBox();
});

console.log('✅ skills-tools-box.js loaded successfully');