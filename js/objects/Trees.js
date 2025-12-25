/**
 * Trees - Creates and manages forest trees
 * @module Trees
 */

import { CONFIG } from '../config.js';

export class Trees {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.trees = [];

        this.createTrees();
    }

    createTree() {
        const tree = new THREE.Group();
        const config = CONFIG.trees;

        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(
            config.trunk.radiusTop,
            config.trunk.radiusBottom,
            config.trunk.height,
            config.trunk.segments
        );
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: config.trunk.color,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = config.trunk.height / 2;
        tree.add(trunk);

        // Tree foliage (multiple layers for fuller look)
        const foliage = config.foliage;
        for (let i = 0; i < foliage.layers; i++) {
            const foliageGeometry = new THREE.ConeGeometry(
                foliage.baseRadius - i * foliage.radiusDecrement,
                foliage.baseHeight - i * foliage.heightDecrement,
                8
            );
            const foliageMaterial = new THREE.MeshStandardMaterial({
                color: foliage.colors[i % foliage.colors.length],
                roughness: 0.8
            });
            const foliageMesh = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliageMesh.position.y = foliage.yOffset + i * foliage.yIncrement;
            tree.add(foliageMesh);
        }

        return tree;
    }

    createTrees() {
        const config = CONFIG.trees;

        for (let i = 0; i < config.count; i++) {
            const tree = this.createTree();

            // Position trees along a path
            let x = (Math.random() - 0.5) * config.spread;
            const z = -Math.random() * config.depthRange - 10;

            // Create a path in the middle
            if (Math.abs(x) < config.pathWidth) {
                x = x > 0
                    ? config.pathWidth + Math.random() * 10
                    : -config.pathWidth - Math.random() * 10;
            }

            tree.position.set(x, 0, z);
            tree.rotation.y = Math.random() * Math.PI * 2;

            // Random scale variation
            const scale = config.minScale + Math.random() * config.maxScaleVariation;
            tree.scale.set(scale, scale + Math.random() * 0.5, scale);

            this.sceneManager.add(tree);
            this.trees.push(tree);
        }
    }

    update(time) {
        const config = CONFIG.trees;

        // Subtle tree sway
        this.trees.forEach((tree, index) => {
            tree.rotation.z = Math.sin(time * config.swaySpeed + index * 0.1) *
                config.swayAmount;
        });
    }

    getTrees() {
        return this.trees;
    }
}
