// Integration with main language system
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.lang-dropdown button')) {
            setTimeout(() => {
                if (window.communityWall) {
                    window.communityWall.loadLanguage();
                    window.communityWall.renderPosts();
                }
            }, 100);
        }
    });
});

window.communityWall = communityWall;