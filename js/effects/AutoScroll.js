/**
 * Auto Scroll - Automatic smooth scrolling with play/pause control
 * @module AutoScroll
 */

export class AutoScroll {
    constructor() {
        this.isActive = false;
        this.fastSpeed = 1.5;  // Faster speed until Sungai Jernih (45%)
        this.slowSpeed = 0.5;  // Normal speed after
        this.lastScrollTime = 0;
        this.userScrollTimeout = null;
        this.isPausedByUser = false;
        this.button = null;

        this.init();
    }

    init() {
        this.createButton();
        this.bindEvents();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.id = 'auto-scroll-btn';
        this.button.className = 'auto-scroll-btn';
        this.button.innerHTML = `
            <span class="icon">▶</span>
            <span class="text">Auto Scroll</span>
        `;
        this.button.title = 'Auto Scroll';

        document.body.appendChild(this.button);

        this.button.addEventListener('click', () => this.toggle());
    }

    bindEvents() {
        // Pause on user scroll
        window.addEventListener('wheel', () => this.onUserScroll(), { passive: true });
        window.addEventListener('touchmove', () => this.onUserScroll(), { passive: true });

        // Pause on key scroll
        window.addEventListener('keydown', (e) => {
            if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
                this.onUserScroll();
            }
        });
    }

    onUserScroll() {
        if (!this.isActive) return;

        // Pause auto-scroll when user scrolls manually
        this.isPausedByUser = true;
        this.updateButtonState();

        // Resume after 2 seconds of no user scroll
        clearTimeout(this.userScrollTimeout);
        this.userScrollTimeout = setTimeout(() => {
            if (this.isActive) {
                this.isPausedByUser = false;
                this.updateButtonState();
            }
        }, 2000);
    }

    toggle() {
        this.isActive = !this.isActive;
        this.isPausedByUser = false;
        this.updateButtonState();

        if (this.isActive) {
            this.startScrolling();
        }
    }

    start() {
        this.isActive = true;
        this.isPausedByUser = false;
        this.updateButtonState();
        this.startScrolling();
    }

    stop() {
        this.isActive = false;
        this.isPausedByUser = false;
        this.updateButtonState();
    }

    startScrolling() {
        if (!this.isActive) return;

        const scroll = () => {
            if (!this.isActive) return;

            if (!this.isPausedByUser) {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const currentScroll = window.scrollY;
                const scrollProgress = currentScroll / maxScroll;

                // Variable speed: faster until "Sungai Jernih" (~45%), slower after
                const currentSpeed = scrollProgress < 0.45 ? this.fastSpeed : this.slowSpeed;

                if (currentScroll < maxScroll) {
                    window.scrollBy(0, currentSpeed);
                } else {
                    // Reached end, stop
                    this.stop();
                    return;
                }
            }

            requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);
    }

    setSpeed(speed) {
        this.slowSpeed = speed;
    }

    setFastSpeed(speed) {
        this.fastSpeed = speed;
    }

    updateButtonState() {
        if (this.isActive && !this.isPausedByUser) {
            this.button.classList.add('active');
            this.button.classList.remove('paused');
            this.button.querySelector('.icon').textContent = '⏸';
            this.button.querySelector('.text').textContent = 'Scrolling...';
        } else if (this.isActive && this.isPausedByUser) {
            this.button.classList.add('active', 'paused');
            this.button.querySelector('.icon').textContent = '⏸';
            this.button.querySelector('.text').textContent = 'Paused';
        } else {
            this.button.classList.remove('active', 'paused');
            this.button.querySelector('.icon').textContent = '▶';
            this.button.querySelector('.text').textContent = 'Auto Scroll';
        }
    }

    isScrolling() {
        return this.isActive && !this.isPausedByUser;
    }
}
