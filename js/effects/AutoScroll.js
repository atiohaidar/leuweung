/**
 * Auto Scroll - Automatic smooth scrolling with play/pause control
 * Supports bidirectional scrolling (down/up) with smart direction detection
 * All configuration is read from config.js for easier maintenance
 * @module AutoScroll
 */

import { CONFIG } from '../config.js';

// Direction constants for clarity
const DIRECTION = {
    DOWN: 1,
    UP: -1
};

// State constants
const STATE = {
    IDLE: 'idle',
    SCROLLING: 'scrolling',
    PAUSED: 'paused'
};

export class AutoScroll {
    constructor() {
        // Load configuration with defaults
        this.config = this._loadConfig();

        // State management
        this.state = STATE.IDLE;
        this.direction = DIRECTION.DOWN;
        this.userScrollTimeout = null;

        // DOM elements
        this.button = null;
        this.iconEl = null;
        this.textEl = null;

        // Animation frame ID for cleanup
        this.animationId = null;

        this._init();
    }

    /**
     * Load and merge configuration with defaults
     * @private
     */
    _loadConfig() {
        const userConfig = CONFIG.effects?.autoScroll || {};

        return {
            // Speed settings
            fastSpeed: userConfig.fastSpeed ?? 1.5,
            slowSpeed: userConfig.slowSpeed ?? 0.5,
            scrollThreshold: userConfig.scrollThreshold ?? 0.45,
            reverseSpeedMultiplier: userConfig.reverseSpeedMultiplier ?? 3,

            // Timing
            resumeDelay: userConfig.resumeDelay ?? 2000,
            bottomThreshold: userConfig.bottomThreshold ?? 50,

            // Labels
            labels: {
                scrollDown: userConfig.labels?.scrollDown ?? 'Auto Scroll',
                scrollUp: userConfig.labels?.scrollUp ?? 'Scroll Up',
                scrolling: userConfig.labels?.scrolling ?? 'Scrolling...',
                reversing: userConfig.labels?.reversing ?? 'Reversing...',
                resume: userConfig.labels?.resume ?? 'Resume',
                paused: userConfig.labels?.paused ?? 'Paused'
            },

            // Icons
            icons: {
                down: userConfig.icons?.down ?? '▼',
                up: userConfig.icons?.up ?? '▲',
                pause: userConfig.icons?.pause ?? '⏸',
                play: userConfig.icons?.play ?? '▶'
            },

            // Events
            pauseEvents: userConfig.pauseEvents ?? ['wheel', 'touchmove', 'touchstart', 'mousedown', 'keydown'],
            pauseKeys: userConfig.pauseKeys ?? ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End']
        };
    }

    /**
     * Initialize the component
     * @private
     */
    _init() {
        this._createButton();
        this._bindEvents();
    }

    // ========================================
    // DOM Creation
    // ========================================

    /**
     * Create the auto-scroll button element
     * @private
     */
    _createButton() {
        this.button = document.createElement('button');
        this.button.id = 'auto-scroll-btn';
        this.button.className = 'auto-scroll-btn';
        this.button.title = 'Auto Scroll';

        // Create inner elements
        this.iconEl = document.createElement('span');
        this.iconEl.className = 'icon';

        this.textEl = document.createElement('span');
        this.textEl.className = 'text';

        this.button.appendChild(this.iconEl);
        this.button.appendChild(this.textEl);

        document.body.appendChild(this.button);

        // Set initial state
        this._updateUI();

        // Bind click handler
        this.button.addEventListener('click', () => this.toggle());
    }

    // ========================================
    // Event Binding
    // ========================================

    /**
     * Bind all event listeners
     * @private
     */
    _bindEvents() {
        // User interaction events that should pause scrolling
        this.config.pauseEvents.forEach(eventType => {
            window.addEventListener(eventType, (e) => this._handleUserEvent(e, eventType), { passive: true });
        });

        // Scroll position monitoring for UI updates when idle
        window.addEventListener('scroll', () => this._handleScrollEvent(), { passive: true });
    }

    /**
     * Handle user interaction events
     * @private
     */
    _handleUserEvent(event, eventType) {
        // For keydown, only react to scroll-related keys
        if (eventType === 'keydown') {
            if (!this.config.pauseKeys.includes(event.code)) {
                return;
            }
        }

        this._pauseByUser();
    }

    /**
     * Handle scroll events (for UI updates when idle)
     * @private
     */
    _handleScrollEvent() {
        if (this.state === STATE.IDLE) {
            this._updateUI();
        }
    }

    // ========================================
    // State Management
    // ========================================

    /**
     * Pause scrolling due to user interaction
     * @private
     */
    _pauseByUser() {
        if (this.state !== STATE.SCROLLING) return;

        this.state = STATE.PAUSED;
        this._updateUI();

        // Schedule auto-resume
        this._scheduleResume();
    }

    /**
     * Schedule automatic resume after pause
     * @private
     */
    _scheduleResume() {
        clearTimeout(this.userScrollTimeout);

        this.userScrollTimeout = setTimeout(() => {
            if (this.state === STATE.PAUSED) {
                this.state = STATE.SCROLLING;
                this._updateUI();
            }
        }, this.config.resumeDelay);
    }

