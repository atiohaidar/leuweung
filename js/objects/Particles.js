/**
 * Particles - Creates floating particle effects (leaves/spores)
 * @module Particles
 */

import { CONFIG } from '../config.js';

export class Particles {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.particleSystems = [];

        this.create();
    }

    create() {
        const config = CONFIG.particles;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.count * 3);

        for (let i = 0; i < config.count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * config.spreadX;
            positions[i + 1] = Math.random() * config.maxY;
            positions[i + 2] = -Math.random() * config.depthRange;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: config.color,
            size: config.size,
            transparent: true,
            opacity: config.opacity,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(geometry, material);
        this.sceneManager.add(particleSystem);
        this.particleSystems.push(particleSystem);
    }

    update(time) {
        const config = CONFIG.particles;

        this.particleSystems.forEach(particleSystem => {
            const positions = particleSystem.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                // Rise up
                positions[i + 1] += config.riseSpeed;

                // Sway side to side
                positions[i] += Math.sin(time + i) * config.swayAmount;

                // Reset particles that go too high
                if (positions[i + 1] > config.maxY) {
                    positions[i + 1] = 0;
                }
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;
        });
    }

    getParticleSystems() {
        return this.particleSystems;
    }
}
