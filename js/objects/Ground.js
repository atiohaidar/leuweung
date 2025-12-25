/**
 * Ground - Creates the forest ground/terrain
 * @module Ground
 */

import { CONFIG } from '../config.js';

export class Ground {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.mesh = null;

        this.create();
    }

    create() {
        const config = CONFIG.ground;

        const geometry = new THREE.PlaneGeometry(
            config.width,
            config.height,
            config.segments,
            config.segments
        );

        // Add terrain variation
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] += Math.random() * config.terrainVariation;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: config.roughness,
            metalness: config.metalness
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = -0.5;

        this.sceneManager.add(this.mesh);
    }

    getMesh() {
        return this.mesh;
    }
}
