/**
 * Effects Configuration - All visual effects settings
 * @module config/effects
 */

export const effectsConfig = {
    // Mouse parallax
    mouseParallax: {
        sensitivity: 0.0005,
        smoothing: 0.05
    },

    // Magic particles
    magicParticles: {
        enabled: true, // Default on primarily for demo
        maxParticles: 50,
        colors: [0xffff88, 0x88ffff, 0xff88ff, 0x88ff88, 0xffffff],
        spawnDistance: { min: 5, max: 8 }
    },

    // Flying birds
    flyingBirds: {
        flockCount: 3,
        birdsPerFlock: { min: 5, max: 12 },
        speed: { min: 0.3, max: 0.6 },
        startZ: 50,
        endZ: -250,
        height: { min: 2, max: 8 },
        spread: 20
    },

    // Jumping fish
    jumpingFish: {
        position: { x: 0, z: -92 },
        count: 5,
        jumpHeight: { min: 0.8, max: 1.3 },
        jumpSpeed: { min: 0.8, max: 1.3 }
    },

    // Flashlight mode
    flashlight: {
        color: 0xffffee,
        intensity: 3,
        distance: 30,
        angle: Math.PI / 6,
        penumbra: 0.5,
        decay: 1
    },

    // Auto scroll
    autoScroll: {
        fastSpeed: 2.2,
        slowSpeed: 2,
        scrollThreshold: 0.45,
        reverseSpeedMultiplier: 3,
        resumeDelay: 2000,
        bottomThreshold: 50,
        labels: {
            scrollDown: 'Auto Scroll',
            scrollUp: 'Scroll Up',
            scrolling: 'Scrolling...',
            reversing: 'Reversing...',
            resume: 'Resume',
            paused: 'Paused'
        },
        icons: {
            down: '▼',
            up: '▲',
            pause: '⏸',
            play: '▶'
        },
        pauseEvents: ['wheel', 'touchmove', 'touchstart', 'mousedown', 'keydown'],
        pauseKeys: ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End']
    },

    // Section titles 3D animation
    sectionTitles3D: {
        visibilityDistance: 25,
        fadeInDistance: 18,
        flyThroughZone: 4,
        scaleMultiplier: 2.0,
        letterAnimation: {
            scatterDistance: { x: 20, y: 20, z: 15 },
            height: 0.5
        }
    },

    // Camera controller
    cameraController: {
        zoomDuration: 2000,
        blendBackDuration: 1500
    },

    // Animal interaction popup
    animalInteraction: {
        popupWidth: 300,
        popupHeight: 200,
        animationDuration: 500
    }
};
