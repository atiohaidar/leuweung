/**
 * Object Interaction - Clickable 3D objects with camera focus and labels
 * Fully config-driven: add new objects via config.js only
 * @module ObjectInteraction
 */

import { CONFIG } from '../config.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../constants/events.js';
import { Logger } from '../utils/Logger.js';

export class ObjectInteraction {
    constructor(sceneManager, cameraController, labels3D, mouseParallax) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.cameraController = cameraController;
        this.labels3D = labels3D;
        this.mouseParallax = mouseParallax;

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
            Logger.warn('Interaction', `No config found for "${id}"`);
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
     * Register individual animals from Wildlife or JumpingFish classes
     * Each animal type (deer, rabbit, etc) gets registered with its type as ID
     * @param {THREE.Object3D[]} animals - Array of animal objects
     * @param {string} typeProperty - Property name on userData containing type
     */
    registerAnimals(animals, typeProperty = 'type') {
        animals.forEach((animal, index) => {
            const type = animal.userData?.[typeProperty];
            if (!type) return;

            // Check if this type has config
            const config = this.objectsConfig[type];
            if (!config || config.clickable === false) return;

            // Use type as ID with index for uniqueness internally
            const uniqueId = `${type}_${index}`;
            animal.userData.interactionId = type; // Use type for config lookup
            animal.userData.uniqueInteractionId = uniqueId;
            animal.userData.isClickable = true;

            // Only register first of each type to avoid duplicates in map
            // But all animals will be clickable and use their type's config
            if (!this.clickableObjects.has(type)) {
                this.clickableObjects.set(type, {
                    object: animal,
                    config
                });
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

        // Pass mouse info to camera controller for subtle interaction when focused
        if (this.cameraController) {
            this.cameraController.setMousePosition(this.mouse.x, this.mouse.y);
        }

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

        // Add CSS class for additional visual feedback
        const canvas = this.sceneManager.renderer.domElement;
        canvas.classList.add('hovering-clickable');

        // Show hover hint tooltip
        this._showHoverHint(object);
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

        // Remove CSS class
        const canvas = this.sceneManager.renderer.domElement;
        canvas.classList.remove('hovering-clickable');

        // Hide hover hint
        this._hideHoverHint();
    }

    /**
     * Apply/remove highlight effect
     * @private
     */
    _setHighlight(object, enabled) {
        object.traverse(child => {
            if (child.isMesh && child.material) {
                if (enabled) {
                    // Store original values
                    if (!child.userData.originalEmissive && child.material.emissive) {
                        child.userData.originalEmissive = child.material.emissive.clone();
                        child.userData.originalEmissiveIntensity = child.material.emissiveIntensity || 0;
                    }
                    if (!child.userData.originalScale) {
                        child.userData.originalScale = child.scale.clone();
                    }

                    // Apply highlight - stronger glow effect
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0x66ff99); // Green glow
                        child.material.emissiveIntensity = 0.5;
                    }

                    // Slight scale up for visual feedback
                    child.scale.multiplyScalar(1.05);
                } else {
                    // Restore original values
                    if (child.userData.originalEmissive && child.material.emissive) {
                        child.material.emissive.copy(child.userData.originalEmissive);
                        child.material.emissiveIntensity = child.userData.originalEmissiveIntensity;
                    }
                    if (child.userData.originalScale) {
                        child.scale.copy(child.userData.originalScale);
                    }
                }
            }
        });
    }

    /**
     * Show hover hint tooltip
     * @private
     */
    _showHoverHint(object) {
        if (!this.hoverHint) {
            this.hoverHint = document.createElement('div');
            this.hoverHint.className = 'object-hover-hint';
            this.hoverHint.innerHTML = '🔍 Klik untuk info';
            document.body.appendChild(this.hoverHint);
        }

        const id = object.userData.interactionId;
        const config = this.objectsConfig[id];
        if (config?.info?.emoji) {
            this.hoverHint.innerHTML = `${config.info.emoji} Klik untuk info`;
        }

        this.hoverHint.classList.add('visible');
    }

    /**
     * Hide hover hint tooltip
     * @private
     */
    _hideHoverHint() {
        if (this.hoverHint) {
            this.hoverHint.classList.remove('visible');
        }
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
     * Focus camera on an object and show its info modal
     * Now does BOTH: zoom camera AND show info modal
     * @param {string} id - Object ID from config
     */
    focusOn(id) {
        const entry = this.clickableObjects.get(id);
        if (!entry) return;

        const config = entry.config;
        this.currentFocusedId = id;

        // Disable MouseParallax to prevent conflict/drifting
        if (this.mouseParallax) {
            this.mouseParallax.setEnabled(false);
        }

        // ALWAYS zoom camera if config.camera exists
        if (config.camera) {
            const poi = {
                cameraPosition: config.camera.position,
                lookAt: config.camera.lookAt
            };
            this.cameraController.zoomTo(poi, id);
        }

        // Show Info Card (3D Label Style)
        if (config.info && this.labels3D) {
            // Wait slightly for camera to start moving
            setTimeout(() => {
                // Use the object from the registry entry
                const targetObject = entry.object;
                this.labels3D.displayInfoCard(targetObject, config.info);
            }, 200);
        }

        // Show label if exists
        if (this.labels3D) {
            this.labels3D.forceShowLabel(id);
        }

        // Emit general click/focus event
        eventBus.emit(EVENTS.OBJECT_CLICKED, { id, config });
    }

    /**
     * Exit focus mode
     */
    unfocus() {
        if (!this.currentFocusedId) return;

        const previousId = this.currentFocusedId;
        this.currentFocusedId = null;

        this.cameraController.zoomOut();

        // Re-enable MouseParallax
        if (this.mouseParallax) {
            this.mouseParallax.setEnabled(true);
        }

        if (this.labels3D) {
            this.labels3D.clearForceShow();
            this.labels3D.hideInfoCard();
        }

        // Emit unfocus event to clear any UI state if necessary
        eventBus.emit(EVENTS.OBJECT_CLICKED, { id: null });
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
