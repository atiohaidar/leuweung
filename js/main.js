/**
 * Main Entry Point - Initializes and orchestrates the 3D Forest Scene
 * Refactored for better maintainability with separated concerns
 * @module main
 */

import { CONFIG } from './config.js';
import { SceneManager } from './scene/SceneManager.js';
import { Lighting } from './scene/Lighting.js';
import { CameraController } from './scene/CameraController.js';
import { Ground } from './objects/Ground.js';
import { Trees } from './objects/Trees.js';
import { Fireflies } from './objects/Fireflies.js';
import { Particles } from './objects/Particles.js';
import { PointsOfInterest } from './objects/PointsOfInterest.js';
import { Earth } from './objects/Earth.js';
import { Deforestation } from './objects/Deforestation.js';
import { Wildlife } from './objects/Wildlife.js';
import { AnimationManager } from './animation/AnimationManager.js';
import { UIManager } from './ui/UIManager.js';

// Effects
import { MouseParallax } from './effects/MouseParallax.js';
import { MagicParticles } from './effects/MagicParticles.js';
import { FlyingBirds } from './effects/FlyingBirds.js';
import { FlashlightMode } from './effects/FlashlightMode.js';
import { PhotoMode } from './effects/PhotoMode.js';
import { SeasonalThemes } from './effects/SeasonalThemes.js';
import { AnimalInteraction } from './effects/AnimalInteraction.js';
import { AutoScroll } from './effects/AutoScroll.js';
import { Labels3D } from './effects/Labels3D.js';
import { SectionTitles3D } from './effects/SectionTitles3D.js';
import { JumpingFish } from './effects/JumpingFish.js';

/**
 * Main application class for the Forest Experience
 * Orchestrates scene setup, effects, and UI interactions
 */
class ForestExperience {
    constructor() {
        // Core components
        this.sceneManager = null;
        this.lighting = null;
        this.cameraController = null;
        this.animationManager = null;
        this.uiManager = null;

        // Scene objects
        this.sceneObjects = {
            ground: null,
            trees: null,
            fireflies: null,
            particles: null,
            pointsOfInterest: null,
            earth: null,
            deforestation: null
        };

        // Effects collection
        this.effects = {
            mouseParallax: null,
            magicParticles: null,
            flyingBirds: null,
            flashlightMode: null,
            photoMode: null,
            seasonalThemes: null,
            animalInteraction: null,
            autoScroll: null,
            labels3D: null,
            sectionTitles3D: null
        };

        this.init();
    }

    /**
     * Initialize the entire experience
     */
    init() {
        this.initScene();
        this.initSceneObjects();
        this.initEffects();
        this.initAnimation();
        this.initUI();
        this.setupInteractions();
        this.start();
    }

    /**
     * Initialize core scene components
     */
    initScene() {
        this.sceneManager = new SceneManager('forest-canvas');
        this.cameraController = new CameraController(this.sceneManager);
        this.lighting = new Lighting(this.sceneManager);
    }

    /**
     * Initialize all 3D scene objects
     */
    initSceneObjects() {
        const sm = this.sceneManager;

        this.sceneObjects.ground = new Ground(sm);
        this.sceneObjects.trees = new Trees(sm);
        this.sceneObjects.fireflies = new Fireflies(sm);
        this.sceneObjects.particles = new Particles(sm);
        this.sceneObjects.pointsOfInterest = new PointsOfInterest(sm);
        this.sceneObjects.earth = new Earth(sm);
        this.sceneObjects.deforestation = new Deforestation(sm);
        this.sceneObjects.wildlife = new Wildlife(sm);
    }

    /**
     * Initialize all visual effects
     */
    initEffects() {
        const sm = this.sceneManager;

        this.effects.mouseParallax = new MouseParallax(sm);
        this.effects.magicParticles = new MagicParticles(sm);
        this.effects.flyingBirds = new FlyingBirds(sm);
        this.effects.flashlightMode = new FlashlightMode(sm);
        this.effects.photoMode = new PhotoMode(sm);
        this.effects.seasonalThemes = new SeasonalThemes(
            sm,
            this.sceneObjects.trees,
            this.sceneObjects.ground
        );
        this.effects.animalInteraction = new AnimalInteraction(
            sm,
            this.sceneObjects.pointsOfInterest
        );
        this.effects.autoScroll = new AutoScroll();
        // this.effects.labels3D = new Labels3D(sm); // Uncomment to enable
        this.effects.sectionTitles3D = new SectionTitles3D(sm);
        this.effects.jumpingFish = new JumpingFish(sm);
    }

