/**
 * Object Interaction - Clickable 3D objects with camera focus and labels
 * Fully config-driven: add new objects via config.js only
 * @module ObjectInteraction
 */

import { CONFIG } from '../config.js';

export class ObjectInteraction {
    constructor(sceneManager, cameraController, labels3D) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.cameraController = cameraController;
        this.labels3D = labels3D;

        // Raycaster for mouse picking
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Clickable objects registry
        this.clickableObjects = new Map(); // id -> { object, config }
        this.hoveredObject = null;

        // State
        this.isEnabled = true;
        this.currentFocusedId = null;

        // Load config
        this.objectsConfig = CONFIG.clickableObjects || {};

        this._bindEvents();
    }

    /**
     * Register a 3D object as clickable using config
     * @param {THREE.Object3D} object - The 3D object
     * @param {string} id - Unique identifier matching clickableObjects config
     */
    registerClickable(object, id) {
        const config = this.objectsConfig[id];

        if (!config) {
            console.warn(`ObjectInteraction: No config found for "${id}"`);
            return;
        }

        // Skip if marked as not clickable
        if (config.clickable === false) {
            return;
        }

        object.userData.interactionId = id;
        object.userData.isClickable = true;

        this.clickableObjects.set(id, {
            object,
            config
        });
    }

    /**
     * Register all objects from a source class
     * Reads sourceClass field from config to auto-register
     * @param {Object} sourceObjects - Map of id -> object from a class
     * @param {string} sourceClassName - Name of the source class
     */
    registerFromSource(sourceObjects, sourceClassName) {
        Object.entries(this.objectsConfig).forEach(([id, config]) => {
            if (config.sourceClass === sourceClassName && config.clickable !== false) {
                const object = sourceObjects[id];
                if (object) {
                    this.registerClickable(object, id);
                }
            }
        });
    }

    /**
     * Bind mouse events
     * @private
     */
    _bindEvents() {
        const canvas = this.sceneManager.renderer.domElement;

        canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
        canvas.addEventListener('click', (e) => this._onClick(e));

        // Scroll to exit focus mode
        window.addEventListener('wheel', () => this._onScroll(), { passive: true });
        window.addEventListener('touchmove', () => this._onScroll(), { passive: true });
    }

    /**
     * Handle mouse move - update hover state
     * @private
     */
    _onMouseMove(event) {
        if (!this.isEnabled) return;

        const rect = this.sceneManager.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Collect all meshes from registered objects
        const objectsToTest = [];
        this.clickableObjects.forEach(({ object }) => {
            object.traverse(child => {
                if (child.isMesh) objectsToTest.push(child);
            });
        });

        const intersects = this.raycaster.intersectObjects(objectsToTest, false);

        if (intersects.length > 0) {
            const hitObject = this._findRegisteredParent(intersects[0].object);
            if (hitObject && hitObject !== this.hoveredObject) {
                this._onHoverEnter(hitObject);
            }
        } else if (this.hoveredObject) {
            this._onHoverExit();
        }
    }

    /**
     * Find the registered clickable parent
     * @private
     */
    _findRegisteredParent(object) {
        let current = object;
        while (current) {
            if (current.userData?.isClickable) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }

    /**
     * Handle hover enter
     * @private
     */
    _onHoverEnter(object) {
        this.hoveredObject = object;
        document.body.style.cursor = 'pointer';
        this._setHighlight(object, true);
    }

    /**
     * Handle hover exit
     * @private
     */
    _onHoverExit() {
        if (this.hoveredObject) {
            this._setHighlight(this.hoveredObject, false);
        }
        this.hoveredObject = null;
        document.body.style.cursor = 'default';
    }

    /**
     * Apply/remove highlight effect
     * @private
     */
    _setHighlight(object, enabled) {
        object.traverse(child => {
            if (child.isMesh && child.material) {
                if (enabled) {
                    if (!child.userData.originalEmissive && child.material.emissive) {
                        child.userData.originalEmissive = child.material.emissive.clone();
                        child.userData.originalEmissiveIntensity = child.material.emissiveIntensity || 0;
                    }
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0x444444);
                        child.material.emissiveIntensity = 0.3;
                    }
                } else {
                    if (child.userData.originalEmissive && child.material.emissive) {
                        child.material.emissive.copy(child.userData.originalEmissive);
                        child.material.emissiveIntensity = child.userData.originalEmissiveIntensity;
                    }
                }
            }
        });
    }

    /**
     * Handle click on object
     * @private
     */
    _onClick(event) {
        if (!this.isEnabled || !this.hoveredObject) return;

        const id = this.hoveredObject.userData.interactionId;
        if (!id) return;

        if (this.currentFocusedId === id) {
            this.unfocus();
            return;
        }

        this.focusOn(id);
    }

    /**
     * Focus camera on an object and show its label
     * @param {string} id - Object ID from config
     */
    focusOn(id) {
        const entry = this.clickableObjects.get(id);
        if (!entry) return;

        const config = entry.config;
        this.currentFocusedId = id;

        // Zoom camera using config
        if (config.camera) {
            const poi = {
                cameraPosition: config.camera.position,
                lookAt: config.camera.lookAt
            };
            this.cameraController.zoomTo(poi, id);
        }

        // Show label
        if (this.labels3D) {
            this.labels3D.forceShowLabel(id);
        }

        window.dispatchEvent(new CustomEvent('objectFocused', { detail: { id, config } }));
    }

    /**
     * Exit focus mode
     */
    unfocus() {
        if (!this.currentFocusedId) return;

        const previousId = this.currentFocusedId;
        this.currentFocusedId = null;

        this.cameraController.zoomOut();

        if (this.labels3D) {
            this.labels3D.clearForceShow();
        }

        window.dispatchEvent(new CustomEvent('objectUnfocused', { detail: { id: previousId } }));
    }

    /**
     * Handle scroll - exit focus
     * @private
     */
    _onScroll() {
        if (this.currentFocusedId) {
            setTimeout(() => {
                if (this.currentFocusedId) {
                    this.unfocus();
                }
            }, 100);
        }
    }

    /**
     * Enable/disable interaction
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this._onHoverExit();
        }
    }

    /**
     * Check if focused
     */
    isFocused() {
        return this.currentFocusedId !== null;
    }

    /**
     * Get focused object ID
     */
    getFocusedId() {
        return this.currentFocusedId;
    }

    /**
     * Get config for an object
     * @param {string} id
     */
    getObjectConfig(id) {
        return this.objectsConfig[id] || null;
    }

    /**
     * Get all registered object IDs
     */
    getRegisteredIds() {
        return Array.from(this.clickableObjects.keys());
    }
}
