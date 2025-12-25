/**
 * Setup Lazy Loading
 * Handles configuration and initialization of lazy loader
 * @module setup/LazyLoadingSetup
 */

import { CONFIG } from '../config.js';
import { Wildlife } from '../objects/Wildlife.js';
import { Deforestation } from '../objects/Deforestation.js';
import { Earth } from '../objects/Earth.js';
import { Logger } from '../utils/Logger.js';

export class LazyLoadingSetup {
    /**
     * @param {Object} context - ForestExperience instance context
     */
    constructor(context) {
        this.context = context;
        this.loader = context.lazyLoader;
    }

    init() {
        if (!this.loader) {
            Logger.error('Setup', 'LazyLoader not initialized in context');
            return;
        }

        const lazyConfig = CONFIG.lazyLoading?.objects || {};

        // Wildlife
        if (lazyConfig.wildlife) {
            this.loader.register(
                'wildlife',
                () => new Wildlife(this.context.sceneManager),
                lazyConfig.wildlife.loadAt,
                (instance) => {
                    this.context.sceneObjects.wildlife = instance;
                    this.context.animationManager?.register(instance, 'Wildlife');

                    // Callback to register clickables requires access to ClickableRegistry
                    // We assume context has clickableRegistry instance
                    if (this.context.clickableRegistry) {
                        this.context.clickableRegistry.registerWildlife();
                    }
                    Logger.info('LazyLoad', 'Wildlife loaded');
                }
            );
        }

        // Deforestation
        if (lazyConfig.deforestation) {
            this.loader.register(
                'deforestation',
                () => new Deforestation(this.context.sceneManager),
                lazyConfig.deforestation.loadAt,
                (instance) => {
                    this.context.sceneObjects.deforestation = instance;
                    this.context.animationManager?.register(instance, 'Deforestation');
                    Logger.info('LazyLoad', 'Deforestation loaded');

                    // Register machinery if clickable registry exists
                    if (this.context.clickableRegistry &&
                        this.context.effects.objectInteraction &&
                        instance.machinery) {
                        this.context.effects.objectInteraction.registerClickable(instance.machinery, 'deforestation');
                    }
                }
            );
        }

        // Earth
        if (lazyConfig.earth) {
            this.loader.register(
                'earth',
                () => new Earth(this.context.sceneManager),
                lazyConfig.earth.loadAt,
                (instance) => {
                    this.context.sceneObjects.earth = instance;
                    this.context.animationManager?.register(instance, 'Earth');
                    Logger.info('LazyLoad', 'Earth loaded');

                    if (this.context.clickableRegistry &&
                        this.context.effects.objectInteraction &&
                        instance.earth) {
                        this.context.effects.objectInteraction.registerClickable(instance.earth, 'earth');
                    }
                }
            );
        }
    }
}
