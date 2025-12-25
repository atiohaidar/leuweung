/**
 * Themes Configuration - Seasonal themes and visual variations
 * @module config/themes
 */

export const themesConfig = {
    // Transition settings
    transitionDuration: 2000,

    // Season definitions
    seasons: {
        spring: {
            fogColor: 0x1a3a1f,
            clearColor: 0x87ceeb,
            fogDensity: 0.01,
            groundColor: 0x2d5a2d,
            foliageColors: [0x90EE90, 0x98FB98, 0x00FA9A, 0x3CB371],
            particleColor: 0xFFB7C5,
            ambientIntensity: 0.6
        },
        summer: {
            fogColor: 0x0a1a0f,
            clearColor: 0x0a1a0f,
            fogDensity: 0.015,
            groundColor: 0x1a3a1f,
            foliageColors: [0x2d5a3a, 0x3d6a4a, 0x4d7a5a, 0x1d4a2a],
            particleColor: 0xa8e6cf,
            ambientIntensity: 0.5
        },
        autumn: {
            fogColor: 0x2a1a0a,
            clearColor: 0x1a1005,
            fogDensity: 0.012,
            groundColor: 0x5a4a2a,
            foliageColors: [0xFF6347, 0xFFA500, 0xFFD700, 0xDC143C],
            particleColor: 0xFFA500,
            ambientIntensity: 0.4
        },
        winter: {
            fogColor: 0xd0e0f0,
            clearColor: 0x1a2a3a,
            fogDensity: 0.008,
            groundColor: 0xe8e8e8,
            foliageColors: [0x2d4a3a, 0x3d5a4a, 0x1d3a2a, 0x4d5a4a],
            particleColor: 0xffffff,
            ambientIntensity: 0.7
        }
    }
};
