/**
 * Setup Clickable Objects
 * Handles registration of interactive objects in the scene
 * @module setup/ClickableRegistry
 */

// import { InfoModal } from '../ui/InfoModal.js';
import { Logger } from '../utils/Logger.js';

export class ClickableRegistry {
    /**
     * @param {Object} context - ForestExperience instance context
     * Needs: effects.objectInteraction, sceneObjects, etc.
     */
    constructor(context) {
        this.context = context;
        this.infoModal = null;
    }

    init() {
        // InfoModal replaced by Labels3D info card
        // this.infoModal = new InfoModal();
        // this.context.infoModal = this.infoModal; 

        this.registerAll();
    }

    registerAll() {
        const { sceneObjects, effects } = this.context;
        const oi = effects.objectInteraction;
        if (!oi) {
            Logger.warn('Setup', 'ObjectInteraction effect not found');
            return;
        }

        // 1. PointsOfInterest
        const poi = sceneObjects.pointsOfInterest;
        if (poi && poi.points) {
            const poiObjects = {};
            Object.entries(poi.points).forEach(([id, data]) => {
                if (data.object) {
                    poiObjects[id] = data.object;
                }
            });
            oi.registerFromSource(poiObjects, 'PointsOfInterest');
        }

        // 2. Deforestation
        if (sceneObjects.deforestation && sceneObjects.deforestation.machinery) {
            oi.registerClickable(sceneObjects.deforestation.machinery, 'deforestation');
        }

        // 3. Earth
        if (sceneObjects.earth && sceneObjects.earth.earth) {
            oi.registerClickable(sceneObjects.earth.earth, 'earth');
        }

        // 4. Wildlife (if already loaded)
        if (sceneObjects.wildlife) {
            this.registerWildlife();
        }

        // 5. Fish
        if (effects.jumpingFish) {
            const fish = effects.jumpingFish.getFish();
            fish.forEach(f => f.userData.type = 'fish');
            oi.registerAnimals(fish, 'type');
        }

        // 6. Tress (Sample)
        if (sceneObjects.trees) {
            const trees = sceneObjects.trees.getTrees();
            const clickableTrees = trees.filter((_, i) => i % 10 === 0);
            oi.registerAnimals(clickableTrees, 'type');
            Logger.info('Setup', `Registered ${clickableTrees.length} trees as clickable`);
        }
    }

    registerWildlife() {
        const { sceneObjects, effects } = this.context;
        const wildlife = sceneObjects.wildlife;
        const oi = effects.objectInteraction;

        if (!wildlife || !oi) return;

        const animals = wildlife.getAnimals();
        oi.registerAnimals(animals, 'type');
        Logger.info('Setup', `Registered ${animals.length} wildlife animals as clickable`);
    }
}
