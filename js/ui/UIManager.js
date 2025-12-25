/**
 * UI Manager - Handles all UI-related logic
 * Separates UI concerns from main application logic
 * @module UIManager
 */

import { CONFIG } from '../config.js';

export class UIManager {
    constructor(effects) {
        this.effects = effects;
        this.panel = null;
        this.backButton = null;
        this.controlsConfig = CONFIG.ui?.controls || [];

        this.init();
    }

    init() {
        this.createControlsPanel();
        this.createBackButton();
    }

    createControlsPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'controls-panel';

        // Generate control buttons from config
        const controlsHTML = this.controlsConfig.map(control => {
            if (control.type === 'action') {
                return `
                    <div class="control-group">
                        <label>${control.label}</label>
                        <button class="control-btn photo-btn" data-control="${control.id}">${control.icon || control.id}</button>
                    </div>
                `;
            } else if (control.type === 'cycle') {
                return `
                    <div class="control-group">
                        <label>${control.label}</label>
                        <button class="control-btn season-btn" data-control="${control.id}">${control.defaultValue || ''}</button>
                    </div>
                `;
            } else {
                const isActive = control.defaultActive ? 'active' : '';
                const text = control.defaultActive ? 'ON' : 'OFF';
                return `
                    <div class="control-group">
                        <label>${control.label}</label>
                        <button class="control-btn ${isActive}" data-control="${control.id}">${text}</button>
                    </div>
                `;
            }
        }).join('');

        this.panel.innerHTML = `
            <div class="controls-toggle" title="Toggle Controls">⚙️</div>
            <div class="controls-content">
                <h3>🎮 Kontrol</h3>
                ${controlsHTML}
            </div>
        `;

        document.body.appendChild(this.panel);

        // Toggle panel
        const toggle = this.panel.querySelector('.controls-toggle');
        toggle.addEventListener('click', () => {
            this.panel.classList.toggle('open');
        });

        // Setup control buttons
        this.setupControlButtons();
    }

    setupControlButtons() {
        // Magic particles toggle
        const magicBtn = this.panel.querySelector('[data-control="magic"]');
        if (magicBtn && this.effects.magicParticles) {
            magicBtn.addEventListener('click', (e) => {
                const btn = e.target;
                const isActive = btn.classList.toggle('active');
                btn.textContent = isActive ? 'ON' : 'OFF';
                this.effects.magicParticles.setEnabled(isActive);
            });
        }

        // Birds toggle
        const birdsBtn = this.panel.querySelector('[data-control="birds"]');
        if (birdsBtn && this.effects.flyingBirds) {
            birdsBtn.addEventListener('click', (e) => {
                const btn = e.target;
                const isActive = btn.classList.toggle('active');
                btn.textContent = isActive ? 'ON' : 'OFF';
                this.effects.flyingBirds.setEnabled(isActive);
            });
        }

        // Flashlight toggle
        const flashlightBtn = this.panel.querySelector('[data-control="flashlight"]');
        if (flashlightBtn && this.effects.flashlightMode) {
            flashlightBtn.addEventListener('click', (e) => {
                const btn = e.target;
                const isActive = this.effects.flashlightMode.toggle();
                btn.classList.toggle('active', isActive);
                btn.textContent = isActive ? 'ON' : 'OFF';
            });
        }

        // Photo capture
        const photoBtn = this.panel.querySelector('[data-control="photo"]');
        if (photoBtn && this.effects.photoMode) {
            photoBtn.addEventListener('click', () => {
                this.effects.photoMode.capture();
            });
        }

        // Season change
        const seasonBtn = this.panel.querySelector('[data-control="season"]');
        if (seasonBtn && this.effects.seasonalThemes) {
            seasonBtn.addEventListener('click', (e) => {
                const newSeason = this.effects.seasonalThemes.nextSeason();
                e.target.textContent = newSeason.toUpperCase();
            });
        }
    }

    createBackButton() {
        this.backButton = document.createElement('button');
        this.backButton.id = 'back-button';
        this.backButton.innerHTML = '← Kembali';
        document.body.appendChild(this.backButton);
    }

    /**
     * Set back button click handler
     * @param {Function} handler - Click handler function
     */
    onBackButtonClick(handler) {
        this.backButton.addEventListener('click', handler);
    }

    showBackButton() {
        if (this.backButton) {
            this.backButton.classList.add('visible');
        }
    }

    hideBackButton() {
        if (this.backButton) {
            this.backButton.classList.remove('visible');
        }
    }

    /**
     * Show loading screen
     */
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide loading screen with delay
     * @param {number} delay - Delay in milliseconds
     * @returns {Promise}
     */
    hideLoading(delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
                resolve();
            }, delay);
        });
    }

    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.className = 'photo-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    /**
     * Update feature card active states
     * @param {HTMLElement} activeCard - The card to activate
     */
    setActiveCard(activeCard) {
        this.clearActiveCards();
        if (activeCard) {
            activeCard.classList.add('active');
            activeCard.style.borderColor = '#a8e6cf';
            activeCard.style.boxShadow = '0 0 30px rgba(168, 230, 207, 0.5)';
        }
    }

    /**
     * Clear all active card states
     */
    clearActiveCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.classList.remove('active');
            card.style.borderColor = '';
            card.style.boxShadow = '';
        });
    }

    /**
     * Setup hero screen interactions
     * @param {Function} onStart - Callback when start button is clicked
     */
    setupHeroScreen(onStart) {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const heroScreen = document.getElementById('hero-screen');
                if (heroScreen) {
                    heroScreen.classList.add('hidden');
                }

                // Enable auto-scroll immediately
                if (this.effects.autoScroll) {
                    this.effects.autoScroll.start();
                }

                if (onStart) onStart();
            });
        }
    }

    /**
     * Show hero screen
     */
    showHeroScreen() {
        const heroScreen = document.getElementById('hero-screen');
        if (heroScreen) {
            heroScreen.classList.remove('hidden');
        }
    }

    /**
     * Destroy UI Manager and clean up
     */
    destroy() {
        if (this.panel) {
            this.panel.remove();
        }
        if (this.backButton) {
            this.backButton.remove();
        }
    }
}
