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
    },

    // 3D Labels configuration (content separated from logic)
    labels3D: [
        {
            id: 'hero',
            title: '🌲 Hayu Ka Leuweung',
            description: 'Duka di leuweung aya naon wae, hayu atuh meh teu panasaran',
            position3D: { x: 5, y: 4, z: 0 },
            visibleRange: { min: 0, max: 0.15 },
            side: 'right'
        },
        {
            id: 'giantTree',
            title: '🌳 Pohon Raksasa',
            description: 'Pohon berusia ratusan tahun yang menjulang tinggi ke langit',
            position3D: { x: -8, y: 12, z: -50 },
            visibleRange: { min: 0.15, max: 0.30 },
            side: 'right'
        },
        {
            id: 'wildlife',
            title: '🦋 Kehidupan Liar',
            description: 'Beragam satwa liar hidup harmonis di ekosistem hutan',
            position3D: { x: 22, y: 3, z: -80 },
            visibleRange: { min: 0.30, max: 0.45 },
            side: 'right'
        },
        {
            id: 'river',
            title: '💧 Sungai Jernih',
            description: 'Aliran sungai yang mengalir jernih di antara pepohonan',
            position3D: { x: 8, y: 2, z: -120 },
            visibleRange: { min: 0.45, max: 0.55 },
            side: 'right'
        },
        {
            id: 'deforestation',
            title: '⚠️ Ancaman Nyata',
            description: 'Jutaan hektar hutan hilang setiap tahun akibat penebangan liar',
            position3D: { x: 22, y: 5, z: -115 },
            visibleRange: { min: 0.55, max: 0.75 },
            side: 'right',
            theme: 'warning'
        },
        {
            id: 'earth',
            title: '🌍 Lindungi Bumi Kita',
            description: 'Bergabunglah dalam gerakan pelestarian hutan',
            position3D: { x: 0, y: -50, z: -150 },
            visibleRange: { min: 0.80, max: 1.0 },
            side: 'center',
            theme: 'cta'
        }
    ],

    // 3D Section Titles configuration (fly-through text)
    sectionTitles3D: {
        params: {
            visibilityDistance: 25,
            fadeInDistance: 18,
            flyThroughZone: 4,
            scaleMultiplier: 2.0
        },
        sections: [
            {
                id: 'giantTree',
                title: 'POHON',
                subtitle: 'RAKSASA',
                position: { x: 0, y: 2, z: -24 },
                color: 0x4ade80,
                emissive: 0x22c55e
            },
            {
                id: 'wildlife',
                title: 'KEHIDUPAN',
                subtitle: 'LIAR',
                position: { x: 0, y: 3, z: -58 },
                color: 0x60a5fa,
                emissive: 0x3b82f6
            },
            {
                id: 'river',
                title: 'SUNGAI',
                subtitle: 'JERNIH',
                position: { x: 0, y: 2, z: -92 },
                color: 0x22d3ee,
                emissive: 0x06b6d4
            },
            {
                id: 'deforestation',
                title: 'ANCAMAN',
                subtitle: 'NYATA',
                position: { x: 15, y: 5, z: -115 },  // Above the loggers area
                color: 0xfb923c,
                emissive: 0xf97316,
                faceCamera: true
            },
            {
                id: 'earth',
                title: 'LINDUNGI',
                subtitle: 'BUMI KITA',
                position: { x: 0, y: 25, z: -130 },
                color: 0xa78bfa,
                emissive: 0x8b5cf6,
                isVertical: true,
                faceCamera: true,
                cinematic: true  // Enable vignette for this section
            },
            {
                id: 'finale',
                title: 'JAGALAH',
                subtitle: 'BUMI',
                position: { x: 0, y: 150, z: -140 },  // Visible when camera rises high
                color: 0x4ade80,
                emissive: 0x22c55e,
                isVertical: true,
                faceCamera: true,
                cinematic: true
            },
            {
                id: 'credits',
                title: 'YU KA LEUENG',
                subtitle: 'Bikinnya make Three.js',
                position: { x: 0, y: 250, z: -145 },  // At the very end
                color: 0xffffff,
                emissive: 0xaaaaaa,
                isVertical: true,
                faceCamera: true,
                cinematic: true
            }
        ]
    },

    // Points of Interest configuration
    pointsOfInterest: {
        giantTree: {
            position: { x: -15, y: 0, z: -50 },
            cameraPosition: { x: -8, y: 5, z: -40 },
            lookAt: { x: -15, y: 10, z: -50 }
        },
        wildlife: {
            position: { x: 15, y: 0, z: -80 },
            cameraPosition: { x: 15, y: 3, z: -70 },
            lookAt: { x: 15, y: 1.5, z: -80 }
        },
        river: {
            position: { x: 0, y: 0, z: -120 },
            cameraPosition: { x: 5, y: 2, z: -110 },
            lookAt: { x: 0, y: 0, z: -130 }
        }
    },

    // UI Controls configuration
    ui: {
        controls: [
            { id: 'magic', label: '✨ Magic Particles', defaultActive: true },
            { id: 'birds', label: '🐦 Burung Terbang', defaultActive: true },
            { id: 'flashlight', label: '🔦 Mode Senter', defaultActive: false },
            { id: 'photo', label: '📸 Ambil Foto', type: 'action', icon: '📷' },
            { id: 'season', label: '🍂 Musim', type: 'cycle', defaultValue: 'SUMMER' }
        ]
    },

    // Effects settings
    effects: {
        mouseParallax: {
            sensitivity: 0.0005,
            smoothing: 0.05
        },
        magicParticles: {
            maxParticles: 50,
            colors: [0xffff88, 0x88ffff, 0xff88ff, 0x88ff88, 0xffffff]
        },
        flyingBirds: {
            count: 5,
            speed: 0.02
        }
    }
};
