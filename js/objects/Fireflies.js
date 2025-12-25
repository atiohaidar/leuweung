/**
 * Fireflies - Creates and animates firefly particles
 * @module Fireflies
 */

import { CONFIG } from '../config.js';

export class Fireflies {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.fireflies = [];

        this.create();
    }

    create() {
        const config = CONFIG.fireflies;

        for (let i = 0; i < config.count; i++) {
            const geometry = new THREE.SphereGeometry(config.radius, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: Math.random() * 0.5 + 0.5
            });

            const firefly = new THREE.Mesh(geometry, material);

            firefly.position.set(
                (Math.random() - 0.5) * config.spreadX,
                Math.random() * (config.maxY - config.minY) + config.minY,
                -Math.random() * config.depthRange - 5
            );

            firefly.userData = {
                originalY: firefly.position.y,
                speed: Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed,
                amplitude: Math.random() * (config.maxAmplitude - config.minAmplitude) +
                    config.minAmplitude,
                phase: Math.random() * Math.PI * 2
            };

            this.sceneManager.add(firefly);
            this.fireflies.push(firefly);
        }
    }

    update(time) {
        const config = CONFIG.fireflies;

        this.fireflies.forEach((firefly, index) => {
            const data = firefly.userData;

            // Floating movement
            firefly.position.y = data.originalY +
                Math.sin(time * data.speed * 10 + data.phase) * data.amplitude;
            firefly.position.x += Math.sin(time * 0.5 + index) * 0.01;

            // Pulsating glow
            firefly.material.opacity = config.minOpacity +
                Math.sin(time * config.pulseSpeed + data.phase) * config.maxOpacity;
        });
    }

    getFireflies() {
        return this.fireflies;
    }
}
