/**
 * Lazy Loader - Defers creation of 3D objects based on scroll position
 * Improves initial load time by loading heavy objects only when needed
 * @module LazyLoader
 */

import { CONFIG } from '../config.js';

export class LazyLoader {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.pendingObjects = new Map(); // id -> { factory, loadAt, loaded, instance }
        this.loadedObjects = new Map();  // id -> instance
        this.preloadDistance = CONFIG.lazyLoading?.preloadDistance || 0.1;
        this.enabled = CONFIG.lazyLoading?.enabled !== false;
        this.callbacks = new Map(); // id -> callback function

        this.isLoading = false;
    }

    /**
     * Register an object for lazy loading
     * @param {string} id - Unique identifier for the object
     * @param {Function} factory - Factory function that creates the object
     * @param {number} loadAt - Scroll progress (0-1) at which to load
     * @param {Function} onLoaded - Optional callback when loaded
     */
    register(id, factory, loadAt, onLoaded = null) {
        if (!this.enabled) {
            // If lazy loading disabled, create immediately
            const instance = factory();
            this.loadedObjects.set(id, instance);
            if (onLoaded) onLoaded(instance);
            return instance;
        }

        this.pendingObjects.set(id, {
            factory,
            loadAt,
            loaded: false,
            instance: null
        });

        if (onLoaded) {
            this.callbacks.set(id, onLoaded);
        }

        console.log(`🔄 LazyLoader: Registered "${id}" to load at ${(loadAt * 100).toFixed(0)}% scroll`);
        return null;
    }

    /**
     * Check and load objects based on current scroll progress
     * @param {number} scrollProgress - Current scroll progress (0-1)
     */
    update(scrollProgress) {
        if (!this.enabled || this.isLoading) return;

        for (const [id, obj] of this.pendingObjects) {
            if (obj.loaded) continue;

            // Load when approaching the visibility threshold
            const loadThreshold = Math.max(0, obj.loadAt - this.preloadDistance);

            if (scrollProgress >= loadThreshold) {
                this.loadObject(id);
            }
        }
    }

    /**
     * Load a specific object by id
     * @param {string} id - Object identifier
     */
    async loadObject(id) {
        const obj = this.pendingObjects.get(id);
        if (!obj || obj.loaded) return;

        this.isLoading = true;
        console.log(`⏳ LazyLoader: Loading "${id}"...`);

        try {
            // Create the object using factory
            const instance = obj.factory();
            obj.instance = instance;
            obj.loaded = true;

            this.loadedObjects.set(id, instance);

            // Trigger callback if exists
            const callback = this.callbacks.get(id);
            if (callback) {
                callback(instance);
            }

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('lazyload', {
                detail: { id, instance }
            }));

            console.log(`✅ LazyLoader: "${id}" loaded successfully`);
        } catch (error) {
            console.error(`❌ LazyLoader: Failed to load "${id}"`, error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Check if an object is loaded
     * @param {string} id - Object identifier
     * @returns {boolean}
     */
    isLoaded(id) {
        return this.loadedObjects.has(id);
    }

    /**
     * Get a loaded object instance
     * @param {string} id - Object identifier
     * @returns {*} The loaded object or null
     */
    get(id) {
        return this.loadedObjects.get(id) || null;
    }

    /**
     * Force load all pending objects
     */
    loadAll() {
        for (const [id] of this.pendingObjects) {
            this.loadObject(id);
        }
    }

    /**
     * Get loading status
     * @returns {Object} Loading statistics
     */
    getStatus() {
        let pending = 0;
        let loaded = 0;

        for (const [, obj] of this.pendingObjects) {
            if (obj.loaded) loaded++;
            else pending++;
        }

        return { pending, loaded, total: pending + loaded };
    }

    /**
     * Dispose of lazy loaded objects
     * @param {string} id - Object identifier (optional, disposes all if not provided)
     */
    dispose(id = null) {
        if (id) {
            const instance = this.loadedObjects.get(id);
            if (instance && typeof instance.dispose === 'function') {
                instance.dispose();
            }
            this.loadedObjects.delete(id);
            this.pendingObjects.delete(id);
            this.callbacks.delete(id);
        } else {
            for (const [objId] of this.loadedObjects) {
                this.dispose(objId);
            }
        }
    }
}
