/**
 * Magic Particles - Sparkle trail following cursor
 * @module MagicParticles
 */

export class MagicParticles {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();
        this.camera = sceneManager.getCamera();

        this.particles = [];
        this.maxParticles = 50;
        this.mouseX = 0;
        this.mouseY = 0;
        this.enabled = true;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(event) {
        if (!this.enabled) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Create new particle at cursor position
        this.createParticle();
    }

    createParticle() {
        if (this.particles.length >= this.maxParticles) {
            // Remove oldest particle
            const oldParticle = this.particles.shift();
            this.scene.remove(oldParticle);
        }

        // Get 3D position from mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const direction = this.raycaster.ray.direction;

        const distance = 5 + Math.random() * 3;
        const position = new THREE.Vector3(
            this.camera.position.x + direction.x * distance,
            this.camera.position.y + direction.y * distance,
            this.camera.position.z + direction.z * distance
        );

        // Create sparkle
        const colors = [0xffff88, 0x88ffff, 0xff88ff, 0x88ff88, 0xffffff];
        const geometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 1
        });

        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        particle.userData = {
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                Math.random() * 0.05,
                (Math.random() - 0.5) * 0.05
            )
        };

        this.scene.add(particle);
        this.particles.push(particle);
    }

    update() {
        if (!this.enabled) return;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const data = particle.userData;

            // Update position
            particle.position.add(data.velocity);

            // Fade out
            data.life -= data.decay;
            particle.material.opacity = data.life;
            particle.scale.multiplyScalar(0.98);

            // Remove dead particles
            if (data.life <= 0) {
                this.scene.remove(particle);
                this.particles.splice(i, 1);
            }
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            // Clear all particles
            this.particles.forEach(p => this.scene.remove(p));
            this.particles = [];
        }
    }
}
