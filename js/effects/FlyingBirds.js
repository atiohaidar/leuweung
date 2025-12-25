/**
 * Flying Birds - Animated bird flocks
 * @module FlyingBirds
 */

export class FlyingBirds {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.flocks = [];
        this.enabled = true;

        this.createFlocks();
    }

    createBird() {
        const bird = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.ConeGeometry(0.1, 0.4, 4);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        bird.add(body);

        // Wings
        const wingGeometry = new THREE.PlaneGeometry(0.5, 0.15);
        const wingMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide
        });

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(0.15, 0, 0);
        leftWing.name = 'leftWing';
        bird.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(-0.15, 0, 0);
        rightWing.name = 'rightWing';
        bird.add(rightWing);

        return bird;
    }

    createFlock() {
        const flock = new THREE.Group();
        const birdCount = 5 + Math.floor(Math.random() * 8);

        for (let i = 0; i < birdCount; i++) {
            const bird = this.createBird();

            // V-formation or scattered formation
            const formationType = Math.random() > 0.5 ? 'v' : 'scatter';

            if (formationType === 'v') {
                const row = Math.floor(i / 2);
                const side = i % 2 === 0 ? 1 : -1;
                bird.position.set(
                    side * row * 0.8,
                    row * 0.3,
                    -row * 1.5
                );
            } else {
                bird.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 4
                );
            }

            bird.userData.wingPhase = Math.random() * Math.PI * 2;
            bird.userData.wingSpeed = 8 + Math.random() * 4;
            flock.add(bird);
        }

        // Flock properties
        flock.userData = {
            speed: 0.3 + Math.random() * 0.3,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                (Math.random() - 0.5) * 0.2,
                -1
            ).normalize(),
            startZ: 50,
            endZ: -250
        };

        // Random starting position
        flock.position.set(
            (Math.random() - 0.5) * 60,
            10 + Math.random() * 20,
            flock.userData.startZ
        );

        return flock;
    }

    createFlocks() {
        // Create initial flocks
        for (let i = 0; i < 3; i++) {
            const flock = this.createFlock();
            flock.position.z = -50 - i * 60; // Spread them out
            this.scene.add(flock);
            this.flocks.push(flock);
        }
    }

    update(time) {
        if (!this.enabled) return;

        this.flocks.forEach(flock => {
            const data = flock.userData;

            // Move flock
            flock.position.add(data.direction.clone().multiplyScalar(data.speed));

            // Animate wings
            flock.children.forEach(bird => {
                const phase = bird.userData.wingPhase;
                const speed = bird.userData.wingSpeed;
                const wingAngle = Math.sin(time * speed + phase) * 0.5;

                const leftWing = bird.getObjectByName('leftWing');
                const rightWing = bird.getObjectByName('rightWing');

                if (leftWing) leftWing.rotation.z = wingAngle;
                if (rightWing) rightWing.rotation.z = -wingAngle;
            });

            // Reset flock when it goes too far
            if (flock.position.z < data.endZ) {
                flock.position.set(
                    (Math.random() - 0.5) * 60,
                    10 + Math.random() * 20,
                    data.startZ
                );
                // Randomize direction slightly
                data.direction = new THREE.Vector3(
                    Math.random() - 0.5,
                    (Math.random() - 0.5) * 0.2,
                    -1
                ).normalize();
            }
        });
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        this.flocks.forEach(flock => {
            flock.visible = enabled;
        });
    }
}
