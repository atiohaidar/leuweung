/**
 * Auto Scroll - Automatic smooth scrolling with play/pause control
 * Reads configuration from config.js for easier tuning
 * @module AutoScroll
 */

import { CONFIG } from '../config.js';

export class AutoScroll {
    constructor() {
        this.isActive = false;
        this.direction = 1; // 1 for down, -1 for up

        // Load configuration
        const config = CONFIG.effects?.autoScroll || {};
        this.fastSpeed = config.fastSpeed || 1.5;
        this.slowSpeed = config.slowSpeed || 0.5;
        this.scrollThreshold = config.scrollThreshold || 0.45;

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
            <span class="icon">▼</span>
            <span class="text">Auto Scroll</span>
        `;
        this.button.title = 'Auto Scroll';

        document.body.appendChild(this.button);

        this.button.addEventListener('click', () => this.toggle());
    }

    bindEvents() {
        // User interactions that should pause scrolling
        const interactions = ['wheel', 'touchmove', 'touchstart', 'mousedown', 'keydown'];

        interactions.forEach(event => {
            window.addEventListener(event, (e) => {
                // For keydown, only pause on scroll keys
                if (event === 'keydown') {
                    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code)) {
                        this.onUserInteraction();
                    }
                    return;
                }
                this.onUserInteraction();
            }, { passive: true });
        });

        // Monitor scroll position for UI updates (e.g. at bottom) only when not active
        // When active, the loop handles the stopping condition.
        window.addEventListener('scroll', () => {
            if (!this.isActive) {
                this.updateButtonState();
            }
        }, { passive: true });
    }

    onUserInteraction() {
        if (!this.isActive) return;

        // Pause auto-scroll when user scrolls manually
        this.isPausedByUser = true;
        this.updateButtonState();

        // Resume after 2 seconds of no user interaction
        clearTimeout(this.userScrollTimeout);
        this.userScrollTimeout = setTimeout(() => {
            if (this.isActive) {
                this.isPausedByUser = false;
                this.updateButtonState();
            }
        }, 2000);
    }

    toggle() {
        if (!this.isActive) {
            // Determine direction before starting
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (window.scrollY >= maxScroll - 50) {
                this.direction = -1; // Start scrolling up
            } else {
                this.direction = 1; // Start scrolling down
            }
        }

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
        this.direction = 1; // Default to down start
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

                // Variable speed based on configuration
                const currentSpeed = scrollProgress < this.scrollThreshold ? this.fastSpeed : this.slowSpeed;

                if (this.direction === 1) {
                    // Scrolling Down
                    if (currentScroll < maxScroll) {
                        window.scrollBy(0, currentSpeed);
                    } else {
                        this.stop();
                        return;
                    }
                } else {
                    // Scrolling Up
                    if (currentScroll > 0) {
                        window.scrollBy(0, -currentSpeed * 3); // Faster scroll up for convenience
                    } else {
                        this.stop();
                        return;
                    }
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
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const atBottom = window.scrollY >= maxScroll - 50;

        if (this.isActive && !this.isPausedByUser) {
            this.button.classList.add('active');
            this.button.classList.remove('paused');
            this.button.querySelector('.icon').textContent = '⏸';
            this.button.querySelector('.text').textContent = this.direction === 1 ? 'Scrolling...' : 'Reversing...';

        } else if (this.isActive && this.isPausedByUser) {
            this.button.classList.add('active', 'paused');
            this.button.querySelector('.icon').textContent = '▶';
            this.button.querySelector('.text').textContent = 'Resume';

        } else {
            this.button.classList.remove('active', 'paused');

            if (atBottom) {
                this.button.querySelector('.icon').textContent = '▲';
                this.button.querySelector('.text').textContent = 'Scroll Up';
            } else {
                this.button.querySelector('.icon').textContent = '▼';
                this.button.querySelector('.text').textContent = 'Auto Scroll';
            }
        }
    }

    isScrolling() {
        return this.isActive && !this.isPausedByUser;
    }
}
