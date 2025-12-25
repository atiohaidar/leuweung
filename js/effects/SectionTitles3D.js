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
        group.letters = []; // Store separate letter meshes

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

        const subtitleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xaaaaaa,
            emissiveIntensity: 0.2,
            metalness: 0.5,
            roughness: 0.3,
            transparent: true,
            opacity: 0,
            depthWrite: false
        });

        // Create main title letters
        const titleLetters = this.createScatterText(data.title, 2.5, 0.5, titleMaterial, 1.8, 0, data.scale || 1);
        titleLetters.forEach(mesh => {
            group.add(mesh);
            group.letters.push(mesh);
        });

        // Create subtitle letters if exists
        if (data.subtitle && data.subtitle.trim() !== '') {
            const subLetters = this.createScatterText(data.subtitle, 1.2, 0.3, subtitleMaterial, -0.8, 0);
            subLetters.forEach(mesh => {
                group.add(mesh);
                group.letters.push(mesh);
            });
        }

        let descriptionMaterial = null;
        if (data.description) {
            const descriptionGeometry = new THREE.TextGeometry(data.description, {
                font: this.font,
                size: 0.6,
                height: 0.2,
                curveSegments: 8,
                bevelEnabled: false
            });
            descriptionGeometry.computeBoundingBox();
            descriptionGeometry.center();

            descriptionMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff, // White for readability
                emissive: 0xcccccc,
                emissiveIntensity: 0.1,
                metalness: 0.3,
                roughness: 0.4,
                transparent: true,
                opacity: 0,
                depthWrite: false
            });

            const descriptionMesh = new THREE.Mesh(descriptionGeometry, descriptionMaterial);
            descriptionMesh.position.y = -2.5; // Position below subtitle
            group.add(descriptionMesh);
        }

        // Glow light
        const glowLight = new THREE.PointLight(data.emissive, 0, 20);
        glowLight.position.set(0, 0, 5);
        group.add(glowLight);

        group.position.set(data.position.x, data.position.y, data.position.z);

        group.userData = {
            titleMaterial,
            subtitleMaterial,
            descriptionMaterial,
            glowLight,
            initialScale: 1
        };

        return group;
    }

    createScatterText(text, size, height, material, yPos, zPos, scaleMult = 1) {
        if (!text) return [];

        const finalSize = size * scaleMult;
        const letters = [];
        let totalWidth = 0;
        const spacing = finalSize * 0.15;
        const geometries = [];

        // Pass 1: Create geometries and calculate width
        for (const char of text) {
            if (char === ' ') {
                totalWidth += finalSize * 0.4;
                geometries.push(null);
                continue;
            }
            const geo = new THREE.TextGeometry(char, {
                font: this.font,
                size: finalSize,
                height: height,
                curveSegments: 8,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.02,
                bevelSegments: 3
            });
            geo.computeBoundingBox();
            const width = geo.boundingBox.max.x - geo.boundingBox.min.x;
            geometries.push({ geo, width });
            totalWidth += width + spacing;
        }
        if (geometries.length > 0) totalWidth -= spacing;

        // Pass 2: Create meshes
        let currentX = -totalWidth / 2; // Start from left to center
        geometries.forEach((g) => {
            if (!g) { // Space
                currentX += finalSize * 0.4;
                return;
            }

            // Center the geometry itself on local origin for rotation
            g.geo.center();

            const mesh = new THREE.Mesh(g.geo, material);
            const targetX = currentX + g.width / 2;

            // Setup alignment data
            mesh.userData = {
                targetPos: new THREE.Vector3(targetX, yPos, zPos),
                // Scatter position relative to group center
                scatterPos: new THREE.Vector3(
                    targetX + (Math.random() - 0.5) * 20,
                    yPos + (Math.random() - 0.5) * 20,
                    zPos + (Math.random() - 0.5) * 15 + 10 // Come from front
                ),
                scatterRot: new THREE.Euler(
                    (Math.random() - 0.5) * Math.PI,
                    (Math.random() - 0.5) * Math.PI,
                    (Math.random() - 0.5) * Math.PI
                )
            };

            // Start at scattered state
            mesh.position.copy(mesh.userData.scatterPos);
            mesh.rotation.copy(mesh.userData.scatterRot);

            letters.push(mesh);
            currentX += g.width + spacing;
        });

        return letters;
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
            const { titleMaterial, subtitleMaterial, descriptionMaterial, glowLight } = group.userData;
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

                    // Slide up group (optional, keeping it for extra motion)
                    const slideOffset = (1 - eased) * -3;
                    group.position.y = section.position.y + slideOffset;

                    const time = Date.now() * 0.001;
                    sway = Math.sin(time * 0.5 + section.position.z * 0.1) * 0.15 * (1 - eased);
                    group.position.x = section.position.x + sway;

                    // Animate letters assembling
                    if (group.letters) {
                        group.letters.forEach(letter => {
                            const data = letter.userData;
                            // Use cubic easing for sharper snap
                            const assembleProgress = this.easeInOutCubic(eased);

                            letter.position.lerpVectors(data.scatterPos, data.targetPos, assembleProgress);

                            letter.rotation.x = data.scatterRot.x * (1 - assembleProgress);
                            letter.rotation.y = data.scatterRot.y * (1 - assembleProgress);
                            letter.rotation.z = data.scatterRot.z * (1 - assembleProgress);
                        });
                    }

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

                    // Animate letters scattering/exploding on exit
                    if (group.letters) {
                        group.letters.forEach(letter => {
                            const data = letter.userData;
                            // Scatter based on fly progress (as we get closer/pass)
                            const scatterFactor = this.easeInQuad(flyProgress);

                            letter.position.lerpVectors(data.targetPos, data.scatterPos, scatterFactor);

                            // Rotate wildly again
                            letter.rotation.x = data.scatterRot.x * scatterFactor;
                            letter.rotation.y = data.scatterRot.y * scatterFactor;
                            letter.rotation.z = data.scatterRot.z * scatterFactor;
                        });
                    }
                }

                titleMaterial.opacity = opacity;
                subtitleMaterial.opacity = opacity;
                if (descriptionMaterial) {
                    descriptionMaterial.opacity = opacity;
                }

                const boost = (scale - 1) * 0.5;
                titleMaterial.emissiveIntensity = 0.5 + boost;
                subtitleMaterial.emissiveIntensity = 0.3 + boost;
                if (descriptionMaterial) {
                    descriptionMaterial.emissiveIntensity = 0.1 + boost;
                }

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

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
