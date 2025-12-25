/**
 * Performance Monitor - Monitors FPS and adjusts quality settings dynamically
 * @module PerformanceMonitor
 */

export class PerformanceMonitor {
    constructor(options = {}) {
        this.targetFPS = options.targetFPS || 55;
        this.criticalFPS = options.criticalFPS || 30;
        this.sampleSize = options.sampleSize || 60;
        this.checkInterval = options.checkInterval || 2000; // ms

        this.frameTimes = [];
        this.lastFrameTime = performance.now();
        this.currentFPS = 60;
        this.qualityLevel = 1.0; // 1.0 = full quality, 0.0 = minimum

        this.callbacks = {
            onQualityChange: null,
            onLowFPS: null
        };

        // Quality adjustment history
        this.lastQualityChange = 0;
        this.qualityChangeDelay = 3000; // Wait 3 seconds between adjustments

        // Start monitoring
        this.startMonitoring();
    }

    /**
     * Call this every frame to update FPS calculation
     */
    tick() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.frameTimes.push(deltaTime);

        // Keep only recent samples
        if (this.frameTimes.length > this.sampleSize) {
            this.frameTimes.shift();
        }

        // Calculate average FPS
        if (this.frameTimes.length >= 10) {
            const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
            this.currentFPS = Math.round(1000 / avgFrameTime);
        }
    }

    /**
     * Start automatic quality adjustment monitoring
     */
    startMonitoring() {
        setInterval(() => {
            this.checkAndAdjustQuality();
        }, this.checkInterval);
    }

    /**
     * Check FPS and adjust quality if needed
     */
    checkAndAdjustQuality() {
        const now = performance.now();

        // Don't adjust too frequently
        if (now - this.lastQualityChange < this.qualityChangeDelay) {
            return;
        }

        const oldQuality = this.qualityLevel;

        if (this.currentFPS < this.criticalFPS) {
            // Critical: Reduce quality significantly
            this.qualityLevel = Math.max(0.3, this.qualityLevel - 0.2);
            console.warn(`⚠️ Critical FPS (${this.currentFPS}), reducing quality to ${Math.round(this.qualityLevel * 100)}%`);

            if (this.callbacks.onLowFPS) {
                this.callbacks.onLowFPS(this.currentFPS, this.qualityLevel);
            }
        } else if (this.currentFPS < this.targetFPS) {
            // Below target: Reduce quality slightly
            this.qualityLevel = Math.max(0.5, this.qualityLevel - 0.1);
            console.log(`📉 Low FPS (${this.currentFPS}), reducing quality to ${Math.round(this.qualityLevel * 100)}%`);
        } else if (this.currentFPS >= 58 && this.qualityLevel < 1.0) {
            // Good FPS: Try to increase quality
            this.qualityLevel = Math.min(1.0, this.qualityLevel + 0.05);
            console.log(`📈 Good FPS (${this.currentFPS}), increasing quality to ${Math.round(this.qualityLevel * 100)}%`);
        }

        if (oldQuality !== this.qualityLevel) {
            this.lastQualityChange = now;

            if (this.callbacks.onQualityChange) {
                this.callbacks.onQualityChange(this.qualityLevel, this.currentFPS);
            }
        }
    }

    /**
     * Get current FPS
     * @returns {number}
     */
    getFPS() {
        return this.currentFPS;
    }

    /**
     * Get current quality level (0-1)
     * @returns {number}
     */
    getQualityLevel() {
        return this.qualityLevel;
    }

    /**
     * Get adjusted count based on quality level
     * @param {number} baseCount - Original count
     * @returns {number} Adjusted count
     */
    getAdjustedCount(baseCount) {
        return Math.max(1, Math.floor(baseCount * this.qualityLevel));
    }

    /**
     * Set callback for quality changes
     * @param {Function} callback - (qualityLevel, fps) => void
     */
    onQualityChange(callback) {
        this.callbacks.onQualityChange = callback;
    }

    /**
     * Set callback for low FPS warnings
     * @param {Function} callback - (fps, qualityLevel) => void
     */
    onLowFPS(callback) {
        this.callbacks.onLowFPS = callback;
    }

    /**
     * Force a quality level (for testing or manual override)
     * @param {number} level - Quality level (0-1)
     */
    setQualityLevel(level) {
        this.qualityLevel = Math.max(0, Math.min(1, level));

        if (this.callbacks.onQualityChange) {
            this.callbacks.onQualityChange(this.qualityLevel, this.currentFPS);
        }
    }

    /**
     * Get performance stats for debugging
     * @returns {Object}
     */
    getStats() {
        return {
            fps: this.currentFPS,
            qualityLevel: this.qualityLevel,
            avgFrameTime: this.frameTimes.length > 0
                ? (this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length).toFixed(2)
                : 0,
            minFrameTime: this.frameTimes.length > 0 ? Math.min(...this.frameTimes).toFixed(2) : 0,
            maxFrameTime: this.frameTimes.length > 0 ? Math.max(...this.frameTimes).toFixed(2) : 0
        };
    }
}

// Singleton
let instance = null;

export function getPerformanceMonitor(options = {}) {
    if (!instance) {
        instance = new PerformanceMonitor(options);
    }
    return instance;
}
