/**
 * Configuration Index - Central entry point for all configuration
 * Re-exports all config modules as a single CONFIG object for backward compatibility
 * @module config
 */

import { sceneConfig } from './scene.js';
import { objectsConfig } from './objects.js';
import { effectsConfig } from './effects.js';
import { contentConfig } from './content.js';
import { uiConfig } from './ui.js';
import { themesConfig } from './themes.js';

/**
 * Main configuration object - combines all config modules
 * This maintains backward compatibility with existing code that imports CONFIG
 */
export const CONFIG = {
    // Scene settings
    ...sceneConfig,

    // Object settings
    ...objectsConfig,

    // Animation settings
    animation: contentConfig.animation,

    // 3D Labels
    labels3D: contentConfig.labels3D,

    // 3D Section Titles
    sectionTitles3D: {
        params: effectsConfig.sectionTitles3D,
        sections: contentConfig.sectionTitles
    },

    // Points of Interest (from objects)
    pointsOfInterest: objectsConfig.pointsOfInterest,

    // UI settings
    ui: uiConfig,

    // Effects settings
    effects: {
        mouseParallax: effectsConfig.mouseParallax,
        magicParticles: effectsConfig.magicParticles,
        flyingBirds: effectsConfig.flyingBirds,
        jumpingFish: effectsConfig.jumpingFish,
        flashlight: effectsConfig.flashlight,
        autoScroll: effectsConfig.autoScroll,
        cameraController: effectsConfig.cameraController,
        animalInteraction: effectsConfig.animalInteraction
    },

    // Animal interaction info
    animalInteraction: contentConfig.animalInfo,

    // Seasonal themes
    seasonalThemes: themesConfig
};

// Also export individual configs for direct access
export { sceneConfig } from './scene.js';
export { objectsConfig } from './objects.js';
export { effectsConfig } from './effects.js';
export { contentConfig } from './content.js';
export { uiConfig } from './ui.js';
export { themesConfig } from './themes.js';
