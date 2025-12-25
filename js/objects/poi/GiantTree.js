/**
 * Giant Tree - A special point of interest
 * @module poi/GiantTree
 */

export class GiantTree {
    constructor() {
        this.mesh = this.createTree();
        this.addMushrooms();
    }

    createTree() {
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

    addMushrooms() {
        // Mushrooms attached to the tree group for simplicity
        // or we can return them separately.
        // For now, let's just use the createMushroom logic if needed,
        // but the original code placed mushrooms AROUND the tree in world space.
        // We will expose a method to get specific group if needed.
    }

    // Helper to create glowing mushroom instance
    static createGlowingMushroom() {
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

    getObject() {
        return this.mesh;
    }
}
