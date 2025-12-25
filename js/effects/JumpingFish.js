/**
 * Jumping Fish - Animated fish jumping from the river
 * @module JumpingFish
 */

export class JumpingFish {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.fish = [];
        this.riverPosition = { x: 0, z: -92 }; // Near river section
        this.enabled = true;

        this.createFish();
    }

    createFishMesh() {
        const fish = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        bodyGeometry.scale(2, 1, 0.6);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90d9,
            roughness: 0.3,
            metalness: 0.5
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        fish.add(body);

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.12, 0.25, 4);
        const tailMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a80c9,
            roughness: 0.4
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.35, 0, 0);
        tail.rotation.z = -Math.PI / 2;
        fish.add(tail);

        // Dorsal fin
        const finGeometry = new THREE.ConeGeometry(0.06, 0.15, 3);
        const fin = new THREE.Mesh(finGeometry, tailMaterial);
        fin.position.set(0, 0.12, 0);
        fish.add(fin);

        return fish;
    }

    createFish() {
        // Create several fish with different jump timings
        for (let i = 0; i < 5; i++) {
            const fish = this.createFishMesh();

            fish.userData = {
                baseX: this.riverPosition.x + (Math.random() - 0.5) * 8,
                baseZ: this.riverPosition.z + (Math.random() - 0.5) * 20,
                jumpPhase: Math.random() * Math.PI * 2,
                jumpSpeed: 0.8 + Math.random() * 0.5,
                jumpHeight: 0.8 + Math.random() * 0.5,
                rotationSpeed: 2 + Math.random() * 2
            };

            fish.position.set(fish.userData.baseX, -1, fish.userData.baseZ);
            fish.visible = false;

            this.scene.add(fish);
            this.fish.push(fish);
        }
    }

    update(time) {
        if (!this.enabled) return;

        this.fish.forEach(fish => {
            const data = fish.userData;

            // Calculate jump cycle (0 to 1)
            const cycle = ((time * data.jumpSpeed + data.jumpPhase) % (Math.PI * 2)) / (Math.PI * 2);

            // Fish is visible only during jump (middle portion of cycle)
            if (cycle > 0.3 && cycle < 0.7) {
                fish.visible = true;

                // Parabolic jump motion
                const jumpProgress = (cycle - 0.3) / 0.4; // 0 to 1 during visible phase
                const jumpY = Math.sin(jumpProgress * Math.PI) * data.jumpHeight;

                fish.position.y = jumpY - 0.2; // Start slightly below water
                fish.position.x = data.baseX + Math.sin(jumpProgress * Math.PI) * 0.5;

                // Rotate fish to follow arc
                fish.rotation.z = (jumpProgress - 0.5) * Math.PI * 0.8;

                // Wiggle tail
                fish.rotation.y = Math.sin(time * data.rotationSpeed * 5) * 0.2;
            } else {
                fish.visible = false;
            }
        });
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.fish.forEach(fish => {
                fish.visible = false;
            });
        }
    }
}
