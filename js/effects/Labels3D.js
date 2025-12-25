/**
 * 3D Labels - Floating labels that appear beside 3D objects
 * Now reads configuration from config.js for better maintainability
 * @module Labels3D
 */

import { CONFIG } from '../config.js';

export class Labels3D {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();
        this.labels = [];
        this.container = null;

        this.init();
    }

    init() {
        this.createContainer();
        this.createLabels();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'labels-3d-container';
        document.body.appendChild(this.container);
    }

    createLabels() {
        // Read label data from centralized config
        const labelData = CONFIG.labels3D || [];

        labelData.forEach(data => {
            const label = this.createLabelElement(data);
            this.labels.push({
                element: label,
                ...data
            });
            this.container.appendChild(label);
        });
    }

    createLabelElement(data) {
        const label = document.createElement('div');
        label.className = `label-3d ${data.theme || ''} ${data.side}`;
        label.id = `label-${data.id}`;

        label.innerHTML = `
            <div class="label-content">
                <h3 class="label-title">${data.title}</h3>
                <p class="label-description">${data.description}</p>
            </div>
            <div class="label-connector"></div>
        `;

        return label;
    }

    projectToScreen(position3D) {
        const vector = new THREE.Vector3(position3D.x, position3D.y, position3D.z);

        // Project to normalized device coordinates
        vector.project(this.camera);

        // Check if behind camera
        if (vector.z > 1) {
            return null;
        }

        // Convert to screen percentage
        const x = (vector.x * 0.5 + 0.5) * 100;
        const y = (-vector.y * 0.5 + 0.5) * 100;

        return { x, y };
    }

    getLabels() {
        return this.labels;
    }

    /**
     * Dynamically add a new label at runtime
     * @param {Object} labelData - Label configuration object
     */
    addLabel(labelData) {
        const label = this.createLabelElement(labelData);
        this.labels.push({
            element: label,
            ...labelData
        });
        this.container.appendChild(label);
    }

    /**
     * Remove a label by ID
     * @param {string} id - Label ID to remove
     */
    removeLabel(id) {
        const index = this.labels.findIndex(l => l.id === id);
        if (index !== -1) {
            const label = this.labels[index];
            label.element.remove();
            this.labels.splice(index, 1);
        }
    }

    /**
     * Update label content dynamically
     * @param {string} id - Label ID
     * @param {Object} updates - Properties to update (title, description)
     */
    updateLabelContent(id, updates) {
        const label = this.labels.find(l => l.id === id);
        if (label) {
            if (updates.title) {
                label.title = updates.title;
                label.element.querySelector('.label-title').textContent = updates.title;
            }
            if (updates.description) {
                label.description = updates.description;
                label.element.querySelector('.label-description').textContent = updates.description;
            }
        }
    }

    /**
     * Force show a specific label (ignores scroll position)
     * Used by ObjectInteraction when clicking on objects
     * @param {string} id - Label ID to show
     */
    forceShowLabel(id) {
        this.forcedLabelId = id;

        // Hide all other labels and show the forced one
        this.labels.forEach(label => {
            if (label.id === id) {
                label.element.style.opacity = 1;
                label.element.style.visibility = 'visible';
                label.element.classList.add('forced-visible');

                // Position in center-right area for focused view
                label.element.style.left = '75%';
                label.element.style.top = '50%';
                label.element.style.transform = 'translate(-50%, -50%) scale(1.1)';
            } else {
                label.element.style.opacity = 0;
                label.element.style.visibility = 'hidden';
            }
        });
    }

    /**
     * Clear forced label display, resume normal scroll-based visibility
     */
    clearForceShow() {
        this.forcedLabelId = null;

        this.labels.forEach(label => {
            label.element.classList.remove('forced-visible');
        });
    }

    /**
     * Override update to respect forced label
     */
    update() {
        // If a label is forced, don't do normal scroll-based updates
        if (this.forcedLabelId) {
            return;
        }

        const scrollProgress = this.sceneManager.getScrollProgress();

        this.labels.forEach(label => {
            const { min, max } = label.visibleRange;
            const isVisible = scrollProgress >= min && scrollProgress <= max;

            if (isVisible) {
                // Calculate visibility intensity (fade in/out at edges)
                const rangeSize = max - min;
                const fadeZone = rangeSize * 0.2; // 20% fade zone

                let opacity = 1;
                if (scrollProgress < min + fadeZone) {
                    opacity = (scrollProgress - min) / fadeZone;
                } else if (scrollProgress > max - fadeZone) {
                    opacity = (max - scrollProgress) / fadeZone;
                }

                // Project 3D position to 2D screen
                const screenPos = this.projectToScreen(label.position3D);

                if (screenPos) {
                    label.element.style.opacity = opacity;
                    label.element.style.visibility = 'visible';

                    // Position based on side preference
                    if (label.side === 'center') {
                        label.element.style.left = '50%';
                        label.element.style.top = `${Math.min(screenPos.y, 70)}%`;
                        label.element.style.transform = `translate(-50%, -50%) scale(${0.8 + opacity * 0.2})`;
                    } else {
                        // Keep labels in a readable position (not too far off screen)
                        const clampedX = Math.max(10, Math.min(90, screenPos.x));
                        const clampedY = Math.max(15, Math.min(85, screenPos.y));

                        label.element.style.left = `${clampedX}%`;
                        label.element.style.top = `${clampedY}%`;
                        label.element.style.transform = `translate(-50%, -50%) scale(${0.8 + opacity * 0.2})`;
                    }
                }
            } else {
                label.element.style.opacity = 0;
                label.element.style.visibility = 'hidden';
            }
        });
    }

    /**
     * Get label by ID
     * @param {string} id - Label ID
     * @returns {Object|null} Label object
     */
    getLabelById(id) {
        return this.labels.find(l => l.id === id) || null;
    }
}

