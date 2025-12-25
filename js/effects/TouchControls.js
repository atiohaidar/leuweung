/**
 * Touch Controls - Mobile touch gesture handler for 3D navigation
 * Provides pinch-to-zoom, swipe navigation, and touch interactions
 * @module TouchControls
 */

import { CONFIG } from '../config.js';

export class TouchControls {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();
        this.enabled = true;

        // Touch state
        this.touches = [];
        this.initialPinchDistance = 0;
        this.initialFOV = 60;
        this.lastTouchY = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;

        // Momentum scrolling
        this.velocity = 0;
        this.isScrolling = false;
        this.momentumId = null;

        // Configuration
        this.config = CONFIG.mobile || {};
        this.sensitivity = this.config.touchSensitivity || 1.5;
        this.minFOV = 30;
        this.maxFOV = 90;
        this.swipeThreshold = 50; // px
        this.tapThreshold = 10;   // px
        this.tapTimeThreshold = 300; // ms

        this.init();
    }

    init() {
        const canvas = this.sceneManager.getRenderer().domElement;

        // Touch event listeners
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        canvas.addEventListener('touchcancel', this.onTouchEnd.bind(this), { passive: false });

        // Prevent default gestures on the canvas
        canvas.style.touchAction = 'none';

        console.log('👆 TouchControls: Initialized');
    }

    onTouchStart(e) {
        if (!this.enabled) return;

        this.touches = Array.from(e.touches);
        this.touchStartTime = Date.now();

        // Cancel momentum
        if (this.momentumId) {
            cancelAnimationFrame(this.momentumId);
            this.momentumId = null;
        }
        this.velocity = 0;

        if (this.touches.length === 1) {
            // Single touch - prepare for scroll/tap
            this.touchStartY = this.touches[0].clientY;
            this.lastTouchY = this.touchStartY;
            this.isScrolling = false;
        } else if (this.touches.length === 2) {
            // Two fingers - prepare for pinch
            this.initialPinchDistance = this.getPinchDistance(this.touches);
            this.initialFOV = this.camera.fov;
            e.preventDefault();
        }
    }

    onTouchMove(e) {
        if (!this.enabled) return;

        this.touches = Array.from(e.touches);

        if (this.touches.length === 1) {
            // Single touch - scroll
            const touch = this.touches[0];
            const deltaY = this.lastTouchY - touch.clientY;

            // Track if this is a scroll (not a tap)
            if (Math.abs(touch.clientY - this.touchStartY) > this.tapThreshold) {
                this.isScrolling = true;
            }

            if (this.isScrolling) {
                // Calculate velocity for momentum
                this.velocity = deltaY * this.sensitivity;

                // Scroll the page
                window.scrollBy(0, deltaY * this.sensitivity);
                e.preventDefault();
            }

            this.lastTouchY = touch.clientY;
        } else if (this.touches.length === 2) {
            // Two fingers - pinch to zoom (adjust FOV)
            const currentDistance = this.getPinchDistance(this.touches);
            const scale = this.initialPinchDistance / currentDistance;

            let newFOV = this.initialFOV * scale;
            newFOV = Math.max(this.minFOV, Math.min(this.maxFOV, newFOV));

            this.camera.fov = newFOV;
            this.camera.updateProjectionMatrix();

            e.preventDefault();
        }
    }

    onTouchEnd(e) {
        if (!this.enabled) return;

        const touchDuration = Date.now() - this.touchStartTime;
        const touchDistance = Math.abs(this.touches[0]?.clientY - this.touchStartY || 0);

        // Check for tap
        if (!this.isScrolling && touchDuration < this.tapTimeThreshold && touchDistance < this.tapThreshold) {
            this.handleTap(this.touches[0]);
        }

        // Apply momentum scrolling
        if (this.isScrolling && Math.abs(this.velocity) > 1) {
            this.applyMomentum();
        }

        this.touches = Array.from(e.touches);
        this.isScrolling = false;
    }

    handleTap(touch) {
        if (!touch) return;

        // Dispatch tap event for object interaction
        const event = new CustomEvent('canvastap', {
            detail: {
                x: touch.clientX,
                y: touch.clientY
            }
        });
        window.dispatchEvent(event);
    }

    applyMomentum() {
        const friction = 0.95;
        const minVelocity = 0.5;

        const animate = () => {
            if (Math.abs(this.velocity) < minVelocity) {
                this.velocity = 0;
                return;
            }

            window.scrollBy(0, this.velocity);
            this.velocity *= friction;

            this.momentumId = requestAnimationFrame(animate);
        };

        this.momentumId = requestAnimationFrame(animate);
    }

    getPinchDistance(touches) {
        if (touches.length < 2) return 0;

        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Reset camera FOV to default
     */
    resetZoom() {
        this.camera.fov = CONFIG.camera?.fov || 60;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Enable/disable touch controls
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled && this.momentumId) {
            cancelAnimationFrame(this.momentumId);
            this.momentumId = null;
        }
    }

    /**
     * Update method (called each frame)
     */
    update() {
        // Can be used for continuous updates if needed
    }

    /**
     * Clean up event listeners
     */
    dispose() {
        const canvas = this.sceneManager.getRenderer().domElement;
        canvas.removeEventListener('touchstart', this.onTouchStart);
        canvas.removeEventListener('touchmove', this.onTouchMove);
        canvas.removeEventListener('touchend', this.onTouchEnd);
        canvas.removeEventListener('touchcancel', this.onTouchEnd);

        if (this.momentumId) {
            cancelAnimationFrame(this.momentumId);
        }
    }
}
