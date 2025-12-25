/**
 * Lighting - Handles scene lighting setup
 * @module Lighting
 */

import { CONFIG } from '../config.js';

export class Lighting {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.lights = [];

        this.setupLighting();
    }

    setupLighting() {
        // Ambient Light (subtle forest light)
        const ambientLight = new THREE.AmbientLight(
            CONFIG.lighting.ambient.color,
            CONFIG.lighting.ambient.intensity
        );
        this.sceneManager.add(ambientLight);
        this.lights.push(ambientLight);

        // Directional Light (sunlight through trees)
        const sunLight = new THREE.DirectionalLight(
            CONFIG.lighting.sun.color,
            CONFIG.lighting.sun.intensity
        );
        sunLight.position.set(
            CONFIG.lighting.sun.position.x,
            CONFIG.lighting.sun.position.y,
            CONFIG.lighting.sun.position.z
        );
        this.sceneManager.add(sunLight);
        this.lights.push(sunLight);

        // Point Lights (magical glow spots)
        CONFIG.lighting.glowLights.forEach(glowConfig => {
            const glowLight = new THREE.PointLight(
                glowConfig.color,
                glowConfig.intensity,
                glowConfig.distance
            );
            glowLight.position.set(
                glowConfig.position.x,
                glowConfig.position.y,
                glowConfig.position.z
            );
            this.sceneManager.add(glowLight);
            this.lights.push(glowLight);
        });
    }

    getLights() {
        return this.lights;
    }
}
