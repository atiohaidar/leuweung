/**
 * Animation Manager - Handles the main animation loop
 * @module AnimationManager
 */

export class AnimationManager {
    constructor(sceneManager, objects) {
        this.sceneManager = sceneManager;
        this.objects = objects;
        this.isRunning = false;
        this.cameraController = null;

        this.animate = this.animate.bind(this);
    }

    setCameraController(controller) {
        this.cameraController = controller;
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(this.animate);

        const time = Date.now() * 0.001;

        // Update camera controller if animating to POI
        if (this.cameraController) {
            this.cameraController.update();
        }

        // Update camera based on scroll (only if not controlled by CameraController)
        if (!this.cameraController || !this.cameraController.isCurrentlyZoomed()) {
            this.sceneManager.updateCamera(time);
        }

        // Update all animated objects
        if (this.objects.trees) {
            this.objects.trees.update(time);
        }

        if (this.objects.fireflies) {
            this.objects.fireflies.update(time);
        }

        if (this.objects.particles) {
            this.objects.particles.update(time);
        }

        if (this.objects.earth) {
            this.objects.earth.update(time);
        }

        if (this.objects.deforestation) {
            this.objects.deforestation.update(time);
        }

        // Update new effects
        if (this.objects.mouseParallax) {
            this.objects.mouseParallax.update();
        }

        if (this.objects.magicParticles) {
            this.objects.magicParticles.update();
        }

        if (this.objects.flyingBirds) {
            this.objects.flyingBirds.update(time);
        }

        if (this.objects.flashlightMode) {
            this.objects.flashlightMode.update();
        }

        if (this.objects.pointsOfInterest) {
            this.updateButterflies(time);
        }

        // Update 3D labels
        if (this.objects.labels3D) {
            this.objects.labels3D.update();
        }

        // Render the scene
        this.sceneManager.render();
    }

    updateButterflies(time) {
        // Animate butterflies in wildlife area
        const poi = this.objects.pointsOfInterest;
        if (poi && poi.points && poi.points.wildlife) {
            const wildlifeGroup = poi.points.wildlife.object;
            wildlifeGroup.children.forEach(child => {
                if (child.userData && child.userData.phase !== undefined) {
                    const data = child.userData;
                    // Fluttering movement
                    child.position.y += Math.sin(time * data.speed * 5 + data.phase) * 0.02;
                    child.position.x += Math.sin(time * data.speed * 3 + data.phase) * 0.01;
                    child.rotation.y = Math.sin(time * data.speed * 8) * 0.3;
                }
            });
        }
    }
}
