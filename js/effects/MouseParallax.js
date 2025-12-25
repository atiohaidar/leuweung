/**
 * Mouse Parallax Effect - 3D elements react to mouse movement
 * @module MouseParallax
 */

export class MouseParallax {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();

        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;

        this.enabled = true;
        this.sensitivity = 0.0005;
        this.smoothing = 0.05;

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(event) {
        if (!this.enabled) return;

        // Normalize mouse position to -1 to 1
        this.targetX = (event.clientX - window.innerWidth / 2) * this.sensitivity;
        this.targetY = (event.clientY - window.innerHeight / 2) * this.sensitivity;
    }

    update() {
        if (!this.enabled) return;

        // Smooth interpolation
        this.mouseX += (this.targetX - this.mouseX) * this.smoothing;
        this.mouseY += (this.targetY - this.mouseY) * this.smoothing;

        // Apply subtle rotation to camera
        this.camera.rotation.y += this.mouseX * 0.1;
        this.camera.rotation.x += this.mouseY * 0.05;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setSensitivity(value) {
        this.sensitivity = value;
    }
}
