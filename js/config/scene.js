/**
 * Scene Configuration - Scene, camera, lighting, ground settings
 * @module config/scene
 */

export const sceneConfig = {
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
        swaySpeed: 0.3,
        // Scroll smoothing (0.01 = very smooth/cinematic, 0.2 = responsive)
        scrollSmoothness: 0.08,
        // Camera phases for scroll
        phases: {
            forest: { end: 0.55 },
            deforestation: { start: 0.55, end: 0.75 },
            earth: { start: 0.75 }
        },
        // Earth zoom out positions
        earthZoom: {
            startY: 10,
            startX: 5,
            endY: 300,
            endZ: -140,
            endX: 0
        }
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
    }
};
