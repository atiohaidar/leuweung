/**
 * Configuration constants for the 3D Forest Scene
 * @module config
 */

export const CONFIG = {
    // Scene settings
    scene: {
        fogColor: 0x0a1a0f,
        fogDensity: 0.015,
        clearColor: 0x0a1a0f
    },

    // Camera settings
    camera: {
        fov: 60,
        near: 0.1,
        far: 1000,
        initialPosition: { x: 0, y: 2, z: 10 },
        maxScrollZ: 180,
        swayAmount: 0.5,
        swaySpeed: 0.3
    },

    // Lighting settings
    lighting: {
        ambient: {
            color: 0x2a4a2f,
            intensity: 0.5
        },
        sun: {
            color: 0xa8e6cf,
            intensity: 0.8,
            position: { x: 10, y: 30, z: 10 }
        },
        glowLights: [
            { color: 0x88d8b0, intensity: 1, distance: 20, position: { x: -5, y: 3, z: -10 } },
            { color: 0x56ab91, intensity: 0.8, distance: 15, position: { x: 8, y: 2, z: -25 } }
        ]
    },

    // Ground settings
    ground: {
        width: 200,
        height: 400,
        segments: 50,
        color: 0x1a3a1f,
        roughness: 0.9,
        metalness: 0.1,
        terrainVariation: 0.3
    },

    // Tree settings
    trees: {
        count: 150,
        spread: 50,
        pathWidth: 6,
        depthRange: 200,
        minScale: 0.5,
        maxScaleVariation: 1,
        swayAmount: 0.02,
        swaySpeed: 0.5,
        trunk: {
            radiusTop: 0.2,
            radiusBottom: 0.4,
            height: 3,
            segments: 8,
            color: 0x4a3728
        },
        foliage: {
            layers: 4,
            colors: [0x2d5a3a, 0x3d6a4a, 0x4d7a5a, 0x1d4a2a],
            baseRadius: 2,
            baseHeight: 2.5,
            radiusDecrement: 0.3,
            heightDecrement: 0.3,
            yOffset: 3,
            yIncrement: 1.2
        }
    },

    // Firefly settings
    fireflies: {
        count: 100,
        radius: 0.05,
        color: 0xffff88,
        spreadX: 40,
        minY: 1,
        maxY: 8,
        depthRange: 150,
        minSpeed: 0.01,
        maxSpeed: 0.02,
        minAmplitude: 0.3,
        maxAmplitude: 0.5,
        pulseSpeed: 3,
        minOpacity: 0.3,
        maxOpacity: 0.4
    },

    // Particle settings
    particles: {
        count: 500,
        spreadX: 60,
        maxY: 15,
        depthRange: 200,
        size: 0.1,
        color: 0xa8e6cf,
        opacity: 0.6,
        riseSpeed: 0.01,
        swayAmount: 0.002
    },

    // Animation settings
    animation: {
        loadingDelay: 1500
    }
};
