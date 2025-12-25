/**
 * Camera Shake - Adds shake effect when near danger areas (fire, deforestation)
 * @module CameraShake
 */

export class CameraShake {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();

        this.enabled = true;
        this.intensity = 0;
        this.maxIntensity = 0.15;

        // Deforestation/fire area
        this.dangerZone = {
            x: 15,
            z: -115,
            radius: 25
        };

        // Original camera rotation for restoration
        this.originalRotation = { x: 0, y: 0, z: 0 };
    }

    update(time) {
        if (!this.enabled) return;

        const cameraPos = this.camera.position;

        // Calculate distance to danger zone
        const dx = cameraPos.x - this.dangerZone.x;
        const dz = cameraPos.z - this.dangerZone.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // Calculate intensity based on proximity (closer = more shake)
        if (distance < this.dangerZone.radius) {
            const proximity = 1 - (distance / this.dangerZone.radius);
            this.intensity = proximity * this.maxIntensity;

            // Apply random shake
            const shakeX = (Math.random() - 0.5) * this.intensity;
            const shakeY = (Math.random() - 0.5) * this.intensity * 0.5;
            const shakeZ = (Math.random() - 0.5) * this.intensity * 0.3;

            // Add low frequency rumble
            const rumble = Math.sin(time * 10) * this.intensity * 0.3;

            this.camera.rotation.x += shakeX + rumble;
            this.camera.rotation.y += shakeY;
            this.camera.rotation.z += shakeZ;
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setIntensity(intensity) {
        this.maxIntensity = intensity;
    }
}
