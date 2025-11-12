// Integration with main language system
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.lang-dropdown button')) {
            setTimeout(() => {
                if (window.progressTracker) {
                    window.progressTracker.loadLanguage();
                    window.progressTracker.updateDisplay();
                }
            }, 100);
        }
    });
});

window.progressTracker = progressTracker;