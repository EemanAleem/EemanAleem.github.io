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
    const SCROLL_SPEED = 2.0; // Playback speed while scrolling
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
                alert('Copied email: eemanaleem@gmail.com'); 
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

    // Inject expand icon into portfolio media items
    document.querySelectorAll('.portfolio-media-item').forEach(item => {
        const media = item.querySelector('img, video');
        if (!media) return;

        // Create a tight wrapper around just the media element
        const wrapper = document.createElement('div');
        wrapper.className = 'portfolio-media-wrapper';
        media.parentNode.insertBefore(wrapper, media);
        wrapper.appendChild(media);

        // Append icon inside the media wrapper
        const icon = document.createElement('i');
        icon.className = 'bx bx-maximize';
        wrapper.appendChild(icon);
    });


    // Quick Image Lightbox
    document.addEventListener('click', (e) => {
        if (e.target.matches('.portfolio-media-item img')) {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);backdrop-filter:blur(5px);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:20px;';
            overlay.innerHTML = `<img src="${e.target.src}" style="max-width:90vw;max-height:85vh;border-radius:8px;border:2px solid #ff4d4d;box-shadow:0 0 30px rgba(0,0,0,0.8);object-fit:contain;">`;
            overlay.onclick = () => overlay.remove();
            document.body.appendChild(overlay);
        }
    });

    let menuIcon = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        };

        // Close menu when a navigation link is clicked
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.classList.remove('bx-x');
                navbar.classList.remove('active');
            });
        });
    }
});