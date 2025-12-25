/**
 * Wildlife - Animals near the wildlife section
 * Reads configuration from config.js for better maintainability
 * @module Wildlife
 */

import { CONFIG } from '../config.js';

export class Wildlife {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.animals = [];

        // Load configuration from config.js
        const config = CONFIG.wildlife || {};
        this.areaPosition = config.position || { x: 0, z: -58 };
        this.animalConfig = config.animals || {
            deer: { count: 2, spread: 10 },
            rabbit: { count: 4, spread: 15 },
            butterfly: { count: 8, spread: 12, heightRange: { min: 1, max: 3 } }
        };

        this.createAnimals();
    }

    createDeer() {
        const deer = new THREE.Group();

        // Body (using cylinder instead of capsule for r128 compatibility)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6914,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.position.y = 0.8;
        deer.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0.6, 1.1, 0);
        deer.add(head);

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.05, 0.15, 4);
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(0.65, 1.3, 0.1);
        deer.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(0.65, 1.3, -0.1);
        deer.add(rightEar);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.6, 6);
        const legPositions = [
            { x: 0.3, z: 0.15 },
            { x: 0.3, z: -0.15 },
            { x: -0.3, z: 0.15 },
            { x: -0.3, z: -0.15 }
        ];
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, bodyMaterial);
            leg.position.set(pos.x, 0.3, pos.z);
            deer.add(leg);
        });

        // Tail
        const tailGeometry = new THREE.SphereGeometry(0.08, 6, 6);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.6, 0.9, 0);
        deer.add(tail);

        return deer;
    }

    createRabbit() {
        const rabbit = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        bodyGeometry.scale(1, 0.8, 0.7);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0826d,
            roughness: 0.9
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.15;
        rabbit.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0.12, 0.22, 0);
        rabbit.add(head);

        // Ears (using cylinder for r128 compatibility)
        const earGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 4);
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(0.12, 0.38, 0.03);
        leftEar.rotation.x = 0.2;
        rabbit.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(0.12, 0.38, -0.03);
        rightEar.rotation.x = -0.2;
        rabbit.add(rightEar);

        // Tail
        const tailGeometry = new THREE.SphereGeometry(0.04, 6, 6);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.15, 0.18, 0);
        rabbit.add(tail);

        return rabbit;
    }

    createButterfly() {
        const butterfly = new THREE.Group();

        const wingMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xff8844 : 0x44aaff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        // Wings
        const wingGeometry = new THREE.CircleGeometry(0.08, 6);

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(0.06, 0, 0);
        leftWing.name = 'leftWing';
        butterfly.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(-0.06, 0, 0);
        rightWing.name = 'rightWing';
        butterfly.add(rightWing);

        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 4);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        butterfly.add(body);

        return butterfly;
    }

    createAnimals() {
        const baseX = this.areaPosition.x;
        const baseZ = this.areaPosition.z;
        const deerConfig = this.animalConfig.deer;
        const rabbitConfig = this.animalConfig.rabbit;
        const butterflyConfig = this.animalConfig.butterfly;

        // Create deer
        for (let i = 0; i < deerConfig.count; i++) {
            const deer = this.createDeer();
            deer.position.set(
                baseX + (i === 0 ? -3 : 4),
                0,
                baseZ + (Math.random() - 0.5) * deerConfig.spread
            );
            deer.rotation.y = Math.random() * Math.PI * 2;
            deer.userData = {
                type: 'deer',
                originalY: 0,
                phase: Math.random() * Math.PI * 2
            };
            this.scene.add(deer);
            this.animals.push(deer);
        }

        // Create rabbits
        for (let i = 0; i < rabbitConfig.count; i++) {
            const rabbit = this.createRabbit();
            rabbit.position.set(
                baseX + (Math.random() - 0.5) * rabbitConfig.spread,
                0,
                baseZ + (Math.random() - 0.5) * rabbitConfig.spread
            );
            rabbit.rotation.y = Math.random() * Math.PI * 2;
            rabbit.userData = {
                type: 'rabbit',
                phase: Math.random() * Math.PI * 2,
                hopSpeed: 2 + Math.random()
            };
            this.scene.add(rabbit);
            this.animals.push(rabbit);
        }

        // Create butterflies
        const heightRange = butterflyConfig.heightRange || { min: 1, max: 3 };
        for (let i = 0; i < butterflyConfig.count; i++) {
            const butterfly = this.createButterfly();
            const baseY = heightRange.min + Math.random() * (heightRange.max - heightRange.min);
            butterfly.position.set(
                baseX + (Math.random() - 0.5) * butterflyConfig.spread,
                baseY,
                baseZ + (Math.random() - 0.5) * butterflyConfig.spread
            );
            butterfly.userData = {
                type: 'butterfly',
                phase: Math.random() * Math.PI * 2,
                speed: 3 + Math.random() * 2,
                baseY: butterfly.position.y,
                baseX: butterfly.position.x
            };
            this.scene.add(butterfly);
            this.animals.push(butterfly);
        }
    }

    update(time) {
        this.animals.forEach(animal => {
            const data = animal.userData;

            if (data.type === 'deer') {
                // Subtle head movement
                animal.rotation.y += Math.sin(time + data.phase) * 0.001;
            }

            if (data.type === 'rabbit') {
                // Hopping motion
                const hop = Math.abs(Math.sin(time * data.hopSpeed + data.phase));
                animal.position.y = hop * 0.1;
            }

            if (data.type === 'butterfly') {
                // Flutter wings
                const leftWing = animal.getObjectByName('leftWing');
                const rightWing = animal.getObjectByName('rightWing');
                const wingAngle = Math.sin(time * data.speed * 3 + data.phase) * 0.6;

                if (leftWing) leftWing.rotation.y = wingAngle;
                if (rightWing) rightWing.rotation.y = -wingAngle;

                // Float around
                animal.position.y = data.baseY + Math.sin(time * data.speed + data.phase) * 0.3;
                animal.position.x = data.baseX + Math.sin(time * data.speed * 0.5 + data.phase) * 0.5;
            }
        });
    }

    /**
     * Get all animals
     * @returns {THREE.Group[]} Array of animal groups
     */
    getAnimals() {
        return this.animals;
    }

    /**
     * Get animals by type
     * @param {string} type - 'deer', 'rabbit', or 'butterfly'
     * @returns {THREE.Group[]} Filtered animals
     */
    getAnimalsByType(type) {
        return this.animals.filter(a => a.userData.type === type);
    }
}
