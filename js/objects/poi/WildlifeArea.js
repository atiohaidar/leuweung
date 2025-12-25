/**
 * Wildlife Area - POI with animals and plants
 * @module poi/WildlifeArea
 */

export class WildlifeArea {
    constructor() {
        this.group = new THREE.Group();
        this.createEnvironment();
    }

    createEnvironment() {
        // Create some animal silhouettes (deer)
        for (let i = 0; i < 3; i++) {
            const deer = this.createDeer();
            deer.position.set(i * 3 - 3, 0, Math.random() * 2 - 1);
            deer.rotation.y = Math.random() * 0.5 - 0.25;
            this.group.add(deer);
        }

        // Butterflies
        for (let i = 0; i < 20; i++) {
            const butterfly = this.createButterfly();
            butterfly.position.set(
                (Math.random() - 0.5) * 15,
                1 + Math.random() * 4,
                (Math.random() - 0.5) * 10
            );
            butterfly.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5,
                amplitude: 0.5 + Math.random() * 0.5
            };
            this.group.add(butterfly);
        }

        // Flowers
        for (let i = 0; i < 30; i++) {
            const flower = this.createFlower();
            flower.position.set(
                (Math.random() - 0.5) * 20,
                0,
                (Math.random() - 0.5) * 15
            );
            this.group.add(flower);
        }
    }

    createDeer() {
        const deer = new THREE.Group();

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6914,
            roughness: 0.8
        });

        // Main body cylinder
        const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.4, 1.2, 8);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.position.y = 1.2;
        deer.add(body);

        // Body end caps (spheres)
        const endCapGeometry = new THREE.SphereGeometry(0.35, 8, 8);
        const frontCap = new THREE.Mesh(endCapGeometry, bodyMaterial);
        frontCap.position.set(0.6, 1.2, 0);
        deer.add(frontCap);

        const backCap = new THREE.Mesh(endCapGeometry, bodyMaterial);
        backCap.position.set(-0.6, 1.2, 0);
        deer.add(backCap);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0.8, 1.5, 0);
        deer.add(head);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.4, 6);
        const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
        neck.position.set(0.7, 1.35, 0);
        neck.rotation.z = -0.3;
        deer.add(neck);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.06, 1, 6);
        const legPositions = [
            { x: -0.4, z: 0.15 },
            { x: -0.4, z: -0.15 },
            { x: 0.4, z: 0.15 },
            { x: 0.4, z: -0.15 }
        ];
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, bodyMaterial);
            leg.position.set(pos.x, 0.5, pos.z);
            deer.add(leg);
        });

        // Antlers
        const antlerMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4a3a,
            roughness: 0.7
        });
        for (let side of [-1, 1]) {
            const antlerGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.5, 6);
            const antler = new THREE.Mesh(antlerGeometry, antlerMaterial);
            antler.position.set(0.75, 1.8, side * 0.15);
            antler.rotation.z = side * 0.4;
            deer.add(antler);
        }

        return deer;
    }

    createButterfly() {
        const butterfly = new THREE.Group();

        // Wings
        const wingGeometry = new THREE.CircleGeometry(0.15, 8);
        const colors = [0xff69b4, 0x87ceeb, 0xffa500, 0x98fb98];
        const wingMaterial = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.z = 0.1;
        butterfly.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.z = -0.1;
        butterfly.add(rightWing);

        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        butterfly.add(body);

        return butterfly;
    }

    createFlower() {
        const flower = new THREE.Group();

        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.25;
        flower.add(stem);

        // Petals
        const colors = [0xff69b4, 0xffff00, 0xff4500, 0xda70d6, 0xffffff];
        const petalColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 5; i++) {
            const petalGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            petalGeometry.scale(1, 0.3, 1);
            const petalMaterial = new THREE.MeshStandardMaterial({ color: petalColor });
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            const angle = (i / 5) * Math.PI * 2;
            petal.position.set(
                Math.cos(angle) * 0.1,
                0.55,
                Math.sin(angle) * 0.1
            );
            flower.add(petal);
        }

        // Center
        const centerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.55;
        flower.add(center);

        const scale = 0.5 + Math.random() * 0.8;
        flower.scale.set(scale, scale, scale);

        return flower;
    }

    getObject() {
        return this.group;
    }
}
