/**
 * Points of Interest - Defines special locations in the forest
 * Refactored to use modular sub-components
 * @module PointsOfInterest
 */

import { CONFIG } from '../config.js';
import { GiantTree } from './poi/GiantTree.js';
import { WildlifeArea } from './poi/WildlifeArea.js';
import { River } from './poi/River.js';

export class PointsOfInterest {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.points = {};
        this.poiConfig = CONFIG.pointsOfInterest || {};

        this.init();
    }

    init() {
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

        // Create main tree
        const tree = new GiantTree().getObject();
        tree.position.set(config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(tree);

        // Add glowing mushrooms around the giant tree
        for (let i = 0; i < 12; i++) {
            const mushroom = GiantTree.createGlowingMushroom();
            const angle = (i / 12) * Math.PI * 2;
            mushroom.position.set(
                config.position.x + Math.cos(angle) * (4 + Math.random() * 2),
                0,
                config.position.z + Math.sin(angle) * (4 + Math.random() * 2)
            );
            this.sceneManager.add(mushroom);
        }

        // Create second giant tree on the opposite side
        const tree2 = new GiantTree().getObject();
        tree2.position.set(-config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(tree2);

        // Mushrooms around second tree
        for (let i = 0; i < 8; i++) {
            const mushroom = GiantTree.createGlowingMushroom();
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

    createWildlifeArea() {
        const config = this.poiConfig.wildlife || {
            position: { x: 15, y: 0, z: -80 },
            cameraPosition: { x: 15, y: 3, z: -70 },
            lookAt: { x: 15, y: 1.5, z: -80 }
        };

        const wildlife = new WildlifeArea().getObject();
        wildlife.position.set(config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(wildlife);

        this.points.wildlife = {
            object: wildlife,
            cameraPosition: config.cameraPosition,
            lookAt: config.lookAt
        };
    }

    createRiver() {
        const config = this.poiConfig.river || {
            position: { x: 0, y: 0, z: -120 },
            cameraPosition: { x: 5, y: 2, z: -110 },
            lookAt: { x: 0, y: 0, z: -130 }
        };

        const river = new River().getObject();
        river.position.set(config.position.x, config.position.y, config.position.z);
        this.sceneManager.add(river);

        this.points.river = {
            object: river,
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

    getPointNames() {
        return Object.keys(this.points);
    }
}
