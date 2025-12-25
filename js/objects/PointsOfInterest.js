/**
 * Points of Interest - Defines special locations in the forest
 * Reads configuration from config.js for better maintainability
 * @module PointsOfInterest
 */

import { CONFIG } from '../config.js';

export class PointsOfInterest {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.points = {};
        this.poiConfig = CONFIG.pointsOfInterest || {};

        this.createGiantTree();
        this.createWildlifeArea();
        this.createRiver();
    }

    createGiantTree() {
        const config = this.poiConfig.giantTree || {
            position: { x: -15, y: 0, z: -50 },
            cameraPosition: { x: -8, y: 5, z: -40 },
            lookAt: { x: -15, y: 10, z: -50 }
        };

        const tree = new THREE.Group();

        // Giant trunk
        const trunkGeometry = new THREE.CylinderGeometry(1.5, 2.5, 15, 12);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4738,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 7.5;
        tree.add(trunk);

        // Massive foliage layers
        const foliageColors = [0x1d5a2a, 0x2d6a3a, 0x3d7a4a, 0x1d4a2a, 0x2a5a3a];
        for (let i = 0; i < 5; i++) {
            const foliageGeometry = new THREE.SphereGeometry(8 - i * 1.2, 16, 16);
            const foliageMaterial = new THREE.MeshStandardMaterial({
                color: foliageColors[i],
                roughness: 0.8
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 12 + i * 3;
            foliage.scale.y = 0.6;
            tree.add(foliage);
        }

        // Roots
        for (let i = 0; i < 8; i++) {
            const rootGeometry = new THREE.CylinderGeometry(0.3, 0.8, 4, 6);
            const rootMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a3728,
                roughness: 0.9
            });
            const root = new THREE.Mesh(rootGeometry, rootMaterial);
            const angle = (i / 8) * Math.PI * 2;
            root.position.set(
                Math.cos(angle) * 2,
                0,
                Math.sin(angle) * 2
            );
            root.rotation.z = Math.cos(angle) * 0.5;
            root.rotation.x = Math.sin(angle) * 0.5;
            tree.add(root);
        }

        tree.position.set(config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(tree);

        // Add glowing mushrooms around the giant tree
        for (let i = 0; i < 12; i++) {
            const mushroom = this.createGlowingMushroom();
            const angle = (i / 12) * Math.PI * 2;
            mushroom.position.set(
                config.position.x + Math.cos(angle) * (4 + Math.random() * 2),
                0,
                config.position.z + Math.sin(angle) * (4 + Math.random() * 2)
            );
            this.sceneManager.add(mushroom);
        }

        // Create second giant tree on the opposite side (so camera passes between them)
        const tree2 = this.createGiantTreeMesh();
        tree2.position.set(-config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(tree2);

        // Mushrooms around second tree
        for (let i = 0; i < 8; i++) {
            const mushroom = this.createGlowingMushroom();
            const angle = (i / 8) * Math.PI * 2;
            mushroom.position.set(
                -config.position.x + Math.cos(angle) * (4 + Math.random() * 2),
                0,
                config.position.z + Math.sin(angle) * (4 + Math.random() * 2)
            );
            this.sceneManager.add(mushroom);
        }

        this.points.giantTree = {
            object: tree,
            cameraPosition: config.cameraPosition,
            lookAt: config.lookAt
        };
    }

    createGiantTreeMesh() {
        const tree = new THREE.Group();

        // Giant trunk
        const trunkGeometry = new THREE.CylinderGeometry(1.5, 2.5, 15, 12);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a4738,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 7.5;
        tree.add(trunk);

        // Massive foliage layers
        const foliageColors = [0x1d5a2a, 0x2d6a3a, 0x3d7a4a, 0x1d4a2a, 0x2a5a3a];
        for (let i = 0; i < 5; i++) {
            const foliageGeometry = new THREE.SphereGeometry(8 - i * 1.2, 16, 16);
            const foliageMaterial = new THREE.MeshStandardMaterial({
                color: foliageColors[i],
                roughness: 0.8
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 12 + i * 3;
            foliage.scale.y = 0.6;
            tree.add(foliage);
        }

        // Roots
        for (let i = 0; i < 8; i++) {
            const rootGeometry = new THREE.CylinderGeometry(0.3, 0.8, 4, 6);
            const rootMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a3728,
                roughness: 0.9
            });
            const root = new THREE.Mesh(rootGeometry, rootMaterial);
            const angle = (i / 8) * Math.PI * 2;
            root.position.set(
                Math.cos(angle) * 2,
                0,
                Math.sin(angle) * 2
            );
            root.rotation.z = Math.cos(angle) * 0.5;
            root.rotation.x = Math.sin(angle) * 0.5;
            tree.add(root);
        }

        return tree;
    }

    createGlowingMushroom() {
        const mushroom = new THREE.Group();

        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5dc,
            roughness: 0.7
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.25;
        mushroom.add(stem);

        // Cap
        const capGeometry = new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const capMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ffaa,
            transparent: true,
            opacity: 0.8
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 0.5;
        mushroom.add(cap);

        // Glow
        const glowLight = new THREE.PointLight(0x88ffaa, 0.5, 3);
        glowLight.position.y = 0.5;
        mushroom.add(glowLight);

        const scale = 0.5 + Math.random() * 0.5;
        mushroom.scale.set(scale, scale, scale);

        return mushroom;
    }

    createWildlifeArea() {
        const config = this.poiConfig.wildlife || {
            position: { x: 15, y: 0, z: -80 },
            cameraPosition: { x: 15, y: 3, z: -70 },
            lookAt: { x: 15, y: 1.5, z: -80 }
        };

        const wildlifeArea = new THREE.Group();

        // Create some animal silhouettes (deer)
        for (let i = 0; i < 3; i++) {
            const deer = this.createDeer();
            deer.position.set(i * 3 - 3, 0, Math.random() * 2 - 1);
            deer.rotation.y = Math.random() * 0.5 - 0.25;
            wildlifeArea.add(deer);
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
            wildlifeArea.add(butterfly);
        }

        // Flowers
        for (let i = 0; i < 30; i++) {
            const flower = this.createFlower();
            flower.position.set(
                (Math.random() - 0.5) * 20,
                0,
                (Math.random() - 0.5) * 15
            );
            wildlifeArea.add(flower);
        }

        wildlifeArea.position.set(config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(wildlifeArea);

        this.points.wildlife = {
            object: wildlifeArea,
            cameraPosition: config.cameraPosition,
            lookAt: config.lookAt
        };
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

    createRiver() {
        const config = this.poiConfig.river || {
            position: { x: 0, y: 0, z: -120 },
            cameraPosition: { x: 5, y: 2, z: -110 },
            lookAt: { x: 0, y: 0, z: -130 }
        };

        const riverGroup = new THREE.Group();

        // River bed
        const riverGeometry = new THREE.PlaneGeometry(8, 100, 20, 50);

        // Add wave deformation
        const vertices = riverGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i] += Math.sin(vertices[i + 1] * 0.2) * 0.5;
        }
        riverGeometry.attributes.position.needsUpdate = true;

        const riverMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e90ff,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.3
        });

        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.rotation.x = -Math.PI / 2;
        river.position.y = -0.3;
        riverGroup.add(river);

        // River rocks
        for (let i = 0; i < 20; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.3, 0);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x696969,
                roughness: 0.9
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(
                (Math.random() - 0.5) * 6,
                -0.2,
                (Math.random() - 0.5) * 40
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            riverGroup.add(rock);
        }

        // Water sparkles
        const sparkleCount = 100;
        const sparkleGeometry = new THREE.BufferGeometry();
        const sparklePositions = new Float32Array(sparkleCount * 3);

        for (let i = 0; i < sparkleCount * 3; i += 3) {
            sparklePositions[i] = (Math.random() - 0.5) * 6;
            sparklePositions[i + 1] = 0;
            sparklePositions[i + 2] = (Math.random() - 0.5) * 60;
        }

        sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));

        const sparkleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
        sparkles.userData.isSparkle = true;
        riverGroup.add(sparkles);

        riverGroup.position.set(config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(riverGroup);

        this.points.river = {
            object: riverGroup,
            cameraPosition: config.cameraPosition,
            lookAt: config.lookAt
        };
    }

    getPoint(name) {
        return this.points[name];
    }

    getAllPoints() {
        return this.points;
    }

    /**
     * Get point names
     * @returns {string[]} Array of point names
     */
    getPointNames() {
        return Object.keys(this.points);
    }
}
