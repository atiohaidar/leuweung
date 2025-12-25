/**
 * Section Titles 3D - Fly-through text animation for section transitions
 * Reads configuration from config.js for better maintainability
 * @module SectionTitles3D
 */

import { CONFIG } from '../config.js';

export class SectionTitles3D {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.sectionTitles = [];
        this.fontLoader = null;
        this.font = null;
        this.isLoaded = false;

        // Load configuration from config.js
        const config = CONFIG.sectionTitles3D || {};
        this.params = config.params || {
            visibilityDistance: 25,
            fadeInDistance: 18,
            flyThroughZone: 4,
            scaleMultiplier: 2.0
        };
        this.sectionsData = config.sections || [];

        // Vignette overlay element
        this.vignetteOverlay = document.getElementById('vignette-overlay');

        this.init();
    }

    async init() {
        await this.loadFont();
        if (this.font) {
            this.createSectionTitles();
            this.isLoaded = true;
        }
    }

    async loadFont() {
        return new Promise((resolve) => {
            const loader = new THREE.FontLoader();
            loader.load(
                'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json',
                (font) => {
                    this.font = font;
                    resolve();
                },
                undefined,
                (error) => {
                    console.error('Font loading error:', error);
                    resolve();
                }
            );
        });
    }

    createSectionTitles() {
        this.sectionsData.forEach(data => {
            const titleGroup = this.createTitleGroup(data);
            this.sectionTitles.push({
                group: titleGroup,
                ...data
            });
            this.scene.add(titleGroup);
        });
    }

    createTitleGroup(data) {
        const group = new THREE.Group();

        // Main title text
        const titleGeometry = new THREE.TextGeometry(data.title, {
            font: this.font,
            size: 2.5,
            height: 1.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.05,
            bevelSegments: 5
        });
        titleGeometry.computeBoundingBox();
        titleGeometry.center();

        const titleMaterial = new THREE.MeshStandardMaterial({
            color: data.color,
            emissive: data.emissive,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.2,
            transparent: true,
            opacity: 0,
            depthWrite: false
        });

        const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
        titleMesh.position.y = 1.5;
        group.add(titleMesh);

        // Subtitle text
        const subtitleGeometry = new THREE.TextGeometry(data.subtitle, {
            font: this.font,
            size: 1.2,
            height: 0.8,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.02,
            bevelSegments: 3
        });
        subtitleGeometry.computeBoundingBox();
        subtitleGeometry.center();

        const subtitleMaterial = new THREE.MeshStandardMaterial({
            color: data.color,
            emissive: data.emissive,
            emissiveIntensity: 0.2,
            metalness: 0.5,
            roughness: 0.3,
            transparent: true,
            opacity: 0,
            depthWrite: false
        });

        const subtitleMesh = new THREE.Mesh(subtitleGeometry, subtitleMaterial);
        subtitleMesh.position.y = -1;
        group.add(subtitleMesh);

        // Glow light
        const glowLight = new THREE.PointLight(data.emissive, 0, 20);
        glowLight.position.set(0, 0, 5);
        group.add(glowLight);

        group.position.set(data.position.x, data.position.y, data.position.z);

        group.userData = {
            titleMaterial,
            subtitleMaterial,
            glowLight,
            initialScale: 1
        };

        return group;
    }

    update() {
        if (!this.isLoaded) return;

        const cameraPos = this.camera.position;

        this.sectionTitles.forEach(section => {
            let dist;
            if (section.isVertical) {
                // Camera rises from below, so positive dist = camera is below text
                dist = cameraPos.y - section.position.y;
            } else {
                dist = cameraPos.z - section.position.z;
            }

            const { group } = section;
            const { titleMaterial, subtitleMaterial, glowLight } = group.userData;
            const { visibilityDistance, flyThroughZone, scaleMultiplier } = this.params;

            // Use larger visibility distance for vertical sections (camera moves more in Y)
            const actualVisibility = section.isVertical ? 100 : visibilityDistance;
            const actualFlyThrough = section.isVertical ? 20 : flyThroughZone;

            if (dist > -10 && dist < actualVisibility) {
                let opacity = 0;
                let scale = 1;
                let sway = 0;

                if (dist > actualFlyThrough) {
                    const rawProgress = 1 - ((dist - actualFlyThrough) / (actualVisibility - actualFlyThrough));
                    const eased = this.easeOutQuad(Math.max(0, Math.min(1, rawProgress)));

                    opacity = eased;
                    scale = 0.6 + (0.4 * eased);

                    const slideOffset = (1 - eased) * -3;
                    group.position.y = section.position.y + slideOffset;

                    const time = Date.now() * 0.001;
                    sway = Math.sin(time * 0.5 + section.position.z * 0.1) * 0.15 * (1 - eased);
                    group.position.x = section.position.x + sway;

                } else {
                    const flyProgress = 1 - (Math.max(0, dist) / actualFlyThrough);
                    const easedFly = this.easeInQuad(flyProgress);
                    scale = 1 + (easedFly * scaleMultiplier);

                    if (dist < 3) {
                        opacity = this.easeOutQuad(dist / 3);
                    } else {
                        opacity = 1;
                    }

                    group.position.x = section.position.x;
                    group.position.y = section.position.y;
                }

                titleMaterial.opacity = opacity;
                subtitleMaterial.opacity = opacity;

                const boost = (scale - 1) * 0.5;
                titleMaterial.emissiveIntensity = 0.5 + boost;
                subtitleMaterial.emissiveIntensity = 0.3 + boost;

                glowLight.intensity = opacity * (1 + boost);

                group.scale.setScalar(scale);
                group.visible = true;

                // Face camera if configured
                if (section.faceCamera) {
                    group.lookAt(cameraPos.x, cameraPos.y, cameraPos.z);
                }

                // Activate vignette for cinematic sections
                if (section.cinematic && this.vignetteOverlay) {
                    this.vignetteOverlay.classList.add('active');
                }

            } else {
                group.visible = false;

                // Deactivate vignette when cinematic section is not visible
                if (section.cinematic && this.vignetteOverlay) {
                    this.vignetteOverlay.classList.remove('active');
                }
            }
        });
    }

    // Easing functions
    easeOutQuad(t) {
        return t * (2 - t);
    }

    easeInQuad(t) {
        return t * t;
    }

    /**
     * Dynamically add a new section title at runtime
     * @param {Object} sectionData - Section configuration
     */
    addSection(sectionData) {
        if (!this.font) return null;

        const titleGroup = this.createTitleGroup(sectionData);
        this.sectionTitles.push({
            group: titleGroup,
            ...sectionData
        });
        this.scene.add(titleGroup);
        return titleGroup;
    }

    /**
     * Remove a section by ID
     * @param {string} id - Section ID
     */
    removeSection(id) {
        const index = this.sectionTitles.findIndex(s => s.id === id);
        if (index !== -1) {
            const section = this.sectionTitles[index];
            this.scene.remove(section.group);
            this.sectionTitles.splice(index, 1);
        }
    }

    /**
     * Update section text dynamically
     * @param {string} id - Section ID
     * @param {Object} updates - { title, subtitle }
     */
    updateSectionText(id, updates) {
        const section = this.sectionTitles.find(s => s.id === id);
        if (section && this.font) {
            // Remove old group
            this.scene.remove(section.group);

            // Create new group with updated data
            const newData = { ...section, ...updates };
            const newGroup = this.createTitleGroup(newData);

            // Update reference
            section.group = newGroup;
            if (updates.title) section.title = updates.title;
            if (updates.subtitle) section.subtitle = updates.subtitle;

            this.scene.add(newGroup);
        }
    }
}
