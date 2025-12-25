/**
 * Bloom Effect - Post-processing bloom for dramatic lighting
 * @module BloomEffect
 */

export class BloomEffect {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();
        this.renderer = sceneManager.getRenderer();

        this.composer = null;
        this.bloomPass = null;
        this.enabled = true;

        // Bloom parameters
        this.params = {
            exposure: 1,
            bloomStrength: 0.8,
            bloomThreshold: 0.6,
            bloomRadius: 0.4
        };

        this.init();
    }

    init() {
        // Check if post-processing classes are available
        if (typeof THREE.EffectComposer === 'undefined') {
            console.warn('BloomEffect: EffectComposer not available');
            this.enabled = false;
            return;
        }

        // Create effect composer
        this.composer = new THREE.EffectComposer(this.renderer);

        // Render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom pass
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.params.bloomStrength,
            this.params.bloomRadius,
            this.params.bloomThreshold
        );
        this.bloomPass = bloomPass;
        this.composer.addPass(bloomPass);

        // Handle window resize
        window.addEventListener('resize', () => this.onResize());

        // Apply exposure
        this.renderer.toneMappingExposure = this.params.exposure;
    }

    onResize() {
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    render() {
        if (this.enabled && this.composer) {
            this.composer.render();
            return true; // Indicates bloom rendered
        }
        return false; // Normal render needed
    }

    setStrength(strength) {
        this.params.bloomStrength = strength;
        if (this.bloomPass) {
            this.bloomPass.strength = strength;
        }
    }

    setThreshold(threshold) {
        this.params.bloomThreshold = threshold;
        if (this.bloomPass) {
            this.bloomPass.threshold = threshold;
        }
    }

    setRadius(radius) {
        this.params.bloomRadius = radius;
        if (this.bloomPass) {
            this.bloomPass.radius = radius;
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    isEnabled() {
        return this.enabled && this.composer !== null;
    }

    getComposer() {
        return this.composer;
    }
}
