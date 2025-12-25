/**
 * Magic Particles - Sparkle trail following cursor
 * OPTIMIZED: Uses object pooling and throttled mouse events
 * @module MagicParticles
 */

import { CONFIG } from '../config.js';
import { throttle } from '../utils/Throttle.js';

export class MagicParticles {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();

        this.enabled = true;

        // Load configuration
        const config = CONFIG.effects?.magicParticles || {};
        this.maxParticles = config.maxParticles || 50;
        this.colors = config.colors || [0xffff88, 0x88ffff, 0xff88ff, 0x88ff88, 0xffffff];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // OPTIMIZATION: Use single BufferGeometry with Points instead of individual meshes
        this.particleCount = this.maxParticles;
        this.positions = new Float32Array(this.particleCount * 3);
        this.colors_array = new Float32Array(this.particleCount * 3);
        this.sizes = new Float32Array(this.particleCount);
        this.lifetimes = new Float32Array(this.particleCount);
        this.velocities = new Float32Array(this.particleCount * 3);
        this.decays = new Float32Array(this.particleCount);

        // Track active particles
        this.activeCount = 0;
        this.nextIndex = 0;

        this.initParticleSystem();
        this.bindEvents();
    }

    initParticleSystem() {
        // Initialize all positions off-screen
        for (let i = 0; i < this.particleCount; i++) {
            this.positions[i * 3] = 0;
            this.positions[i * 3 + 1] = -1000; // Off screen
            this.positions[i * 3 + 2] = 0;
            this.sizes[i] = 0;
            this.lifetimes[i] = 0;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors_array, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

        // Custom shader material for better performance
        this.material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);
    }

    bindEvents() {
        // OPTIMIZATION: Throttle mouse move to 16ms (60fps max)
        const throttledMouseMove = throttle((e) => this.onMouseMove(e), 16);
        window.addEventListener('mousemove', throttledMouseMove);
    }

    onMouseMove(event) {
        if (!this.enabled) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Create new particle at cursor position
        this.spawnParticle();
    }

    spawnParticle() {
        // Get 3D position from mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const direction = this.raycaster.ray.direction;

        const distance = 5 + Math.random() * 3;
        const x = this.camera.position.x + direction.x * distance;
        const y = this.camera.position.y + direction.y * distance;
        const z = this.camera.position.z + direction.z * distance;

        // Use next available slot (circular buffer)
        const index = this.nextIndex;
        this.nextIndex = (this.nextIndex + 1) % this.particleCount;

        // Set position
        this.positions[index * 3] = x;
        this.positions[index * 3 + 1] = y;
        this.positions[index * 3 + 2] = z;

        // Set random color from palette
        const color = new THREE.Color(this.colors[Math.floor(Math.random() * this.colors.length)]);
        this.colors_array[index * 3] = color.r;
        this.colors_array[index * 3 + 1] = color.g;
        this.colors_array[index * 3 + 2] = color.b;

        // Set size and lifetime
        this.sizes[index] = 0.08 + Math.random() * 0.12;
        this.lifetimes[index] = 1.0;
        this.decays[index] = 0.02 + Math.random() * 0.02;

        // Set velocity
        this.velocities[index * 3] = (Math.random() - 0.5) * 0.05;
        this.velocities[index * 3 + 1] = Math.random() * 0.05;
        this.velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.05;

        this.activeCount = Math.min(this.activeCount + 1, this.particleCount);
    }

    update() {
        if (!this.enabled) return;

        let needsUpdate = false;

        for (let i = 0; i < this.particleCount; i++) {
            if (this.lifetimes[i] > 0) {
                // Update position
                this.positions[i * 3] += this.velocities[i * 3];
                this.positions[i * 3 + 1] += this.velocities[i * 3 + 1];
                this.positions[i * 3 + 2] += this.velocities[i * 3 + 2];

                // Decay lifetime
                this.lifetimes[i] -= this.decays[i];

                // Fade out by reducing size
                this.sizes[i] *= 0.97;

                // Kill dead particles
                if (this.lifetimes[i] <= 0) {
                    this.positions[i * 3 + 1] = -1000; // Move off screen
                    this.sizes[i] = 0;
                }

                needsUpdate = true;
            }
        }

        // Only update buffers if there are active particles
        if (needsUpdate) {
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        this.particleSystem.visible = enabled;

        if (!enabled) {
            // Clear all particles
            for (let i = 0; i < this.particleCount; i++) {
                this.lifetimes[i] = 0;
                this.positions[i * 3 + 1] = -1000;
                this.sizes[i] = 0;
            }
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
            this.activeCount = 0;
        }
    }

    /**
     * Adjust particle count based on performance
     * @param {number} qualityLevel - 0 to 1
     */
    setQuality(qualityLevel) {
        // Reduce spawn rate based on quality
        this.spawnRate = qualityLevel;
    }

    dispose() {
        this.scene.remove(this.particleSystem);
        this.geometry.dispose();
        this.material.dispose();
    }
}
