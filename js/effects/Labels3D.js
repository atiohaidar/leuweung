/**
 * 3D Labels - Floating labels and Info Cards
 * @module Labels3D
 */

import { CONFIG } from '../config.js';

export class Labels3D {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();
        this.labels = [];
        this.container = null;

        // Info Card State
        this.infoCard = null;
        this.activeInfoObject = null;
        this.infoCardOffset = { x: 0, y: 1.5, z: 0 }; // Offset above object

        this.init();
    }

    init() {
        this.createContainer();
        this.createLabels();
        this.createInfoCardTemplate();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'labels-3d-container';
        document.body.appendChild(this.container);
    }

    // ... (Standard Labels Code - Kept same)
    createLabels() {
        const labelData = CONFIG.labels3D || [];
        labelData.forEach(data => this.addLabel(data));
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

    addLabel(labelData) {
        const label = this.createLabelElement(labelData);
        this.labels.push({ element: label, ...labelData });
        this.container.appendChild(label);
    }

    // ... (Keeping tracked labels logic simplified)

    // ==========================================
    // NEW: Info Card Logic
    // ==========================================

    createInfoCardTemplate() {
        // Create the single reusable DOM element for info cards
        this.infoCard = document.createElement('div');
        this.infoCard.className = 'info-card-3d';
        this.infoCard.innerHTML = `
            <div class="info-card-header">
                <span class="info-card-emoji"></span>
                <div class="info-card-titles">
                    <h2 class="info-card-name"></h2>
                    <p class="info-card-latin"></p>
                </div>
            </div>
            <div class="info-card-body">
                <p class="info-card-description"></p>
                <div class="info-card-facts">
                    <h4>✨ Info Menarik</h4>
                    <ul class="info-card-facts-list"></ul>
                </div>
                <div class="info-card-meta">
                    <div class="info-card-meta-item">
                        <span class="meta-label">🏠 Habitat</span>
                        <span class="meta-value info-card-habitat"></span>
                    </div>
                    <div class="info-card-meta-item">
                        <span class="meta-label">📊 Status</span>
                        <span class="meta-value info-card-status"></span>
                    </div>
                </div>
            </div>
            <div class="info-card-connector"></div>
        `;
        this.container.appendChild(this.infoCard);
    }

    /**
     * Display the Info Card attached to a 3D object
     * @param {THREE.Object3D} object - The object to track
     * @param {Object} info - The info data object
     */
    displayInfoCard(object, info) {
        if (!this.infoCard) return;

        this.activeInfoObject = object;

        // Calculate offset (try to find height of object)
        const box = new THREE.Box3().setFromObject(object);
        const height = box.max.y - box.min.y;
        this.infoCardOffset.y = height + 1; // Float 1 unit above

        // Populate Content
        this.infoCard.querySelector('.info-card-emoji').textContent = info.emoji || '';
        this.infoCard.querySelector('.info-card-name').textContent = info.name || 'Unknown';
        this.infoCard.querySelector('.info-card-latin').textContent = info.latinName || '';
        this.infoCard.querySelector('.info-card-description').textContent = info.description || '';

        // Facts
        const factsList = this.infoCard.querySelector('.info-card-facts-list');
        factsList.innerHTML = '';
        if (info.facts && info.facts.length) {
            info.facts.slice(0, 2).forEach(fact => { // Limit to 2 for space
                const li = document.createElement('li');
                li.textContent = fact;
                factsList.appendChild(li);
            });
        }

        // Meta
        this.infoCard.querySelector('.info-card-habitat').textContent = info.habitat || '-';
        this.infoCard.querySelector('.info-card-status').textContent = info.status || '-';

        // Theme
        this.infoCard.className = 'info-card-3d';
        if (info.theme) this.infoCard.classList.add(`theme-${info.theme}`);

        // Show
        this.infoCard.classList.add('visible');
    }

    hideInfoCard() {
        if (this.infoCard) {
            this.infoCard.classList.remove('visible');
        }
        this.activeInfoObject = null;
    }

    // ==========================================
    // Update Loop
    // ==========================================

    update() {
        // 1. Update Standard Labels
        const scrollProgress = this.sceneManager.getScrollProgress();
        this.labels.forEach(label => {
            // ... (Standard visibility logic based on scroll)
            // Simplified for brevity in this specific update:
            const { min, max } = label.visibleRange;
            if (scrollProgress >= min && scrollProgress <= max) {
                const screenPos = this.projectToScreen(label.position3D);
                if (screenPos) {
                    label.element.style.opacity = 1;
                    label.element.style.visibility = 'visible';
                    label.element.style.left = `${screenPos.x}%`;
                    label.element.style.top = `${screenPos.y}%`;
                }
            } else {
                label.element.style.opacity = 0;
                label.element.style.visibility = 'hidden';
            }
        });

        // 2. Update Info Card Position
        if (this.activeInfoObject && this.infoCard.classList.contains('visible')) {
            // Get world position
            const worldPos = new THREE.Vector3();
            this.activeInfoObject.getWorldPosition(worldPos);

            // Apply offset
            worldPos.y += this.infoCardOffset.y;

            // Project
            const screenPos = this.projectToScreen(worldPos);

            if (screenPos) {
                // Position card
                this.infoCard.style.left = `${screenPos.x}%`;
                this.infoCard.style.top = `${screenPos.y}%`;
            } else {
                // Off screen (behind camera)
                this.infoCard.classList.remove('visible');
            }
        }
    }

    projectToScreen(position3D) {
        const vector = new THREE.Vector3(position3D.x, position3D.y, position3D.z);
        vector.project(this.camera);

        if (vector.z > 1) return null; // Behind camera

        const x = (vector.x * 0.5 + 0.5) * 100;
        const y = (-vector.y * 0.5 + 0.5) * 100;

        return { x, y };
    }

    // ... (Keep existing methods)
    forceShowLabel(id) { } // Deprecate or keep empty if we use InfoCard instead
    clearForceShow() { }
}
