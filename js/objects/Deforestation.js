/**
 * Deforestation Scene - Loggers and fallen trees
 * Refactored to use sub-modules for better maintainability
 * @module Deforestation
 */

import { CONFIG } from '../config.js';
import {
    createStump,
    createFallenTree,
    createLogger,
    createLoggingTruck,
    createBurningTree,
    createWarningSign
} from './deforestation/index.js';

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
        const sign = createWarningSign();
        sign.position.set(areaX + 10, 0, areaZ + 5);
        this.scene.add(sign);

        // Create burning trees
        this.createBurningTrees(areaX, areaZ);
    }

    createStumps(baseX, baseZ) {
        // Expanded stump positions
        const stumpPositions = [
            { x: 0, z: 0 }, { x: 3, z: 2 }, { x: -2, z: 4 }, { x: 4, z: -3 },
            { x: -4, z: 1 }, { x: 1, z: 5 }, { x: 5, z: 3 }, { x: -3, z: -2 },
            { x: 6, z: 0 }, { x: 7, z: -2 }, { x: 8, z: 1 }, { x: -5, z: 3 },
            { x: -6, z: -1 }, { x: 2, z: -4 }, { x: -1, z: -5 }, { x: 5, z: -5 },
            { x: 7, z: 4 }, { x: -4, z: 5 }, { x: 0, z: 7 }, { x: 3, z: 6 },
            { x: -3, z: -4 }, { x: 6, z: 5 }
        ];

        stumpPositions.forEach(pos => {
            const stump = createStump();
            stump.position.set(
                baseX + pos.x + (Math.random() - 0.5),
                0,
                baseZ + pos.z + (Math.random() - 0.5)
            );
            this.scene.add(stump);
            this.stumps.push(stump);
        });
    }

    createFallenTrees(baseX, baseZ) {
        const fallenPositions = [
            { x: 2, z: 0, rotation: 0.3 }, { x: -1, z: 3, rotation: 1.2 },
            { x: 4, z: 4, rotation: 2.5 }, { x: -4, z: -2, rotation: 0.8 },
            { x: 6, z: 1, rotation: 1.8 }, { x: 0, z: 6, rotation: 3.0 },
            { x: 7, z: -3, rotation: 2.2 }
        ];

        fallenPositions.forEach(pos => {
            const fallenTree = createFallenTree();
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

    createLoggers(baseX, baseZ) {
        const loggerPositions = [
            { x: 1, z: 1, rotation: 0.5 },
            { x: -2, z: 2, rotation: -0.3 }
        ];

        loggerPositions.forEach((pos, index) => {
            const logger = createLogger(index === 0);
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

    createMachinery(baseX, baseZ) {
        const truck = createLoggingTruck();
        truck.position.set(baseX + 8, 0, baseZ + 2);
        truck.rotation.y = -0.5;
        this.scene.add(truck);
        this.machinery = truck;
    }

    createBurningTrees(baseX, baseZ) {
        const burningPositions = [
            { x: -8, z: 2 }, { x: -10, z: -3 },
            { x: 10, z: 6 }, { x: -6, z: 5 }
        ];

        burningPositions.forEach(pos => {
            const tree = createBurningTree();
            tree.position.set(baseX + pos.x, 0, baseZ + pos.z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            this.scene.add(tree);
            this.burningTrees.push(tree);
        });
    }

    update(time) {
        // Animate loggers (simple idle animation)
        this.loggers.forEach((logger, index) => {
            logger.rotation.z = Math.sin(time * 2 + index) * 0.05;

            // Arm movement (sawing motion)
            // Arms are children 5 and 6 in the logger group (check LoggerFigure.js)
            // LeftArm is 6th added child (index 5 - body, head, hat, leg1, leg2, leftArm)
            // RightArm is 7th added child (index 6)
            // Let's protect against index changes by checking existence
            if (logger.children.length > 6) {
                const arms = [logger.children[5], logger.children[6]];
                arms.forEach(arm => {
                    if (arm) arm.rotation.x = -0.3 + Math.sin(time * 4 + index) * 0.2;
                });
            }
        });

        // Animate fire particles
        this.burningTrees.forEach(tree => {
            const fireGroup = tree.getObjectByName('fireParticles');
            if (fireGroup) {
                fireGroup.children.forEach(particle => {
                    const data = particle.userData;
                    particle.position.y = data.baseY + Math.sin(time * data.speed + data.phase) * 0.5;
                    particle.material.opacity = 0.5 + Math.sin(time * data.speed * 3 + data.phase) * 0.3;
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