    /**
     * Determine scroll direction based on current position
     * @private
     */
    _determineDirection() {
        if (this._isAtBottom()) {
            this.direction = DIRECTION.UP;
        } else {
            this.direction = DIRECTION.DOWN;
        }
    }

    // ========================================
    // Scroll Position Helpers
    // ========================================

    /**
     * Get maximum scroll position
     * @private
     */
    _getMaxScroll() {
        return document.documentElement.scrollHeight - window.innerHeight;
    }

    /**
     * Check if at bottom of page
     * @private
     */
    _isAtBottom() {
        return window.scrollY >= this._getMaxScroll() - this.config.bottomThreshold;
    }

    /**
     * Check if at top of page
     * @private
     */
    _isAtTop() {
        return window.scrollY <= 0;
    }

    /**
     * Get current scroll progress (0-1)
     * @private
     */
    _getScrollProgress() {
        const maxScroll = this._getMaxScroll();
        return maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }

    /**
     * Calculate current scroll speed based on progress
     * @private
     */
    _getCurrentSpeed() {
        const progress = this._getScrollProgress();
        const baseSpeed = progress < this.config.scrollThreshold
            ? this.config.fastSpeed
            : this.config.slowSpeed;

        // Apply multiplier for reverse scrolling
        if (this.direction === DIRECTION.UP) {
            return baseSpeed * this.config.reverseSpeedMultiplier;
        }

        return baseSpeed;
    }

    // ========================================
    // Public API
    // ========================================

    /**
     * Toggle auto-scroll on/off
     */
    toggle() {
        if (this.state === STATE.IDLE) {
            this.start();
        } else {
            this.stop();
        }
    }

    /**
     * Start auto-scrolling (default: downward)
     * @param {number} [direction] - DIRECTION.DOWN or DIRECTION.UP
     */
    start(direction = null) {
        // Determine direction if not specified
        if (direction === null) {
            this._determineDirection();
        } else {
            this.direction = direction;
        }

        this.state = STATE.SCROLLING;
        this._updateUI();
        this._startScrollLoop();
    }

    /**
     * Stop auto-scrolling
     */
    stop() {
        this.state = STATE.IDLE;
        clearTimeout(this.userScrollTimeout);

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this._updateUI();
    }

    /**
     * Check if currently scrolling
     * @returns {boolean}
     */
    isScrolling() {
        return this.state === STATE.SCROLLING;
    }

    /**
     * Check if currently active (scrolling or paused)
     * @returns {boolean}
     */
    isActive() {
        return this.state !== STATE.IDLE;
    }

    /**
     * Set scroll speed
     * @param {number} speed - New slow speed value
     */
    setSpeed(speed) {
        this.config.slowSpeed = speed;
    }

    /**
     * Set fast scroll speed
     * @param {number} speed - New fast speed value
     */
    setFastSpeed(speed) {
        this.config.fastSpeed = speed;
    }

    // ========================================
    // Scroll Animation
    // ========================================

    /**
     * Start the scroll animation loop
     * @private
     */
    _startScrollLoop() {
        const scrollStep = () => {
            if (this.state === STATE.IDLE) return;

            if (this.state === STATE.SCROLLING) {
                const shouldContinue = this._performScrollStep();

                if (!shouldContinue) {
                    this.stop();
                    return;
                }
            }

            this.animationId = requestAnimationFrame(scrollStep);
        };

        this.animationId = requestAnimationFrame(scrollStep);
    }

    /**
     * Perform a single scroll step
     * @private
     * @returns {boolean} - Whether scrolling should continue
     */
    _performScrollStep() {
        const speed = this._getCurrentSpeed();

        if (this.direction === DIRECTION.DOWN) {
            if (!this._isAtBottom()) {
                window.scrollBy(0, speed);
                return true;
            }
        } else {
            if (!this._isAtTop()) {
                window.scrollBy(0, -speed);
                return true;
            }
        }

        return false;
    }

    // ========================================
    // UI Updates
    // ========================================

    /**
     * Update button UI based on current state
     * @private
     */
    _updateUI() {
        const { labels, icons } = this.config;

        // Reset classes
        this.button.classList.remove('active', 'paused');

        switch (this.state) {
            case STATE.SCROLLING:
                this.button.classList.add('active');
                this.iconEl.textContent = icons.pause;
                this.textEl.textContent = this.direction === DIRECTION.DOWN
                    ? labels.scrolling
                    : labels.reversing;
                break;

            case STATE.PAUSED:
                this.button.classList.add('active', 'paused');
                this.iconEl.textContent = icons.play;
                this.textEl.textContent = labels.resume;
                break;

            case STATE.IDLE:
            default:
                if (this._isAtBottom()) {
                    this.iconEl.textContent = icons.up;
                    this.textEl.textContent = labels.scrollUp;
                } else {
                    this.iconEl.textContent = icons.down;
                    this.textEl.textContent = labels.scrollDown;
                }
                break;
        }
    }

    // ========================================
    // Cleanup
    // ========================================

    /**
     * Destroy the component and clean up
     */
    destroy() {
        this.stop();

        if (this.button && this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }

        this.button = null;
        this.iconEl = null;
        this.textEl = null;
    }
}
