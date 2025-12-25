/**
 * Seasonal Themes - Switch between different seasons
 * Reads configuration from config.js for better maintainability
 * @module SeasonalThemes
 */

import { CONFIG } from '../config.js';

export class SeasonalThemes {
    constructor(sceneManager, trees, ground) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.renderer = sceneManager.renderer;
        this.trees = trees;
        this.ground = ground;

        this.currentSeason = 'summer';
        this.isTransitioning = false;

        // Load configuration from config.js
        const config = CONFIG.seasonalThemes || {};
        this.transitionDuration = config.transitionDuration || 2000;
        this.seasonConfig = config.seasons || this.getDefaultSeasonConfig();
    }

    /**
     * Default season configuration (fallback)
     */
    getDefaultSeasonConfig() {
        return {
            spring: {
                fogColor: 0x1a3a1f,
                clearColor: 0x87ceeb,
                fogDensity: 0.01,
                groundColor: 0x2d5a2d,
                foliageColors: [0x90EE90, 0x98FB98, 0x00FA9A, 0x3CB371],
                particleColor: 0xFFB7C5,
                ambientIntensity: 0.6
            },
            summer: {
                fogColor: 0x0a1a0f,
                clearColor: 0x0a1a0f,
                fogDensity: 0.015,
                groundColor: 0x1a3a1f,
                foliageColors: [0x2d5a3a, 0x3d6a4a, 0x4d7a5a, 0x1d4a2a],
                particleColor: 0xa8e6cf,
                ambientIntensity: 0.5
            },
            autumn: {
                fogColor: 0x2a1a0a,
                clearColor: 0x1a1005,
                fogDensity: 0.012,
                groundColor: 0x5a4a2a,
                foliageColors: [0xFF6347, 0xFFA500, 0xFFD700, 0xDC143C],
                particleColor: 0xFFA500,
                ambientIntensity: 0.4
            },
            winter: {
                fogColor: 0xd0e0f0,
                clearColor: 0x1a2a3a,
                fogDensity: 0.008,
                groundColor: 0xe8e8e8,
                foliageColors: [0x2d4a3a, 0x3d5a4a, 0x1d3a2a, 0x4d5a4a],
                particleColor: 0xffffff,
                ambientIntensity: 0.7
            }
        };
    }

    setSeason(season) {
        if (this.isTransitioning || !this.seasonConfig[season]) return;
        if (season === this.currentSeason) return;

        this.isTransitioning = true;
        const config = this.seasonConfig[season];
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);
            const eased = this.easeInOutCubic(progress);

            // Transition fog
            const currentFogColor = new THREE.Color(this.scene.fog.color);
            const targetFogColor = new THREE.Color(config.fogColor);
            currentFogColor.lerp(targetFogColor, eased * 0.1);
            this.scene.fog.color = currentFogColor;
            this.scene.fog.density = THREE.MathUtils.lerp(
                this.scene.fog.density,
                config.fogDensity,
                eased * 0.1
            );

            // Transition background
            const currentClearColor = new THREE.Color();
            this.renderer.getClearColor(currentClearColor);
            const targetClearColor = new THREE.Color(config.clearColor);
            currentClearColor.lerp(targetClearColor, eased * 0.1);
            this.renderer.setClearColor(currentClearColor, 1);

            // Transition ground color
            if (this.ground && this.ground.mesh) {
                const groundColor = new THREE.Color(this.ground.mesh.material.color);
                const targetGroundColor = new THREE.Color(config.groundColor);
                groundColor.lerp(targetGroundColor, eased * 0.1);
                this.ground.mesh.material.color = groundColor;
            }

            // Transition tree foliage colors
            if (this.trees && this.trees.trees) {
                this.trees.trees.forEach((tree, index) => {
                    tree.children.forEach((child, i) => {
                        if (child.material && child.material.color && i > 0) {
                            const currentColor = child.material.color;
                            const targetColor = new THREE.Color(
                                config.foliageColors[i % config.foliageColors.length]
                            );
                            currentColor.lerp(targetColor, eased * 0.05);
                        }
                    });
                });
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isTransitioning = false;
                this.currentSeason = season;
            }
        };

        animate();
    }

    nextSeason() {
        const seasons = Object.keys(this.seasonConfig);
        const currentIndex = seasons.indexOf(this.currentSeason);
        const nextIndex = (currentIndex + 1) % seasons.length;
        this.setSeason(seasons[nextIndex]);
        return seasons[nextIndex];
    }

    getCurrentSeason() {
        return this.currentSeason;
    }

    /**
     * Get available seasons
     * @returns {string[]} Array of season names
     */
    getAvailableSeasons() {
        return Object.keys(this.seasonConfig);
    }

    /**
     * Get season configuration
     * @param {string} season - Season name
     * @returns {Object} Season configuration
     */
    getSeasonConfig(season) {
        return this.seasonConfig[season];
    }

    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}
