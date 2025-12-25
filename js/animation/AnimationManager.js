/**
 * Animation Manager - Handles the main animation loop
 * Uses a registry pattern for updatable objects (Open/Closed Principle)
 * OPTIMIZED: Integrated PerformanceMonitor for adaptive quality
 * @module AnimationManager
 */

import { getPerformanceMonitor } from '../utils/PerformanceMonitor.js';

export class AnimationManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.isRunning = false;
        this.cameraController = null;

        // Registry of all updatable objects
        this.updatables = [];

        // Special handlers that need custom update logic
        this.specialHandlers = new Map();

        // Performance monitoring
        this.performanceMonitor = getPerformanceMonitor();
        this.setupPerformanceCallbacks();

        this.animate = this.animate.bind(this);
    }

    /**
     * Setup callbacks for performance-based quality adjustments
     */
    setupPerformanceCallbacks() {
        this.performanceMonitor.onQualityChange((qualityLevel, fps) => {
            console.log(`🎮 Quality adjusted to ${Math.round(qualityLevel * 100)}% (FPS: ${fps})`);

            // Notify all updatables that support quality adjustment
            for (const item of this.updatables) {
                if (item.object && typeof item.object.setQuality === 'function') {
                    item.object.setQuality(qualityLevel);
                }
            }
        });

        this.performanceMonitor.onLowFPS((fps, qualityLevel) => {
            console.warn(`⚠️ Performance warning: ${fps} FPS`);
        });
    }

    /**
     * Register an object that has an update(time) method
     * @param {Object} obj - Object with update(time) method
     * @param {string} [name] - Optional name for debugging
     */
    register(obj, name = null) {
        if (obj && typeof obj.update === 'function') {
            this.updatables.push({
                object: obj,
                name: name || obj.constructor?.name || 'Unknown',
                enabled: true
            });
        }
        return this;
    }

    /**
     * Register multiple objects at once
     * @param {Object[]} objects - Array of objects with update methods
     */
    registerAll(objects) {
        objects.forEach(obj => this.register(obj));
        return this;
    }

    /**
     * Register a special handler for custom update logic
     * @param {string} name - Handler name
     * @param {Function} handler - Function to call on each frame with (time) argument
     */
    registerHandler(name, handler) {
        if (typeof handler === 'function') {
            this.specialHandlers.set(name, handler);
        }
        return this;
    }

    /**
     * Unregister an object by reference or name
     * @param {Object|string} objOrName - Object reference or name string
     */
    unregister(objOrName) {
        if (typeof objOrName === 'string') {
            this.updatables = this.updatables.filter(item => item.name !== objOrName);
        } else {
            this.updatables = this.updatables.filter(item => item.object !== objOrName);
        }
        return this;
    }

    /**
     * Enable or disable an updatable by name
     * @param {string} name - Name of the updatable
     * @param {boolean} enabled - Whether to enable or disable
     */
    setEnabled(name, enabled) {
        const item = this.updatables.find(u => u.name === name);
        if (item) {
            item.enabled = enabled;
        }
        return this;
    }

    setCameraController(controller) {
        this.cameraController = controller;
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(this.animate);

        // Track FPS for adaptive quality
        this.performanceMonitor.tick();

        const time = Date.now() * 0.001;

        // Update camera controller if animating to POI
        if (this.cameraController) {
            this.cameraController.update();
        }

        // Update camera based on scroll (only if not controlled by CameraController)
        if (!this.cameraController || !this.cameraController.isCurrentlyZoomed()) {
            this.sceneManager.updateCamera(time);
        }

        // Update all registered updatables
        for (const item of this.updatables) {
            if (item.enabled && item.object) {
                try {
                    item.object.update(time);
                } catch (error) {
                    console.warn(`AnimationManager: Error updating "${item.name}"`, error);
                }
            }
        }

        // Run special handlers
        for (const [name, handler] of this.specialHandlers) {
            try {
                handler(time);
            } catch (error) {
                console.warn(`AnimationManager: Error in handler "${name}"`, error);
            }
        }

        // Render the scene
        this.sceneManager.render();
    }

    /**
     * Get list of registered updatables (for debugging)
     * @returns {string[]} Array of updatable names
     */
    getRegisteredNames() {
        return this.updatables.map(item => item.name);
    }
}
