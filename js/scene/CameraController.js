/**
 * Camera Controller - Handles smooth camera transitions and zoom effects
 * @module CameraController
 */

export class CameraController {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();

        this.isAnimating = false;
        this.startPosition = null;
        this.targetPosition = null;
        this.startLookAt = null;
        this.targetLookAt = null;

        this.animationProgress = 0;
        this.animationDuration = 2000; // ms
        this.animationStartTime = 0;

        this.currentLookAt = new THREE.Vector3(0, 2, -10);
        this.isZoomedIn = false;
        this.currentPOI = null;

        // For smooth blend back to scroll
        this.isBlendingBack = false;
        this.blendStartPosition = null;
        this.blendTargetPosition = null;
        this.blendStartLookAt = null;
        this.blendProgress = 0;

        // Subtle interactive look
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetLookOffsetX = 0;
        this.targetLookOffsetY = 0;
        this.lookOffset = { x: 0, y: 0 };
    }

    zoomTo(pointOfInterest, poiName) {
        if (this.isAnimating) return;

        // If already zoomed to this POI, zoom out
        if (this.isZoomedIn && this.currentPOI === poiName) {
            this.startBlendBack();
            return;
        }

        const poi = pointOfInterest;

        // Always start from CURRENT camera position
        this.startPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };

        // Get current look-at direction
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        this.startLookAt = {
            x: this.camera.position.x + direction.x * 10,
            y: this.camera.position.y + direction.y * 10,
            z: this.camera.position.z + direction.z * 10
        };

        this.targetPosition = poi.cameraPosition;
        this.targetLookAt = poi.lookAt;
        this.isAnimating = true;
        this.animationStartTime = Date.now();
        this.isZoomedIn = true;
        this.currentPOI = poiName;
        this.isBlendingBack = false;

        // Disable scroll-based camera movement
        this.sceneManager.disableScrollCamera = true;
    }

    startBlendBack() {
        if (this.isAnimating || this.isBlendingBack) return;

        // Store current position as blend start
        this.blendStartPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };

        this.blendStartLookAt = {
            x: this.currentLookAt.x,
            y: this.currentLookAt.y,
            z: this.currentLookAt.z
        };

        this.isBlendingBack = true;
        this.blendProgress = 0;
        this.isZoomedIn = false;
        this.currentPOI = null;
        this.animationStartTime = Date.now();

        // Keep scroll disabled until blend finishes to prevent conflict
        // this.sceneManager.disableScrollCamera = false; 
    }

    zoomOut() {
        this.startBlendBack();
    }

    update() {
        if (this.isAnimating) {
            this.updateZoomAnimation();
        } else if (this.isBlendingBack) {
            this.updateBlendBack();
        } else if (this.isZoomedIn) {
            this.updateInteractiveLook();
        }
    }

    setMousePosition(x, y) {
        // Maps -1 to 1
        this.mouseX = x;
        this.mouseY = y;
    }

    updateInteractiveLook() {
        if (!this.targetLookAt) return;

        // Calculate target offset (small amount)
        // Invert X because moving mouse right should rotate view right (which means looking at point to the... wait)
        // If I look at 0,0,0 and move mouse right, I want to look slightly to the right of the object?
        // No, usually "parallax" means looking slightly *away* from center to see around it?
        // Or "looking around" means I rotate the camera.
        // Let's implement "Follow Cursor": look slightly towards cursor direction.
        const sensitivity = 0.5; // Max offset in units
        const targetX = this.mouseX * sensitivity;
        const targetY = this.mouseY * sensitivity;

        // Smooth interpolation
        this.lookOffset.x += (targetX - this.lookOffset.x) * 0.1;
        this.lookOffset.y += (targetY - this.lookOffset.y) * 0.1;

        // Apply to current lookAt
        const finalLookAt = new THREE.Vector3(
            this.targetLookAt.x + this.lookOffset.x,
            this.targetLookAt.y + this.lookOffset.y,
            this.targetLookAt.z
        );

        this.camera.lookAt(finalLookAt);
    }

    updateZoomAnimation() {
        const elapsed = Date.now() - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1);

        // Easing function (ease-in-out cubic)
        const eased = this.easeInOutCubic(progress);

        // Interpolate camera position from start to target
        this.camera.position.x = this.lerp(this.startPosition.x, this.targetPosition.x, eased);
        this.camera.position.y = this.lerp(this.startPosition.y, this.targetPosition.y, eased);
        this.camera.position.z = this.lerp(this.startPosition.z, this.targetPosition.z, eased);

        // Interpolate look-at target
        this.currentLookAt.x = this.lerp(this.startLookAt.x, this.targetLookAt.x, eased);
        this.currentLookAt.y = this.lerp(this.startLookAt.y, this.targetLookAt.y, eased);
        this.currentLookAt.z = this.lerp(this.startLookAt.z, this.targetLookAt.z, eased);

        this.camera.lookAt(this.currentLookAt);

        // End animation
        if (progress >= 1) {
            this.isAnimating = false;
        }
    }

    updateBlendBack() {
        const elapsed = Date.now() - this.animationStartTime;
        const duration = 1500; // Slightly faster blend back
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const eased = this.easeOutCubic(progress);

        // Get target state from SceneManager logic (which matches updateCamera now)
        const targetState = this.sceneManager.getScrollCameraPosition();
        const targetPos = targetState.position;
        const targetLook = targetState.lookAt;

        // Blend positions
        this.camera.position.x = this.lerp(this.blendStartPosition.x, targetPos.x, eased);
        this.camera.position.y = this.lerp(this.blendStartPosition.y, targetPos.y, eased);
        this.camera.position.z = this.lerp(this.blendStartPosition.z, targetPos.z, eased);

        // Blend lookAt targets
        this.currentLookAt.x = this.lerp(this.blendStartLookAt.x, targetLook.x, eased);
        this.currentLookAt.y = this.lerp(this.blendStartLookAt.y, targetLook.y, eased);
        this.currentLookAt.z = this.lerp(this.blendStartLookAt.z, targetLook.z, eased);

        this.camera.lookAt(this.currentLookAt);

        if (progress >= 1) {
            this.isBlendingBack = false;
            // Now safe to give control back to SceneManager
            this.sceneManager.disableScrollCamera = false;
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

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    isCurrentlyZoomed() {
        return this.isZoomedIn || this.isAnimating;
    }

    isBlending() {
        return this.isBlendingBack;
    }

    getCurrentPOI() {
        return this.currentPOI;
    }
}
