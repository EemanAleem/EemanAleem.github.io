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
    const SCROLL_SPEED = 1.5; // Playback speed while scrolling
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

    document.querySelectorAll('.copy-link').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevents page jumping to top
            const textToCopy = this.getAttribute('data-text');

            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Text copied to clipboard!'); 
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // Portfolio Popup Overlay & Navigation
    const overlay = document.getElementById('portfolio-overlay');
    const overlayBody = document.getElementById('portfolio-overlay-body');
    const closeBtn = document.querySelector('.portfolio-close-btn');
    const prevBtn = document.querySelector('.portfolio-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.portfolio-nav-btn.next-btn');
    const projects = Array.from(document.querySelectorAll('.portfolio-project'));

    let currentProjectIndex = 0;

    function renderProjectModal(index) {
        const project = projects[index];
        const title = project.querySelector('h3')?.outerHTML || '';
        const subtitle = project.querySelector('h4')?.outerHTML || '';
        const tags = project.querySelector('.portfolio-tags')?.cloneNode(true);
        const details = project.querySelector('.project-details')?.cloneNode(true);

        // Place tag pills directly below bullet points and before links
        if (details && tags) {
            const links = details.querySelector('.portfolio-links');
            if (links) {
                details.insertBefore(tags, links);
            } else {
                details.appendChild(tags);
            }
        }

        overlayBody.innerHTML = `
            ${title}
            ${subtitle}
            ${details ? details.innerHTML : ''}
        `;
    }

    projects.forEach((project, index) => {
        project.addEventListener('click', () => {
            currentProjectIndex = index;
            renderProjectModal(currentProjectIndex);
            overlay.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
            renderProjectModal(currentProjectIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex + 1) % projects.length;
            renderProjectModal(currentProjectIndex);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });


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