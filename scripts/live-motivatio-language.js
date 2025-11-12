// Integration with main language system
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.lang-dropdown button')) {
            setTimeout(() => {
                if (window.liveFeed) {
                    window.liveFeed.loadLanguage();
                    window.liveFeed.renderMessages();
                }
            }, 100);
        }
    });
});

window.liveFeed = liveFeed;