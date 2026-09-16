document.addEventListener("DOMContentLoaded", function() {
    console.log('page loaded');

    const bgVideo = document.getElementById('bg-video');
    const glassPanels = document.querySelectorAll('.glass-panel');

    document.documentElement.style.scrollBehavior = 'smooth';

    if (bgVideo) {
        bgVideo.muted = true;
        bgVideo.defaultMuted = true;
        bgVideo.loop = true;
        bgVideo.play().catch(error => {
            console.log("Autoplay prevented by browser:", error);
        });
    }

    // 2. Dynamic Playback Speed on Scroll
    let scrollTimeout;
    const NORMAL_SPEED = 1.0;
    const SCROLL_SPEED = 7.0; // Playback speed while scrolling
    window.addEventListener('scroll', () => {
        if (!bgVideo || bgVideo.readyState < 2) return;

        if (bgVideo.playbackRate !== SCROLL_SPEED) {
            bgVideo.playbackRate = SCROLL_SPEED;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            bgVideo.playbackRate = NORMAL_SPEED;
        }, 150);
    }, { passive: true });


    // Focus observer for cards
    const observerOptions = {
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                glassPanels.forEach(p => {
                    p.classList.remove('active-focus');
                    p.style.setProperty('--pointer-opacity', '0');
                });
                entry.target.classList.add('active-focus');
                entry.target.style.setProperty('--pointer-opacity', '1');

                entry.target.classList.remove('active-glitch');
                void entry.target.offsetWidth; 
                entry.target.classList.add('active-glitch');
            }
        });
    }, observerOptions);

    glassPanels.forEach(panel => observer.observe(panel));
});