    /**
     * Initialize animation manager and register all updatables
     */
    initAnimation() {
        this.animationManager = new AnimationManager(this.sceneManager);
        this.animationManager.setCameraController(this.cameraController);

        // Register scene objects
        this.registerUpdatable(this.sceneObjects.trees, 'Trees');
        this.registerUpdatable(this.sceneObjects.fireflies, 'Fireflies');
        this.registerUpdatable(this.sceneObjects.particles, 'Particles');
        this.registerUpdatable(this.sceneObjects.earth, 'Earth');
        this.registerUpdatable(this.sceneObjects.deforestation, 'Deforestation');
        this.registerUpdatable(this.sceneObjects.wildlife, 'Wildlife');

        // Register effects
        this.registerUpdatable(this.effects.mouseParallax, 'MouseParallax');
        this.registerUpdatable(this.effects.magicParticles, 'MagicParticles');
        this.registerUpdatable(this.effects.flyingBirds, 'FlyingBirds');
        this.registerUpdatable(this.effects.flashlightMode, 'FlashlightMode');
        this.registerUpdatable(this.effects.sectionTitles3D, 'SectionTitles3D');
        this.registerUpdatable(this.effects.jumpingFish, 'JumpingFish');
        this.registerUpdatable(this.effects.labels3D, 'Labels3D');

        // Register special handlers
        this.animationManager.registerHandler('butterflies', (time) => {
            this.updateButterflies(time);
        });
    }

    /**
     * Helper to safely register an updatable object
     */
    registerUpdatable(obj, name) {
        if (obj) {
            this.animationManager.register(obj, name);
        }
    }

    /**
     * Initialize UI Manager
     */
    initUI() {
        this.uiManager = new UIManager(this.effects);

        // Setup back button handler
        this.uiManager.onBackButtonClick(() => {
            this.cameraController.zoomOut();
            this.uiManager.hideBackButton();
            this.uiManager.clearActiveCards();
        });
    }

    /**
     * Setup feature card interactions
     */
    setupInteractions() {
        const featureCards = document.querySelectorAll('.feature-card');
        const poiMapping = ['giantTree', 'wildlife', 'river'];

        featureCards.forEach((card, index) => {
            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                const poiName = poiMapping[index];
                if (poiName) {
                    const poi = this.sceneObjects.pointsOfInterest.getPoint(poiName);
                    if (poi) {
                        this.cameraController.zoomTo(poi, poiName);
                        this.uiManager.setActiveCard(card);
                        this.uiManager.showBackButton();
                    }
                }
            });
        });
    }

    /**
     * Animate butterflies in wildlife area
     */
    updateButterflies(time) {
        const poi = this.sceneObjects.pointsOfInterest;
        if (poi?.points?.wildlife) {
            const wildlifeGroup = poi.points.wildlife.object;
            wildlifeGroup.children.forEach(child => {
                if (child.userData?.phase !== undefined) {
                    const data = child.userData;
                    child.position.y += Math.sin(time * data.speed * 5 + data.phase) * 0.02;
                    child.position.x += Math.sin(time * data.speed * 3 + data.phase) * 0.01;
                    child.rotation.y = Math.sin(time * data.speed * 8) * 0.3;
                }
            });
        }
    }

    /**
     * Start the experience
     */
    start() {
        // Hide loading screen
        this.uiManager.hideLoading(CONFIG.animation.loadingDelay).then(() => {
            // Show hero screen if exists
            this.uiManager.showHeroScreen();
            this.uiManager.setupHeroScreen();
        });

        // Start animation loop
        this.animationManager.start();
    }

    /**
     * Get access to scene objects (for external use)
     */
    getSceneObjects() {
        return this.sceneObjects;
    }

    /**
     * Get access to effects (for external use)
     */
    getEffects() {
        return this.effects;
    }

    /**
     * Enable/disable an effect by name
     */
    setEffectEnabled(effectName, enabled) {
        const effect = this.effects[effectName];
        if (effect && typeof effect.setEnabled === 'function') {
            effect.setEnabled(enabled);
        }
        this.animationManager.setEnabled(effectName, enabled);
    }
}

// Initialize the experience when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.forestExperience = new ForestExperience();
});
