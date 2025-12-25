/**
 * Scene Manager - Handles Three.js scene setup and rendering
 * OPTIMIZED: Device-aware renderer settings and throttled events
 * @module SceneManager
 */

import { CONFIG } from '../config.js';
import { getDeviceCapabilities } from '../utils/DeviceCapabilities.js';
import { rafThrottle } from '../utils/Throttle.js';

export class SceneManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // Smooth scroll damping system
        this.targetScrollProgress = 0;      // Target from actual scroll
        this.scrollProgress = 0;            // Smoothed current value (used by camera)
        this.scrollSmoothness = CONFIG.camera?.scrollSmoothness || 0.08; // From config

        this.disableScrollCamera = false;

        // Device capabilities for optimization
        this.deviceCaps = getDeviceCapabilities();

        this.init();
        this.bindEvents();
    }

    init() {
        // Scene Setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(
            CONFIG.scene.fogColor,
            CONFIG.scene.fogDensity
        );

        // Camera Setup
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        this.camera.position.set(
            CONFIG.camera.initialPosition.x,
            CONFIG.camera.initialPosition.y,
            CONFIG.camera.initialPosition.z
        );

        // OPTIMIZED: Renderer Setup based on device capabilities
        const performanceSettings = this.deviceCaps.performanceSettings;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: performanceSettings.antialias, // Disable on low-end
            alpha: true,
            powerPreference: 'high-performance', // Request high-performance GPU
            stencil: false, // Disable if not needed
            depth: true
        });

        // Cap pixel ratio for performance (max 1.5 on mobile, 2 otherwise)
        const maxPixelRatio = this.deviceCaps.isMobile ? 1.5 : 2;
        const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);

        // Apply render scale for low-end devices
        const renderScale = performanceSettings.renderScale;
        const scaledWidth = Math.floor(window.innerWidth * renderScale);
        const scaledHeight = Math.floor(window.innerHeight * renderScale);

        this.renderer.setSize(scaledWidth, scaledHeight, false);
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setClearColor(CONFIG.scene.clearColor, 1);

        // Store render scale for resize
        this.renderScale = renderScale;

        console.log(`🎮 Renderer initialized: ${scaledWidth}x${scaledHeight}, pixelRatio: ${pixelRatio}, antialias: ${performanceSettings.antialias}`);
    }

    bindEvents() {
        // OPTIMIZED: Debounce resize, throttle scroll with RAF
        window.addEventListener('resize', rafThrottle(() => this.onWindowResize()));
        window.addEventListener('scroll', rafThrottle(() => this.onScroll()), { passive: true });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Apply render scale on resize
        const scaledWidth = Math.floor(window.innerWidth * this.renderScale);
        const scaledHeight = Math.floor(window.innerHeight * this.renderScale);

        this.renderer.setSize(scaledWidth, scaledHeight, false);
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }

    onScroll() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        // Set TARGET scroll progress (actual scroll position)
        this.targetScrollProgress = window.scrollY / scrollable;

        // Update progress bar immediately (no need to smooth this)
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = (this.targetScrollProgress * 100) + '%';
        }
    }

    updateCamera(time) {
        if (this.disableScrollCamera) return;

        // Smooth interpolation: camera "chases" the target scroll position
        // This eliminates jerky movement when scrolling quickly
        const delta = this.targetScrollProgress - this.scrollProgress;
        this.scrollProgress += delta * this.scrollSmoothness;

        // Snap to target when very close (avoid endless micro-movements)
        if (Math.abs(delta) < 0.0001) {
            this.scrollProgress = this.targetScrollProgress;
        }

        const progress = this.scrollProgress;

        // Define camera phases based on scroll progress
        // Phase 1: 0-55% - Forest exploration
        // Phase 2: 55-75% - Deforestation focus
        // Phase 3: 75-100% - Earth zoom out

        if (progress < 0.55) {
            // Phase 1: Normal forest exploration (0% - 55%)
            const forestProgress = progress / 0.55;

            this.camera.position.z = CONFIG.camera.initialPosition.z -
                forestProgress * (CONFIG.camera.maxScrollZ * 0.7);
            this.camera.position.y = CONFIG.camera.initialPosition.y +
                Math.sin(forestProgress * Math.PI * 2) * 1;

            // Slight camera sway
            this.camera.position.x = Math.sin(time * CONFIG.camera.swaySpeed) *
                CONFIG.camera.swayAmount;
            this.camera.rotation.x = 0;
            this.camera.rotation.y = Math.sin(time * 0.2) * 0.02;

            // Reduce fog as we go deeper
            this.scene.fog.density = CONFIG.scene.fogDensity * (1 - forestProgress * 0.3);

            // Reset background color
            this.renderer.setClearColor(CONFIG.scene.clearColor, 1);

        } else if (progress < 0.75) {
            // Phase 2: Deforestation focus (55% - 75%)
            const deforestProgress = (progress - 0.55) / 0.20;
            const eased = this.easeInOutCubic(deforestProgress);

            // Start position (end of phase 1)
            const startZ = CONFIG.camera.initialPosition.z - (CONFIG.camera.maxScrollZ * 0.7);
            const startY = CONFIG.camera.initialPosition.y;
            const startX = 0;

            // Target position: looking at deforestation area (now at X:15, Z:-115, next to river)
            const targetZ = -100;
            const targetY = 10;
            const targetX = 5;

            this.camera.position.z = this.lerp(startZ, targetZ, eased);
            this.camera.position.y = this.lerp(startY, targetY, eased);
            this.camera.position.x = this.lerp(startX, targetX, eased);

            // Look at deforestation scene (next to river at X:15, Z:-115)
            const lookForward = new THREE.Vector3(0, startY, startZ - 30);
            const lookAtDeforestation = new THREE.Vector3(15, 1, -115);

            const currentLookAt = new THREE.Vector3(
                this.lerp(lookForward.x, lookAtDeforestation.x, eased),
                this.lerp(lookForward.y, lookAtDeforestation.y, eased),
                this.lerp(lookForward.z, lookAtDeforestation.z, eased)
            );

            this.camera.lookAt(currentLookAt);

            // Slightly increase fog for dramatic effect
            this.scene.fog.density = CONFIG.scene.fogDensity * 0.8;

            // Darken atmosphere slightly (pollution effect)
            const forestColor = new THREE.Color(CONFIG.scene.clearColor);
            const pollutedColor = new THREE.Color(0x1a1510);
            const currentColor = forestColor.clone().lerp(pollutedColor, eased * 0.5);
            this.renderer.setClearColor(currentColor, 1);


        } else {
            // Phase 3: Earth zoom out (75% - 100%)
            const earthProgress = (progress - 0.75) / 0.25;
            const eased = this.easeInOutCubic(earthProgress);

            // Start position (end of deforestation phase - now at X:5, Z:-100)
            const startZ = -100;
            const startY = 10;
            const startX = 5;

            // End position (very high above to see Earth fully)
            const endZ = -140;
            const endY = 300;  // Much higher to see Earth (radius 50, at Y:-120)
            const endX = 0;

            this.camera.position.z = this.lerp(startZ, endZ, eased);
            this.camera.position.y = this.lerp(startY, endY, eased);
            this.camera.position.x = this.lerp(startX, endX, eased);

            // Look at deforestation first, then Earth center
            const lookAtDeforestation = new THREE.Vector3(15, 1, -115);
            const lookAtEarth = new THREE.Vector3(0, -80, -150);  // Earth center (updated position)

            const currentLookAt = new THREE.Vector3(
                this.lerp(lookAtDeforestation.x, lookAtEarth.x, eased),
                this.lerp(lookAtDeforestation.y, lookAtEarth.y, eased),
                this.lerp(lookAtDeforestation.z, lookAtEarth.z, eased)
            );

            this.camera.lookAt(currentLookAt);

            // Clear fog for space view
            this.scene.fog.density = CONFIG.scene.fogDensity * (1 - eased * 0.95);

            // Change background color to space (darker)
            const pollutedColor = new THREE.Color(0x1a1510);
            const spaceColor = new THREE.Color(0x000008);
            const currentColor = pollutedColor.clone().lerp(spaceColor, eased);
            this.renderer.setClearColor(currentColor, 1);

            // Store the look target
            this.currentLookAt = currentLookAt;
        }
    }

    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    add(object) {
        this.scene.add(object);
    }

    setComposer(composer) {
        this.composer = composer;
    }

    render() {
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    getScene() {
        return this.scene;
    }

    getRenderer() {
        return this.renderer;
    }

    getCamera() {
        return this.camera;
    }

    getScrollProgress() {
        return this.scrollProgress;
    }

    // Get target camera position based on current scroll progress
    getScrollCameraPosition() {
        const progress = this.scrollProgress;
        const time = Date.now() * 0.001;
        let x, y, z;
        let lookAtX, lookAtY, lookAtZ;

        if (progress < 0.55) {
            // Phase 1: Normal forest exploration (0% - 55%)
            const forestProgress = progress / 0.55;

            z = CONFIG.camera.initialPosition.z - forestProgress * (CONFIG.camera.maxScrollZ * 0.7);
            y = CONFIG.camera.initialPosition.y + Math.sin(forestProgress * Math.PI * 2) * 1;

            // Slight camera sway
            x = Math.sin(time * CONFIG.camera.swaySpeed) * CONFIG.camera.swayAmount;

            // Calculate lookAt for Phase 1 (mainly forward with slight sway)
            // Equivalent to rotation.y = Math.sin(time * 0.2) * 0.02
            const rotY = Math.sin(time * 0.2) * 0.02;
            lookAtX = x + Math.sin(rotY) * 10;
            lookAtY = y;
            lookAtZ = z - 10;

        } else if (progress < 0.75) {
            // Phase 2: Deforestation focus (55% - 75%)
            const deforestProgress = (progress - 0.55) / 0.20;
            const eased = this.easeInOutCubic(deforestProgress);

            const startZ = CONFIG.camera.initialPosition.z - (CONFIG.camera.maxScrollZ * 0.7);
            const startY = CONFIG.camera.initialPosition.y;
            const startX = 0;

            const targetZ = -100;
            const targetY = 10;
            const targetX = 5;

            z = this.lerp(startZ, targetZ, eased);
            y = this.lerp(startY, targetY, eased);
            x = this.lerp(startX, targetX, eased);

            // Look at deforestation scene
            const lookForwardX = 0;
            const lookForwardY = startY;
            const lookForwardZ = startZ - 30;

            const lookAtDefoX = 15;
            const lookAtDefoY = 1;
            const lookAtDefoZ = -115;

            lookAtX = this.lerp(lookForwardX, lookAtDefoX, eased);
            lookAtY = this.lerp(lookForwardY, lookAtDefoY, eased);
            lookAtZ = this.lerp(lookForwardZ, lookAtDefoZ, eased);

        } else {
            // Phase 3: Earth zoom out (75% - 100%)
            const earthProgress = (progress - 0.75) / 0.25;
            const eased = this.easeInOutCubic(earthProgress);

            const startZ = -100;
            const startY = 10;
            const startX = 5;

            const endZ = -140;
            const endY = 300;
            const endX = 0;

            z = this.lerp(startZ, endZ, eased);
            y = this.lerp(startY, endY, eased);
            x = this.lerp(startX, endX, eased);

            // Look targets
            const lookAtDefoX = 15;
            const lookAtDefoY = 1;
            const lookAtDefoZ = -115;

            const lookAtEarthX = 0;
            const lookAtEarthY = -80;
            const lookAtEarthZ = -150;

            lookAtX = this.lerp(lookAtDefoX, lookAtEarthX, eased);
            lookAtY = this.lerp(lookAtDefoY, lookAtEarthY, eased);
            lookAtZ = this.lerp(lookAtDefoZ, lookAtEarthZ, eased);
        }

        return {
            position: new THREE.Vector3(x, y, z),
            lookAt: new THREE.Vector3(lookAtX, lookAtY, lookAtZ)
        };
    }

    /**
     * Set camera scroll smoothness (0.01 = very smooth, 0.2 = responsive)
     * Default: 0.08
     */
    setScrollSmoothness(value) {
        this.scrollSmoothness = Math.max(0.01, Math.min(0.3, value));
    }

    /**
     * Get the target (actual) scroll progress (before smoothing)
     */
    getTargetScrollProgress() {
        return this.targetScrollProgress;
    }
}
