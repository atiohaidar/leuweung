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
                description: 'Saksi bisu sejarah yang berdiri kokoh selama ratusan tahun',
                position: { x: 0, y: 2, z: -24 },
                color: 0x4ade80,
                emissive: 0x22c55e
            },
            {
                id: 'wildlife',
                title: 'KEHIDUPAN',
                subtitle: 'LIAR',
                description: 'Harmoni alam dimana flora dan fauna hidup berdampingan',
                position: { x: 0, y: 3, z: -58 },
                color: 0x60a5fa,
                emissive: 0x3b82f6
            },
            {
                id: 'river',
                title: 'SUNGAI',
                subtitle: 'JERNIH',
                description: 'Sumber kehidupan yang mengalirkan kesegaran ke seluruh hutan',
                position: { x: 0, y: 2, z: -92 },
                color: 0x22d3ee,
                emissive: 0x06b6d4
            },
            {
                id: 'deforestation',
                title: 'ANCAMAN',
                subtitle: 'NYATA',
                description: 'Keserakahan manusia yang mengancam kelestarian paru-paru dunia',
                position: { x: 15, y: 5, z: -115 },  // Above the loggers area
                color: 0xfb923c,
                emissive: 0xf97316,
                faceCamera: true
            },
            {
                id: 'earth',
                title: 'LINDUNGI',
                subtitle: 'BUMI KITA',
                description: 'Satu langkah kecil kita hari ini, nafas panjang bumi di masa depan',
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
                description: 'Karena bumi bukan warisan nenek moyang, tapi titipan anak cucu',
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
                description: 'Dipersembahkan dengan cinta untuk alam Indonesia',
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
            flockCount: 3,
            birdsPerFlock: { min: 5, max: 12 },
            speed: { min: 0.3, max: 0.6 },
            startZ: 50,
            endZ: -250,
            height: { min: 2, max: 8 },
            spread: 20
        },
        jumpingFish: {
            position: { x: 0, z: -92 },
            count: 5,
            jumpHeight: { min: 0.8, max: 1.3 },
            jumpSpeed: { min: 0.8, max: 1.3 }
        },
        flashlight: {
            color: 0xffffee,
            intensity: 3,
            distance: 30,
            angle: Math.PI / 6,
            penumbra: 0.5,
            decay: 1
        },
        autoScroll: {
            fastSpeed: 1.5,
            slowSpeed: 0.5,
            scrollThreshold: 0.45 // Percentage where it slows down
        }
    },

    // Animal Interaction Info
    animalInteraction: {
        deer: {
            name: '🦌 Rusa Hutan',
            description: 'Rusa adalah mamalia herbivora yang hidup berkelompok. Mereka memiliki peran penting dalam menjaga keseimbangan ekosistem hutan.',
            fact: 'Tahukah kamu? Tanduk rusa jantan bisa tumbuh hingga 1 cm per hari!'
        },
        butterfly: {
            name: '🦋 Kupu-kupu',
            description: 'Kupu-kupu adalah serangga penyerbuk yang penting untuk reproduksi tanaman berbunga.',
            fact: 'Kupu-kupu bisa melihat warna ultraviolet yang tidak terlihat oleh mata manusia.'
        },
        firefly: {
            name: '✨ Kunang-kunang',
            description: 'Kunang-kunang menghasilkan cahaya melalui proses bioluminesensi di perut mereka.',
            fact: 'Kunang-kunang menggunakan pola cahaya unik untuk berkomunikasi dan mencari pasangan.'
        }
    },

    // Wildlife settings
    wildlife: {
        position: { x: 0, z: -58 },
        animals: {
            deer: { count: 2, spread: 10 },
            rabbit: { count: 4, spread: 15 },
            butterfly: { count: 8, spread: 12, heightRange: { min: 1, max: 3 } }
        }
    },

    // Deforestation scene settings
    deforestation: {
        position: { x: 15, z: -115 },
        stumps: { count: 8, spread: 15 },
        fallenTrees: { count: 3, spread: 12 },
        loggers: { count: 3, spread: 8 },
        burningTrees: { count: 2, spread: 10 }
    },

    // Seasonal themes configuration
    seasonalThemes: {
        transitionDuration: 2000,
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
    }
};
