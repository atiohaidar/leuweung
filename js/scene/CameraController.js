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

        // Re-enable scroll-based camera movement
        this.sceneManager.disableScrollCamera = false;
    }

    zoomOut() {
        this.startBlendBack();
    }

    update() {
        if (this.isAnimating) {
            this.updateZoomAnimation();
        } else if (this.isBlendingBack) {
            this.updateBlendBack();
        }
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

        // Get current scroll-based target position
        const scrollTarget = this.sceneManager.getScrollCameraPosition();

        // Blend from stored position to scroll position
        this.camera.position.x = this.lerp(this.blendStartPosition.x, scrollTarget.x, eased);
        this.camera.position.y = this.lerp(this.blendStartPosition.y, scrollTarget.y, eased);
        this.camera.position.z = this.lerp(this.blendStartPosition.z, scrollTarget.z, eased);

        // Blend rotation back to normal (looking forward)
        this.camera.rotation.x = this.lerp(this.camera.rotation.x, scrollTarget.rotationX, eased);
        this.camera.rotation.y = this.lerp(this.camera.rotation.y, scrollTarget.rotationY, eased);

        if (progress >= 1) {
            this.isBlendingBack = false;
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
