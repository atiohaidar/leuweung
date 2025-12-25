/**
 * Main Entry Point - Initializes and orchestrates the 3D Forest Scene
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
import { AnimationManager } from './animation/AnimationManager.js';

// Effects
import { MouseParallax } from './effects/MouseParallax.js';
import { MagicParticles } from './effects/MagicParticles.js';
import { FlyingBirds } from './effects/FlyingBirds.js';
import { FlashlightMode } from './effects/FlashlightMode.js';
import { PhotoMode } from './effects/PhotoMode.js';
import { SeasonalThemes } from './effects/SeasonalThemes.js';
import { AnimalInteraction } from './effects/AnimalInteraction.js';

class ForestExperience {
    constructor() {
        this.sceneManager = null;
        this.lighting = null;
        this.cameraController = null;
        this.ground = null;
        this.trees = null;
        this.fireflies = null;
        this.particles = null;
        this.pointsOfInterest = null;
        this.earth = null;
        this.deforestation = null;
        this.animationManager = null;

        // Effects
        this.mouseParallax = null;
        this.magicParticles = null;
        this.flyingBirds = null;
        this.flashlightMode = null;
        this.photoMode = null;
        this.seasonalThemes = null;
        this.animalInteraction = null;

        this.init();
    }

    init() {
        // Initialize Scene Manager
        this.sceneManager = new SceneManager('forest-canvas');

        // Setup Camera Controller
        this.cameraController = new CameraController(this.sceneManager);

        // Setup Lighting
        this.lighting = new Lighting(this.sceneManager);

        // Create Forest Elements
        this.ground = new Ground(this.sceneManager);
        this.trees = new Trees(this.sceneManager);
        this.fireflies = new Fireflies(this.sceneManager);
        this.particles = new Particles(this.sceneManager);

        // Create Points of Interest
        this.pointsOfInterest = new PointsOfInterest(this.sceneManager);

        // Create Earth for final zoom out
        this.earth = new Earth(this.sceneManager);

        // Create Deforestation scene
        this.deforestation = new Deforestation(this.sceneManager);

        // Initialize Effects
        this.initEffects();

        // Setup Animation Manager
        this.animationManager = new AnimationManager(this.sceneManager, {
            trees: this.trees,
            fireflies: this.fireflies,
            particles: this.particles,
            pointsOfInterest: this.pointsOfInterest,
            earth: this.earth,
            deforestation: this.deforestation,
            // New effects
            mouseParallax: this.mouseParallax,
            magicParticles: this.magicParticles,
            flyingBirds: this.flyingBirds,
            flashlightMode: this.flashlightMode
        });

        // Set camera controller in animation manager
        this.animationManager.setCameraController(this.cameraController);

        // Setup feature card click handlers
        this.setupFeatureCardInteraction();

        // Create controls panel
        this.createControlsPanel();

        // Hide loading screen after delay
        this.hideLoadingScreen();

        // Start animation loop
        this.animationManager.start();
    }

    initEffects() {
        // Mouse Parallax
        this.mouseParallax = new MouseParallax(this.sceneManager);

        // Magic cursor particles
        this.magicParticles = new MagicParticles(this.sceneManager);

        // Flying birds
        this.flyingBirds = new FlyingBirds(this.sceneManager);

        // Flashlight mode
        this.flashlightMode = new FlashlightMode(this.sceneManager);

        // Photo mode
        this.photoMode = new PhotoMode(this.sceneManager);

        // Seasonal themes
        this.seasonalThemes = new SeasonalThemes(
            this.sceneManager,
            this.trees,
            this.ground
        );

        // Animal interaction
        this.animalInteraction = new AnimalInteraction(
            this.sceneManager,
            this.pointsOfInterest
        );
    }

    createControlsPanel() {
        const panel = document.createElement('div');
        panel.className = 'controls-panel';
        panel.innerHTML = `
            <div class="controls-toggle" title="Toggle Controls">⚙️</div>
            <div class="controls-content">
                <h3>🎮 Kontrol</h3>
                
                <div class="control-group">
                    <label>✨ Magic Particles</label>
                    <button class="control-btn active" data-control="magic">ON</button>
                </div>
                
                <div class="control-group">
                    <label>🐦 Burung Terbang</label>
                    <button class="control-btn active" data-control="birds">ON</button>
                </div>
                
                <div class="control-group">
                    <label>🔦 Mode Senter</label>
                    <button class="control-btn" data-control="flashlight">OFF</button>
                </div>
                
                <div class="control-group">
                    <label>📸 Ambil Foto</label>
                    <button class="control-btn photo-btn" data-control="photo">📷</button>
                </div>
                
                <div class="control-group">
                    <label>🍂 Musim</label>
                    <button class="control-btn season-btn" data-control="season">SUMMER</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Toggle panel
        const toggle = panel.querySelector('.controls-toggle');
        toggle.addEventListener('click', () => {
            panel.classList.toggle('open');
        });

        // Control buttons
        this.setupControlButtons(panel);
    }

    setupControlButtons(panel) {
        // Magic particles toggle
        panel.querySelector('[data-control="magic"]').addEventListener('click', (e) => {
            const btn = e.target;
            const isActive = btn.classList.toggle('active');
            btn.textContent = isActive ? 'ON' : 'OFF';
            this.magicParticles.setEnabled(isActive);
        });

        // Birds toggle
        panel.querySelector('[data-control="birds"]').addEventListener('click', (e) => {
            const btn = e.target;
            const isActive = btn.classList.toggle('active');
            btn.textContent = isActive ? 'ON' : 'OFF';
            this.flyingBirds.setEnabled(isActive);
        });

        // Flashlight toggle
        panel.querySelector('[data-control="flashlight"]').addEventListener('click', (e) => {
            const btn = e.target;
            const isActive = this.flashlightMode.toggle();
            btn.classList.toggle('active', isActive);
            btn.textContent = isActive ? 'ON' : 'OFF';
        });

        // Photo capture
        panel.querySelector('[data-control="photo"]').addEventListener('click', () => {
            this.photoMode.capture();
        });

        // Season change
        panel.querySelector('[data-control="season"]').addEventListener('click', (e) => {
            const newSeason = this.seasonalThemes.nextSeason();
            e.target.textContent = newSeason.toUpperCase();
        });
    }

    setupFeatureCardInteraction() {
        const featureCards = document.querySelectorAll('.feature-card');

        featureCards.forEach((card, index) => {
            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                let poiName;
                switch (index) {
                    case 0:
                        poiName = 'giantTree';
                        break;
                    case 1:
                        poiName = 'wildlife';
                        break;
                    case 2:
                        poiName = 'river';
                        break;
                }

                if (poiName) {
                    const poi = this.pointsOfInterest.getPoint(poiName);
                    if (poi) {
                        this.cameraController.zoomTo(poi, poiName);
                        this.updateCardActiveState(card, poiName);
                    }
                }
            });
        });

        // Add back button for zooming out
        this.createBackButton();
    }

    createBackButton() {
        const backButton = document.createElement('button');
        backButton.id = 'back-button';
        backButton.innerHTML = '← Kembali';

        backButton.addEventListener('click', () => {
            this.cameraController.zoomOut();
            this.hideBackButton();
            this.clearCardActiveStates();
        });

        document.body.appendChild(backButton);
    }

    showBackButton() {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.classList.add('visible');
        }
    }

    hideBackButton() {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.classList.remove('visible');
        }
    }

    updateCardActiveState(activeCard, poiName) {
        // Clear previous active states
        this.clearCardActiveStates();

        // Add active state to clicked card
        activeCard.classList.add('active');
        activeCard.style.borderColor = '#a8e6cf';
        activeCard.style.boxShadow = '0 0 30px rgba(168, 230, 207, 0.5)';

        // Show back button
        this.showBackButton();
    }

    clearCardActiveStates() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.classList.remove('active');
            card.style.borderColor = '';
            card.style.boxShadow = '';
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, CONFIG.animation.loadingDelay);
    }
}

// Initialize the experience when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ForestExperience();
});
