/**
 * Flashlight Mode - Night mode with cursor-following flashlight
 * @module FlashlightMode
 */

export class FlashlightMode {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.renderer = sceneManager.renderer;

        this.enabled = false;
        this.flashlight = null;
        this.originalFogDensity = 0.015;
        this.originalClearColor = 0x0a1a0f;

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.createFlashlight();
        this.bindEvents();
    }

    createFlashlight() {
        // Spotlight as flashlight
        this.flashlight = new THREE.SpotLight(0xffffee, 3, 30, Math.PI / 6, 0.5, 1);
        this.flashlight.position.copy(this.camera.position);
        this.flashlight.visible = false;
        this.scene.add(this.flashlight);
        this.scene.add(this.flashlight.target);
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(event) {
        if (!this.enabled) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    toggle() {
        this.enabled = !this.enabled;

        if (this.enabled) {
            this.activate();
        } else {
            this.deactivate();
        }

        return this.enabled;
    }

    activate() {
        this.enabled = true;
        this.flashlight.visible = true;

        // Darken the scene
        this.scene.fog = new THREE.FogExp2(0x000000, 0.04);
        this.renderer.setClearColor(0x000005, 1);

        // Dim ambient light
        this.scene.children.forEach(child => {
            if (child instanceof THREE.AmbientLight) {
                child.intensity = 0.1;
            }
            if (child instanceof THREE.DirectionalLight) {
                child.intensity = 0.1;
            }
        });
    }

    deactivate() {
        this.enabled = false;
        this.flashlight.visible = false;

        // Restore scene
        this.scene.fog = new THREE.FogExp2(this.originalClearColor, this.originalFogDensity);
        this.renderer.setClearColor(this.originalClearColor, 1);

        // Restore lights
        this.scene.children.forEach(child => {
            if (child instanceof THREE.AmbientLight) {
                child.intensity = 0.5;
            }
            if (child instanceof THREE.DirectionalLight) {
                child.intensity = 0.8;
            }
        });
    }

    update() {
        if (!this.enabled) return;

        // Update flashlight position to follow camera
        this.flashlight.position.copy(this.camera.position);

        // Point flashlight at mouse direction
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const direction = this.raycaster.ray.direction;

        const targetPosition = new THREE.Vector3(
            this.camera.position.x + direction.x * 20,
            this.camera.position.y + direction.y * 20,
            this.camera.position.z + direction.z * 20
        );

        this.flashlight.target.position.copy(targetPosition);
    }

    isEnabled() {
        return this.enabled;
    }
}
