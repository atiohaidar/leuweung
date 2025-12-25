/**
 * Main Entry Point - Initializes and orchestrates the 3D Forest Scene
 * Refactored for better maintainability (v2.0)
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
import { AnimationManager } from './animation/AnimationManager.js';
import { UIManager } from './ui/UIManager.js';

// Setup Modules
import { ClickableRegistry } from './setup/ClickableRegistry.js';
import { LazyLoadingSetup } from './setup/LazyLoadingSetup.js';

// Utilities
import { Logger } from './utils/Logger.js';
import { LazyLoader } from './utils/LazyLoader.js';
import { getDeviceCapabilities } from './utils/DeviceCapabilities.js';
import { getFPSDisplay } from './utils/FPSDisplay.js';

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
import { ObjectInteraction } from './effects/ObjectInteraction.js';
import { TouchControls } from './effects/TouchControls.js';


/**
 * Main application class for the Forest Experience
 * Orchestrates scene setup, effects, and UI interactions
 */
class ForestExperience {
    constructor() {
        // Device capabilities detection
        this.deviceCapabilities = getDeviceCapabilities();
        this.deviceCapabilities.logInfo();

        // Core components
        this.sceneManager = null;
        this.lighting = null;
        this.cameraController = null;
        this.animationManager = null;
        this.uiManager = null;
        this.lazyLoader = null;

        // Setup helpers
        this.clickableRegistry = null;
        this.lazyLoadingSetup = null;

        // Scene objects
        this.sceneObjects = {
            ground: null,
            trees: null,
            fireflies: null,
            particles: null,
            pointsOfInterest: null,
            earth: null,
            deforestation: null,
            wildlife: null
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
            sectionTitles3D: null,
            objectInteraction: null,
            touchControls: null
        };

        this.init();
    }

    /**
     * Initialize the entire experience
     */
    init() {
        this.initScene();

        // Initialize loaders
        this.lazyLoader = new LazyLoader(this.sceneManager);
        this.lazyLoadingSetup = new LazyLoadingSetup(this); // Pass context
        this.lazyLoadingSetup.init(); // Register deferred objects

        this.initSceneObjects();
        this.initEffects();
        this.initAnimation();
        this.initUI();
        this.initPerformanceMonitor();
        this.setupInteractions();

        // Final clickables registration
        this.clickableRegistry = new ClickableRegistry(this);
        this.clickableRegistry.init();

        this.start();
    }

    /**
     * Initialize performance monitoring tools
     */
    initPerformanceMonitor() {
        // Initialize FPS display (toggle with ` key)
        this.fpsDisplay = getFPSDisplay();
        Logger.info('System', 'FPS Display ready (press ` or F3 to show)');
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
     * Heavy objects are deferred to lazy loading
     */
    initSceneObjects() {
        const sm = this.sceneManager;

        // Essential objects - load immediately
        this.sceneObjects.ground = new Ground(sm);
        this.sceneObjects.trees = new Trees(sm);
        this.sceneObjects.fireflies = new Fireflies(sm);
        this.sceneObjects.particles = new Particles(sm);
        this.sceneObjects.pointsOfInterest = new PointsOfInterest(sm);
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
        this.effects.labels3D = new Labels3D(sm);
        this.effects.sectionTitles3D = new SectionTitles3D(sm);
        this.effects.jumpingFish = new JumpingFish(sm);

        // Touch controls for mobile devices
        if (this.deviceCapabilities.isTouchDevice) {
            this.effects.touchControls = new TouchControls(sm);
            Logger.info('System', 'TouchControls enabled for touch device');
        }

        // Object interaction - must be after labels3D
        this.effects.objectInteraction = new ObjectInteraction(
            sm,
            this.cameraController,
            this.effects.labels3D,
            this.effects.mouseParallax
        );
    }

    /**
     * Initialize animation manager and register all updatables
     */
    initAnimation() {
        this.animationManager = new AnimationManager(this.sceneManager);
        this.animationManager.setCameraController(this.cameraController);

        // Register immediately-loaded scene objects
        this.registerUpdatable(this.sceneObjects.trees, 'Trees');
        this.registerUpdatable(this.sceneObjects.fireflies, 'Fireflies');
        this.registerUpdatable(this.sceneObjects.particles, 'Particles');

        // Register effects
        this.registerUpdatable(this.effects.mouseParallax, 'MouseParallax');
        this.registerUpdatable(this.effects.magicParticles, 'MagicParticles');
        this.registerUpdatable(this.effects.flyingBirds, 'FlyingBirds');
        this.registerUpdatable(this.effects.flashlightMode, 'FlashlightMode');
        this.registerUpdatable(this.effects.sectionTitles3D, 'SectionTitles3D');
        this.registerUpdatable(this.effects.jumpingFish, 'JumpingFish');
        this.registerUpdatable(this.effects.labels3D, 'Labels3D');
        this.registerUpdatable(this.effects.touchControls, 'TouchControls');

        // Add lazy loader update to animation loop
        this.animationManager.registerHandler('lazyLoader', () => {
            const progress = this.sceneManager.getScrollProgress();
            this.lazyLoader.update(progress);
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
