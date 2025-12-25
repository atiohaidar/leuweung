/**
 * Deforestation Scene - Loggers and fallen trees
 * Reads configuration from config.js for better maintainability
 * @module Deforestation
 */

import { CONFIG } from '../config.js';

export class Deforestation {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.getScene();

        this.loggers = [];
        this.fallenTrees = [];
        this.stumps = [];
        this.machinery = null;
        this.burningTrees = [];
        this.fireParticles = [];

        // Load configuration from config.js
        const config = CONFIG.deforestation || {};
        this.areaPosition = config.position || { x: 15, z: -115 };
        this.stumpConfig = config.stumps || { count: 8, spread: 15 };
        this.fallenTreeConfig = config.fallenTrees || { count: 3, spread: 12 };
        this.loggerConfig = config.loggers || { count: 3, spread: 8 };
        this.burningTreeConfig = config.burningTrees || { count: 2, spread: 10 };

        this.create();
    }

    create() {
        const areaX = this.areaPosition.x;
        const areaZ = this.areaPosition.z;


        // Create tree stumps (cut trees)
        this.createStumps(areaX, areaZ);

        // Create fallen trees
        this.createFallenTrees(areaX, areaZ);

        // Create loggers
        this.createLoggers(areaX, areaZ);

        // Create machinery (chainsaw, truck)
        this.createMachinery(areaX, areaZ);

        // Add warning sign
        this.createWarningSign(areaX + 10, areaZ + 5);

        // Create burning trees
        this.createBurningTrees(areaX, areaZ);
    }

    createStumps(baseX, baseZ) {
        // Expanded stump positions for a larger, more visible deforestation area
        const stumpPositions = [
            // Original positions
            { x: 0, z: 0 },
            { x: 3, z: 2 },
            { x: -2, z: 4 },
            { x: 4, z: -3 },
            { x: -4, z: 1 },
            { x: 1, z: 5 },
            { x: 5, z: 3 },
            { x: -3, z: -2 },
            // Additional stumps for larger cleared area
            { x: 6, z: 0 },
            { x: 7, z: -2 },
            { x: 8, z: 1 },
            { x: -5, z: 3 },
            { x: -6, z: -1 },
            { x: 2, z: -4 },
            { x: -1, z: -5 },
            { x: 5, z: -5 },
            { x: 7, z: 4 },
            { x: -4, z: 5 },
            { x: 0, z: 7 },
            { x: 3, z: 6 },
            { x: -3, z: -4 },
            { x: 6, z: 5 }
        ];

        stumpPositions.forEach(pos => {
            const stump = this.createStump();
            stump.position.set(
                baseX + pos.x + (Math.random() - 0.5),
                0,
                baseZ + pos.z + (Math.random() - 0.5)
            );
            this.scene.add(stump);
            this.stumps.push(stump);
        });
    }

    createStump() {
        const stump = new THREE.Group();

        // Main stump
        const stumpGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 12);
        const stumpMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9
        });
        const stumpMesh = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stumpMesh.position.y = 0.15;
        stump.add(stumpMesh);

        // Tree rings on top
        const ringsGeometry = new THREE.CircleGeometry(0.38, 16);
        const ringsMaterial = new THREE.MeshStandardMaterial({
            color: 0xa08060,
            roughness: 0.8
        });
        const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
        rings.rotation.x = -Math.PI / 2;
        rings.position.y = 0.31;
        stump.add(rings);

        // Add some wood chips around
        for (let i = 0; i < 5; i++) {
            const chipGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.05);
            const chip = new THREE.Mesh(chipGeometry, stumpMaterial);
            const angle = (i / 5) * Math.PI * 2;
            chip.position.set(
                Math.cos(angle) * (0.5 + Math.random() * 0.3),
                0.01,
                Math.sin(angle) * (0.5 + Math.random() * 0.3)
            );
            chip.rotation.y = Math.random() * Math.PI;
            stump.add(chip);
        }

        return stump;
    }

    createFallenTrees(baseX, baseZ) {
        const fallenPositions = [
            { x: 2, z: 0, rotation: 0.3 },
            { x: -1, z: 3, rotation: 1.2 },
            { x: 4, z: 4, rotation: 2.5 },
            // Additional fallen trees
            { x: -4, z: -2, rotation: 0.8 },
            { x: 6, z: 1, rotation: 1.8 },
            { x: 0, z: 6, rotation: 3.0 },
            { x: 7, z: -3, rotation: 2.2 }
        ];

        fallenPositions.forEach(pos => {
            const fallenTree = this.createFallenTree();
            fallenTree.position.set(
                baseX + pos.x,
                0,
                baseZ + pos.z
            );
            fallenTree.rotation.y = pos.rotation;
            this.scene.add(fallenTree);
            this.fallenTrees.push(fallenTree);
        });
    }

    createFallenTree() {
        const tree = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4738,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.rotation.z = Math.PI / 2;
        trunk.position.set(2, 0.3, 0);
        tree.add(trunk);

        // Dead foliage (brown)
        const foliageGeometry = new THREE.ConeGeometry(1.2, 2, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3a2a,
            roughness: 0.9
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.rotation.z = Math.PI / 2;
        foliage.position.set(4, 0.5, 0);
        tree.add(foliage);

        // Broken branches
        for (let i = 0; i < 3; i++) {
            const branchGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 6);
            const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
            branch.position.set(
                1 + i * 1.2,
                0.4,
                (Math.random() - 0.5) * 0.5
            );
            branch.rotation.z = Math.random() * 0.5;
            branch.rotation.x = (Math.random() - 0.5) * 0.5;
            tree.add(branch);
        }

        return tree;
    }

    createLoggers(baseX, baseZ) {
        // Create 2 loggers
        const loggerPositions = [
            { x: 1, z: 1, rotation: 0.5 },
            { x: -2, z: 2, rotation: -0.3 }
        ];

        loggerPositions.forEach((pos, index) => {
            const logger = this.createLogger(index === 0);
            logger.position.set(
                baseX + pos.x,
                0,
                baseZ + pos.z
            );
            logger.rotation.y = pos.rotation;
            this.scene.add(logger);
            this.loggers.push(logger);
        });
    }

    createLogger(hasChainsaw = false) {
        const logger = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600, // Orange safety vest
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        logger.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc99,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.45;
        logger.add(head);

        // Hard hat
        const hatGeometry = new THREE.CylinderGeometry(0.18, 0.2, 0.1, 8);
        const hatMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00, // Yellow hard hat
            roughness: 0.5
        });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 1.6;
        logger.add(hat);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 6);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.1, 0.35, 0);
        logger.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.1, 0.35, 0);
        logger.add(rightLeg);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 6);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            roughness: 0.7
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.25, 1, 0.1);
        leftArm.rotation.z = 0.5;
        leftArm.rotation.x = -0.3;
        logger.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.25, 1, 0.1);
        rightArm.rotation.z = -0.5;
        rightArm.rotation.x = -0.3;
        logger.add(rightArm);

        // Chainsaw (if applicable)
        if (hasChainsaw) {
            const chainsaw = this.createChainsaw();
            chainsaw.position.set(0.3, 0.8, 0.3);
            chainsaw.rotation.x = -0.5;
            logger.add(chainsaw);
        } else {
            // Axe
            const axe = this.createAxe();
            axe.position.set(0.3, 0.9, 0.2);
            axe.rotation.z = -0.3;
            logger.add(axe);
        }

        return logger;
    }

    createChainsaw() {
        const chainsaw = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.1);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4400,
            roughness: 0.5
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        chainsaw.add(body);

        // Blade
        const bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.02);
        const bladeMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.3,
            metalness: 0.5
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.set(0.35, 0, 0);
        chainsaw.add(blade);

        return chainsaw;
    }

    createAxe() {
        const axe = new THREE.Group();

        // Handle
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.5, 6);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        axe.add(handle);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.03);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.4,
            metalness: 0.6
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.25;
        axe.add(head);

        return axe;
    }

    createMachinery(baseX, baseZ) {
        // Logging truck
        const truck = this.createLoggingTruck();
        truck.position.set(baseX + 8, 0, baseZ + 2);
        truck.rotation.y = -0.5;
        this.scene.add(truck);
        this.machinery = truck;
    }

    createLoggingTruck() {
        const truck = new THREE.Group();

        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(1.5, 1.2, 1.2);
        const cabinMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b0000,
            roughness: 0.6
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(-1, 0.8, 0);
        truck.add(cabin);

        // Windshield
        const windshieldGeometry = new THREE.PlaneGeometry(0.8, 0.5);
        const windshieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            roughness: 0.1,
            metalness: 0.3
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(-0.2, 1, 0);
        windshield.rotation.y = Math.PI / 2;
        truck.add(windshield);

        // Flatbed
        const flatbedGeometry = new THREE.BoxGeometry(3, 0.2, 1.4);
        const flatbedMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.8
        });
        const flatbed = new THREE.Mesh(flatbedGeometry, flatbedMaterial);
        flatbed.position.set(1, 0.5, 0);
        truck.add(flatbed);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.9
        });

        const wheelPositions = [
            { x: -1.2, z: 0.7 },
            { x: -1.2, z: -0.7 },
            { x: 0.5, z: 0.7 },
            { x: 0.5, z: -0.7 },
            { x: 1.8, z: 0.7 },
            { x: 1.8, z: -0.7 }
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, 0.3, pos.z);
            wheel.rotation.x = Math.PI / 2;
            truck.add(wheel);
        });

        // Logs on truck
        const logMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4738,
            roughness: 0.9
        });

        for (let i = 0; i < 5; i++) {
            const logGeometry = new THREE.CylinderGeometry(0.15, 0.18, 2.5, 8);
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.position.set(1, 0.8 + i * 0.25, (i % 2 - 0.5) * 0.3);
            log.rotation.z = Math.PI / 2;
            truck.add(log);
        }

        return truck;
    }

    createWarningSign(x, z) {
        const sign = new THREE.Group();

        // Post
        const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6);
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8
        });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.y = 0.75;
        sign.add(post);

        // Sign board
        const boardGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.05);
        const boardMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.6
        });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.y = 1.5;
        sign.add(board);

        // Warning text (simplified as white rectangle)
        const textGeometry = new THREE.PlaneGeometry(0.6, 0.08);
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 1.5, 0.03);
        sign.add(text);

        sign.position.set(x, 0, z);
        this.scene.add(sign);
    }

    createBurningTrees(baseX, baseZ) {
        // Positions for burning trees at the edge of deforestation
        const burningPositions = [
            { x: -8, z: 2 },
            { x: -10, z: -3 },
            { x: 10, z: 6 },
            { x: -6, z: 5 }
        ];

        burningPositions.forEach(pos => {
            const tree = this.createBurningTree();
            tree.position.set(baseX + pos.x, 0, baseZ + pos.z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            this.scene.add(tree);
            this.burningTrees.push(tree);
        });
    }

    createBurningTree() {
        const tree = new THREE.Group();

        // Charred trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        tree.add(trunk);

        // Burning foliage (orange/red)
        const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b2500,
            emissive: 0xff4400,
            emissiveIntensity: 0.5,
            roughness: 0.8
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 4;
        tree.add(foliage);

        // Fire particles
        const fireGroup = new THREE.Group();
        fireGroup.name = 'fireParticles';

        for (let i = 0; i < 15; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 6, 6);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xff6600 : 0xffcc00,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * 1.5,
                3 + Math.random() * 3,
                (Math.random() - 0.5) * 1.5
            );
            particle.userData = {
                baseY: particle.position.y,
                speed: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            };
            fireGroup.add(particle);
        }
        tree.add(fireGroup);

        // Point light for fire glow
        const fireLight = new THREE.PointLight(0xff4400, 2, 8);
        fireLight.position.y = 4;
        tree.add(fireLight);

        return tree;
    }

    update(time) {
        // Animate loggers (simple idle animation)
        this.loggers.forEach((logger, index) => {
            // Subtle body sway
            logger.rotation.z = Math.sin(time * 2 + index) * 0.05;

            // Arm movement (sawing motion)
            const arms = logger.children.filter((child, i) => i === 5 || i === 6);
            arms.forEach(arm => {
                arm.rotation.x = -0.3 + Math.sin(time * 4 + index) * 0.2;
            });
        });

        // Animate fire particles
        this.burningTrees.forEach(tree => {
            const fireGroup = tree.getObjectByName('fireParticles');
            if (fireGroup) {
                fireGroup.children.forEach(particle => {
                    const data = particle.userData;
                    // Rising motion
                    particle.position.y = data.baseY + Math.sin(time * data.speed + data.phase) * 0.5;
                    // Flicker
                    particle.material.opacity = 0.5 + Math.sin(time * data.speed * 3 + data.phase) * 0.3;
                    // Scale pulse
                    const scale = 0.8 + Math.sin(time * data.speed * 2 + data.phase) * 0.3;
                    particle.scale.setScalar(scale);
                });
            }
        });
    }

    getLoggers() {
        return this.loggers;
    }
}
