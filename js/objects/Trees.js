/**
 * Trees - Creates and manages forest trees using InstancedMesh for performance
 * @module Trees
 * 
 * Performance Optimization:
 * - Before: 150 trees × 5 meshes = 750 draw calls
 * - After: 5 InstancedMesh = 5 draw calls (150x improvement!)
 */

import { CONFIG } from '../config.js';

export class Trees {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.treeCount = CONFIG.trees.count;

        // Store instance data for updates and interactions
        this.instanceData = [];

        // InstancedMesh references
        this.trunkMesh = null;
        this.foliageMeshes = [];

        // Temporary objects for matrix calculations
        this.tempMatrix = new THREE.Matrix4();
        this.tempPosition = new THREE.Vector3();
        this.tempQuaternion = new THREE.Quaternion();
        this.tempScale = new THREE.Vector3();
        this.tempEuler = new THREE.Euler();

        // Clickable proxy objects for raycasting
        this.clickableProxies = [];

        this.createTrees();
    }

    createTrees() {
        const config = CONFIG.trees;
        const foliageConfig = config.foliage;

        // Create shared geometries (created once, used by all instances)
        const trunkGeometry = new THREE.CylinderGeometry(
            config.trunk.radiusTop,
            config.trunk.radiusBottom,
            config.trunk.height,
            config.trunk.segments
        );

        // Create foliage geometries for each layer
        const foliageGeometries = [];
        for (let i = 0; i < foliageConfig.layers; i++) {
            const geometry = new THREE.ConeGeometry(
                foliageConfig.baseRadius - i * foliageConfig.radiusDecrement,
                foliageConfig.baseHeight - i * foliageConfig.heightDecrement,
                8
            );
            foliageGeometries.push(geometry);
        }

        // Create shared materials
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: config.trunk.color,
            roughness: 0.9
        });

        const foliageMaterials = foliageConfig.colors.map(color =>
            new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.8
            })
        );

        // Create InstancedMesh for trunk
        this.trunkMesh = new THREE.InstancedMesh(
            trunkGeometry,
            trunkMaterial,
            this.treeCount
        );
        this.trunkMesh.frustumCulled = false; // Disabled - instances spread too wide for bounding sphere
        this.trunkMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        // Create InstancedMesh for each foliage layer
        for (let layer = 0; layer < foliageConfig.layers; layer++) {
            const foliageMesh = new THREE.InstancedMesh(
                foliageGeometries[layer],
                foliageMaterials[layer % foliageMaterials.length],
                this.treeCount
            );
            foliageMesh.frustumCulled = false; // Disabled - instances spread too wide
            foliageMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            this.foliageMeshes.push(foliageMesh);
        }

        // Generate tree positions and set instance matrices
        for (let i = 0; i < this.treeCount; i++) {
            // Calculate position
            let x = (Math.random() - 0.5) * config.spread;
            const z = -Math.random() * config.depthRange - 10;

            // Create path in the middle
            if (Math.abs(x) < config.pathWidth) {
                x = x > 0
                    ? config.pathWidth + Math.random() * 10
                    : -config.pathWidth - Math.random() * 10;
            }

            const y = 0;
            const rotationY = Math.random() * Math.PI * 2;
            const scale = config.minScale + Math.random() * config.maxScaleVariation;
            const scaleY = scale + Math.random() * 0.5;

            // Store instance data for animations and interactions
            this.instanceData.push({
                position: new THREE.Vector3(x, y, z),
                rotationY: rotationY,
                scale: new THREE.Vector3(scale, scaleY, scale),
                baseRotationZ: 0
            });

            // Set trunk instance matrix
            this.setTrunkMatrix(i);

            // Set foliage instance matrices
            this.setFoliageMatrices(i);

            // Create invisible clickable proxy for raycasting
            this.createClickableProxy(i, x, y, z, scale, scaleY);
        }

        // Add instanced meshes to scene
        this.sceneManager.add(this.trunkMesh);
        this.foliageMeshes.forEach(mesh => this.sceneManager.add(mesh));

        // CRITICAL: Mark matrices as needing update for first render
        this.trunkMesh.instanceMatrix.needsUpdate = true;
        this.foliageMeshes.forEach(mesh => {
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    setTrunkMatrix(index) {
        const data = this.instanceData[index];
        const config = CONFIG.trees;

        // Trunk position (raised by half height)
        this.tempPosition.set(
            data.position.x,
            data.position.y + (config.trunk.height / 2) * data.scale.y,
            data.position.z
        );

        // Apply rotation (including sway)
        this.tempEuler.set(0, data.rotationY, data.baseRotationZ);
        this.tempQuaternion.setFromEuler(this.tempEuler);

        // Apply scale
        this.tempScale.copy(data.scale);

        // Compose matrix
        this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);
        this.trunkMesh.setMatrixAt(index, this.tempMatrix);
    }

    setFoliageMatrices(index) {
        const data = this.instanceData[index];
        const foliageConfig = CONFIG.trees.foliage;

        for (let layer = 0; layer < foliageConfig.layers; layer++) {
            // Foliage position
            const foliageY = data.position.y +
                (foliageConfig.yOffset + layer * foliageConfig.yIncrement) * data.scale.y;

            this.tempPosition.set(data.position.x, foliageY, data.position.z);

            // Apply rotation (including sway)
            this.tempEuler.set(0, data.rotationY, data.baseRotationZ);
            this.tempQuaternion.setFromEuler(this.tempEuler);

            // Apply scale
            this.tempScale.copy(data.scale);

            // Compose matrix
            this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);
            this.foliageMeshes[layer].setMatrixAt(index, this.tempMatrix);
        }
    }

    createClickableProxy(index, x, y, z, scale, scaleY) {
        // Create an invisible bounding box for click detection
        const config = CONFIG.trees;
        const totalHeight = (config.trunk.height + config.foliage.yOffset +
            (config.foliage.layers - 1) * config.foliage.yIncrement +
            config.foliage.baseHeight) * scaleY;

        const proxyGeometry = new THREE.BoxGeometry(
            config.foliage.baseRadius * 2 * scale,
            totalHeight,
            config.foliage.baseRadius * 2 * scale
        );
        const proxyMaterial = new THREE.MeshBasicMaterial({
            visible: false // Invisible but still raycastable
        });

        const proxy = new THREE.Mesh(proxyGeometry, proxyMaterial);
        proxy.position.set(x, y + totalHeight / 2, z);
        proxy.userData.type = 'tree';
        proxy.userData.instanceIndex = index;

        this.sceneManager.add(proxy);
        this.clickableProxies.push(proxy);
    }

    update(time) {
        const config = CONFIG.trees;

        // Update sway animation for all trees
        for (let i = 0; i < this.treeCount; i++) {
            const data = this.instanceData[i];

            // Calculate sway rotation
            data.baseRotationZ = Math.sin(time * config.swaySpeed + i * 0.1) * config.swayAmount;

            // Update trunk matrix
            this.setTrunkMatrix(i);

            // Update foliage matrices
            this.setFoliageMatrices(i);
        }

        // Mark matrices as needing update
        this.trunkMesh.instanceMatrix.needsUpdate = true;
        this.foliageMeshes.forEach(mesh => {
            mesh.instanceMatrix.needsUpdate = true;
        });
    }

    getTrees() {
        // Return clickable proxies for compatibility with existing code
        return this.clickableProxies;
    }

    // Get all renderable meshes (for debugging/stats)
    getMeshes() {
        return [this.trunkMesh, ...this.foliageMeshes];
    }

    // Dispose resources properly
    dispose() {
        this.trunkMesh.geometry.dispose();
        this.trunkMesh.material.dispose();

        this.foliageMeshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });

        this.clickableProxies.forEach(proxy => {
            proxy.geometry.dispose();
            proxy.material.dispose();
        });
    }

    /**
     * Update foliage colors for seasonal theme changes
     * @param {number[]} colors - Array of hex colors for each foliage layer
     * @param {number} lerpFactor - Interpolation factor (0-1) for smooth transition
     */
    updateFoliageColors(colors, lerpFactor = 0.05) {
        if (!colors || colors.length === 0) return;

        this.foliageMeshes.forEach((mesh, index) => {
            const targetColor = new THREE.Color(colors[index % colors.length]);
            mesh.material.color.lerp(targetColor, lerpFactor);
        });
    }

    /**
     * Get foliage meshes for direct access (if needed)
     * @returns {THREE.InstancedMesh[]} Array of foliage instanced meshes
     */
    getFoliageMeshes() {
        return this.foliageMeshes;
    }
}
