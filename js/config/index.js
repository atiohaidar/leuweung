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

    // Clickable objects for ObjectInteraction
    clickableObjects: objectsConfig.clickableObjects,

    // Animal interaction info
    animalInteraction: contentConfig.animalInfo,

    // Seasonal themes
    seasonalThemes: themesConfig,

    // Lazy loading configuration
    lazyLoading: {
        enabled: true,
        preloadDistance: 0.1, // Load 10% before visibility
        objects: {
            wildlife: { loadAt: 0.20 },
            deforestation: { loadAt: 0.40 },
            earth: { loadAt: 0.65 }
        }
    },

    // Mobile/touch configuration
    mobile: {
        particleReduction: 0.4,  // 40% of desktop particles
        renderScale: 0.75,       // Lower resolution for performance
        touchSensitivity: 1.5,
        enableTouchControls: true,
        minFOV: 30,
        maxFOV: 90
    },

    // Performance monitoring configuration
    performance: {
        targetFPS: 55,           // Target FPS to maintain
        criticalFPS: 30,         // FPS threshold for aggressive quality reduction
        checkInterval: 2000,     // How often to check FPS (ms)
        qualityChangeDelay: 3000, // Minimum time between quality changes (ms)
        minQuality: 0.3,         // Minimum quality level (30%)
        enableAdaptive: true     // Enable adaptive quality system
    }
};

// Also export individual configs for direct access
export { sceneConfig } from './scene.js';
export { objectsConfig } from './objects.js';
export { effectsConfig } from './effects.js';
export { contentConfig } from './content.js';
export { uiConfig } from './ui.js';
export { themesConfig } from './themes.js';
