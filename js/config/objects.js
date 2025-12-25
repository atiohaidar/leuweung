/**
 * Objects Configuration - Trees, fireflies, particles, earth, wildlife
 * @module config/objects
 */

export const objectsConfig = {
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

    // Earth settings
    earth: {
        position: { x: 0, y: -80, z: -150 },
        radius: 50,
        stars: {
            count: 500,
            radiusMin: 200,
            radiusMax: 500,
            size: 1,
            opacity: 0.8
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

    // Points of Interest
    pointsOfInterest: {
        giantTree: {
            position: { x: -15, y: 0, z: -50 },
            cameraPosition: { x: -8, y: 5, z: -40 },
            lookAt: { x: -15, y: 10, z: -50 },
            mushroomScale: { min: 0.5, max: 1.0 }
        },
        wildlife: {
            position: { x: 15, y: 0, z: -80 },
            cameraPosition: { x: 15, y: 3, z: -70 },
            lookAt: { x: 15, y: 1.5, z: -80 }
        },
        river: {
            position: { x: 0, y: 0, z: -120 },
            cameraPosition: { x: 5, y: 2, z: -110 },
            lookAt: { x: 0, y: 0, z: -130 },
            sparkleCount: 100,
            flowerScale: { min: 0.5, max: 1.3 }
        }
    },

    // Clickable Objects - Config-driven object interaction
    // All clickable objects have BOTH info (for modal) and camera (for zoom)
    clickableObjects: {
        // === Points of Interest ===
        giantTree: {
            id: 'giantTree',
            sourceClass: 'PointsOfInterest',
            clickable: true,
            info: {
                emoji: '🌳',
                name: 'Pohon Raksasa',
                latinName: 'Ficus benjamina',
                description: 'Pohon berusia ratusan tahun yang menjulang tinggi ke langit. Pohon ini adalah saksi bisu sejarah hutan dan menjadi rumah bagi berbagai makhluk hidup.',
                facts: [
                    'Tinggi mencapai 60+ meter',
                    'Usia lebih dari 500 tahun',
                    'Menyerap 22kg CO2 setiap tahun'
                ],
                habitat: 'Hutan hujan tropis',
                status: 'Langka'
            },
            camera: {
                position: { x: -8, y: 5, z: -40 },
                lookAt: { x: -15, y: 10, z: -50 }
            }
        },
        wildlife: {
            id: 'wildlife',
            sourceClass: 'PointsOfInterest',
            clickable: true,
            info: {
                emoji: '🦋',
                name: 'Area Kehidupan Liar',
                latinName: 'Ecosystem Zone',
                description: 'Area di mana beragam satwa liar hidup harmonis dalam ekosistem hutan yang seimbang. Di sini kamu bisa menemukan rusa, kelinci, dan kupu-kupu.',
                facts: [
                    'Rumah bagi 2 rusa dan 4 kelinci',
                    'Banyak kupu-kupu berwarna-warni',
                    'Ekosistem seimbang alami'
                ],
                habitat: 'Padang rumput dalam hutan',
                status: 'Terjaga'
            },
            camera: {
                position: { x: 15, y: 3, z: -70 },
                lookAt: { x: 15, y: 1.5, z: -80 }
            }
        },
        river: {
            id: 'river',
            sourceClass: 'PointsOfInterest',
            clickable: true,
            info: {
                emoji: '💧',
                name: 'Sungai Jernih',
                latinName: 'Freshwater Stream',
                description: 'Aliran sungai jernih yang mengalir dari pegunungan. Airnya yang bersih menjadi sumber kehidupan bagi seluruh penghuni hutan.',
                facts: [
                    'Air berasal dari mata air pegunungan',
                    'Ikan melompat-lompat di permukaan',
                    'Sumber air minum satwa hutan'
                ],
                habitat: 'Lembah hutan',
                status: 'Bersih'
            },
            camera: {
                position: { x: 5, y: 2, z: -110 },
                lookAt: { x: 0, y: 0, z: -130 }
            }
        },
        deforestation: {
            id: 'deforestation',
            sourceClass: 'Deforestation',
            clickable: true,
            info: {
                emoji: '⚠️',
                name: 'Ancaman Nyata',
                latinName: 'Deforestation Zone',
                description: 'Area penebangan liar yang mengancam ekosistem hutan. Aktivitas ini menghancurkan habitat satwa dan berkontribusi pada perubahan iklim.',
                facts: [
                    'Jutaan hektar hutan hilang setiap tahun',
                    'Habitat satwa liar terancam punah',
                    'Mempercepat perubahan iklim global'
                ],
                habitat: 'Bekas hutan',
                status: 'Kritis',
                theme: 'warning'
            },
            camera: {
                position: { x: 20, y: 4, z: -105 },
                lookAt: { x: 15, y: 2, z: -115 }
            }
        },
        earth: {
            id: 'earth',
            sourceClass: 'Earth',
            clickable: true,
            info: {
                emoji: '🌍',
                name: 'Bumi Kita',
                latinName: 'Planet Earth',
                description: 'Planet biru tempat kita tinggal. Hutan menutupi 31% daratan dan menjadi paru-paru dunia yang harus kita lindungi.',
                facts: [
                    'Hutan menutupi 31% daratan bumi',
                    'Disebut paru-paru dunia',
                    'Rumah bagi jutaan spesies'
                ],
                habitat: 'Tata Surya',
                status: 'Perlu Dilindungi',
                theme: 'cta'
            },
            camera: {
                position: { x: 0, y: 80, z: -130 },
                lookAt: { x: 0, y: 50, z: -150 }
            }
        },

        // === Individual Animals ===
        deer: {
            id: 'deer',
            sourceClass: 'Wildlife',
            clickable: true,
            info: {
                emoji: '🦌',
                name: 'Rusa Hutan',
                latinName: 'Cervus timorensis',
                description: 'Rusa adalah mamalia herbivora yang anggun dan hidup berkelompok di hutan. Mereka memiliki peran penting dalam menjaga keseimbangan ekosistem.',
                facts: [
                    'Tanduk rusa jantan bisa tumbuh hingga 1 cm per hari!',
                    'Rusa bisa berlari hingga 60 km/jam',
                    'Mereka adalah hewan sosial yang hidup dalam kelompok'
                ],
                habitat: 'Hutan tropis dan padang rumput',
                status: 'Dilindungi'
            },
            camera: {
                position: { x: 2, y: 2, z: -55 },
                lookAt: { x: 0, y: 1, z: -58 }
            }
        },
        rabbit: {
            id: 'rabbit',
            sourceClass: 'Wildlife',
            clickable: true,
            info: {
                emoji: '🐰',
                name: 'Kelinci Hutan',
                latinName: 'Lepus nigricollis',
                description: 'Kelinci adalah hewan kecil yang lincah dan menggemaskan. Mereka berperan penting dalam rantai makanan hutan.',
                facts: [
                    'Kelinci bisa melompat setinggi 1 meter!',
                    'Gigi kelinci tidak pernah berhenti tumbuh',
                    'Mereka punya penglihatan hampir 360 derajat'
                ],
                habitat: 'Semak-semak dan lubang tanah',
                status: 'Umum'
            },
            camera: {
                position: { x: 3, y: 1.5, z: -55 },
                lookAt: { x: 0, y: 0.5, z: -58 }
            }
        },
        butterfly: {
            id: 'butterfly',
            sourceClass: 'Wildlife',
            clickable: true,
            info: {
                emoji: '🦋',
                name: 'Kupu-kupu',
                latinName: 'Papilionoidea',
                description: 'Kupu-kupu adalah serangga penyerbuk yang sangat penting untuk reproduksi tanaman berbunga di hutan.',
                facts: [
                    'Kupu-kupu bisa melihat warna ultraviolet',
                    'Sayap mereka tertutup ribuan sisik kecil',
                    'Ada lebih dari 20.000 spesies kupu-kupu di dunia'
                ],
                habitat: 'Padang bunga dan hutan',
                status: 'Beragam'
            },
            camera: {
                position: { x: 2, y: 3, z: -55 },
                lookAt: { x: 0, y: 2, z: -58 }
            }
        },
        fish: {
            id: 'fish',
            sourceClass: 'JumpingFish',
            clickable: true,
            info: {
                emoji: '🐟',
                name: 'Ikan Sungai',
                latinName: 'Cyprinidae',
                description: 'Ikan sungai adalah penghuni air tawar yang vital bagi ekosistem sungai. Mereka menjadi indikator kesehatan sungai.',
                facts: [
                    'Ikan bisa merasakan getaran air dari jarak jauh',
                    'Beberapa ikan bisa melompat hingga 3 meter!',
                    'Ikan bernapas menggunakan insang'
                ],
                habitat: 'Sungai dan danau air tawar',
                status: 'Beragam'
            },
            camera: {
                position: { x: 3, y: 2, z: -88 },
                lookAt: { x: 0, y: 0, z: -92 }
            }
        },
        tree: {
            id: 'tree',
            sourceClass: 'Trees',
            clickable: true,
            info: {
                emoji: '🌲',
                name: 'Pohon Hutan',
                latinName: 'Dipterocarpaceae',
                description: 'Pohon adalah tulang punggung ekosistem hutan. Mereka menyediakan oksigen, tempat tinggal bagi satwa, dan menyerap karbon.',
                facts: [
                    'Satu pohon dewasa menyerap 22kg CO2 per tahun',
                    'Pohon berkomunikasi melalui jaringan akar',
                    'Hutan tropis menyimpan 25% karbon dunia'
                ],
                habitat: 'Hutan hujan tropis',
                status: 'Terancam penebangan'
            },
            camera: {
                position: { x: 5, y: 4, z: -20 },
                lookAt: { x: 0, y: 3, z: -30 }
            }
        }
    }
};

