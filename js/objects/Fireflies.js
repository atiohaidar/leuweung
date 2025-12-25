/**
 * Fireflies - Creates and animates firefly particles
 * OPTIMIZED: Uses InstancedMesh for better GPU performance
 * @module Fireflies
 */

import { CONFIG } from '../config.js';
import { getDeviceCapabilities } from '../utils/DeviceCapabilities.js';

export class Fireflies {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;

        // Adjust count based on device capabilities
        const deviceCaps = getDeviceCapabilities();
        const baseCount = CONFIG.fireflies?.count || 100;
        this.count = deviceCaps.getAdjustedCount(baseCount);

        // Store firefly data
        this.fireflyData = [];
        this.instancedMesh = null;

        // Reusable objects to avoid GC
        this.tempMatrix = new THREE.Matrix4();
        this.tempPosition = new THREE.Vector3();
        this.tempQuaternion = new THREE.Quaternion();
        this.tempScale = new THREE.Vector3(1, 1, 1);
        this.tempColor = new THREE.Color();

        this.create();
    }

    create() {
        const config = CONFIG.fireflies;

        // Create shared geometry and material
        const geometry = new THREE.SphereGeometry(config.radius, 6, 6); // Reduced segments
        const material = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.8
        });

        // Create InstancedMesh
        this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.count);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        // Initialize each firefly
        for (let i = 0; i < this.count; i++) {
            const x = (Math.random() - 0.5) * config.spreadX;
            const y = Math.random() * (config.maxY - config.minY) + config.minY;
            const z = -Math.random() * config.depthRange - 5;

            // Store firefly data
            this.fireflyData.push({
                originalY: y,
                x: x,
                y: y,
                z: z,
                speed: Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed,
                amplitude: Math.random() * (config.maxAmplitude - config.minAmplitude) + config.minAmplitude,
                phase: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.5 + 0.5
            });

            // Set initial transform
            this.tempPosition.set(x, y, z);
            this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);
            this.instancedMesh.setMatrixAt(i, this.tempMatrix);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.sceneManager.add(this.instancedMesh);
    }

    update(time) {
        const config = CONFIG.fireflies;
        let matrixNeedsUpdate = false;

        for (let i = 0; i < this.count; i++) {
            const data = this.fireflyData[i];

            // Calculate new Y position (floating movement)
            const newY = data.originalY +
                Math.sin(time * data.speed * 10 + data.phase) * data.amplitude;

            // Slight X drift
            const newX = data.x + Math.sin(time * 0.5 + i) * 0.01;

            // Update position
            this.tempPosition.set(newX, newY, data.z);
            this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);
            this.instancedMesh.setMatrixAt(i, this.tempMatrix);

            matrixNeedsUpdate = true;
        }

        if (matrixNeedsUpdate) {
            this.instancedMesh.instanceMatrix.needsUpdate = true;
        }

        // Pulsating glow effect - update material opacity
        // OPTIMIZATION: Only update material every few frames
        if (Math.floor(time * 10) % 3 === 0) {
            const pulseOpacity = config.minOpacity +
                Math.sin(time * config.pulseSpeed) * config.maxOpacity;
            this.instancedMesh.material.opacity = Math.max(0.3, Math.min(1, pulseOpacity));
        }
    }

    /**
     * Adjust firefly count based on performance
     * @param {number} qualityLevel - 0 to 1
     */
    setQuality(qualityLevel) {
        const targetCount = Math.floor(this.count * qualityLevel);

        // Hide excess instances by moving them off-screen
        for (let i = targetCount; i < this.count; i++) {
            this.tempPosition.set(0, -1000, 0);
            this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);
            this.instancedMesh.setMatrixAt(i, this.tempMatrix);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    getFireflies() {
        return this.instancedMesh;
    }

    dispose() {
        if (this.instancedMesh) {
            this.sceneManager.getScene().remove(this.instancedMesh);
            this.instancedMesh.geometry.dispose();
            this.instancedMesh.material.dispose();
        }
    }
}
