/**
 * Object Pool - Reuses objects instead of creating/destroying
 * Prevents garbage collection spikes and memory allocation overhead
 * @module ObjectPool
 */

export class ObjectPool {
    /**
     * Create an object pool
     * @param {Function} createFn - Factory function to create new objects
     * @param {Function} resetFn - Function to reset object state (object) => void
     * @param {number} initialSize - Initial pool size
     * @param {number} maxSize - Maximum pool size
     */
    constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.maxSize = maxSize;

        this.available = [];
        this.inUse = new Set();

        // Pre-create initial objects
        for (let i = 0; i < initialSize; i++) {
            this.available.push(this.createFn());
        }
    }

    /**
     * Get an object from the pool
     * @returns {Object} A pooled object
     */
    get() {
        let obj;

        if (this.available.length > 0) {
            obj = this.available.pop();
        } else if (this.inUse.size < this.maxSize) {
            obj = this.createFn();
        } else {
            // Pool exhausted - reuse oldest object
            console.warn('ObjectPool: Maximum size reached, reusing oldest object');
            const oldest = this.inUse.values().next().value;
            this.release(oldest);
            obj = this.available.pop();
        }

        this.inUse.add(obj);
        return obj;
    }

    /**
     * Return an object to the pool
     * @param {Object} obj - Object to release
     */
    release(obj) {
        if (this.inUse.has(obj)) {
            this.inUse.delete(obj);
            this.resetFn(obj);
            this.available.push(obj);
        }
    }

    /**
     * Release all objects back to the pool
     */
    releaseAll() {
        for (const obj of this.inUse) {
            this.resetFn(obj);
            this.available.push(obj);
        }
        this.inUse.clear();
    }

    /**
     * Get pool statistics
     * @returns {Object}
     */
    getStats() {
        return {
            available: this.available.length,
            inUse: this.inUse.size,
            total: this.available.length + this.inUse.size,
            maxSize: this.maxSize
        };
    }

    /**
     * Clear the pool entirely
     */
    clear() {
        this.available = [];
        this.inUse.clear();
    }
}

/**
 * Three.js Mesh Pool - Specialized pool for THREE.Mesh objects
 */
export class MeshPool extends ObjectPool {
    /**
     * Create a mesh pool
     * @param {THREE.Geometry} geometry - Shared geometry
     * @param {THREE.Material} material - Shared material (will be cloned)
     * @param {number} initialSize - Initial pool size
     * @param {number} maxSize - Maximum pool size
     */
    constructor(geometry, material, initialSize = 10, maxSize = 100) {
        const createFn = () => new THREE.Mesh(geometry, material.clone());

        const resetFn = (mesh) => {
            mesh.visible = false;
            mesh.position.set(0, 0, 0);
            mesh.scale.set(1, 1, 1);
            mesh.rotation.set(0, 0, 0);
            mesh.material.opacity = 1;
        };

        super(createFn, resetFn, initialSize, maxSize);

        this.geometry = geometry;
        this.material = material;
    }

    /**
     * Get a mesh and make it visible
     * @returns {THREE.Mesh}
     */
    get() {
        const mesh = super.get();
        mesh.visible = true;
        return mesh;
    }
}
