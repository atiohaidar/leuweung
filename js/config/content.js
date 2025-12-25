/**
 * Content Configuration - Text content, labels, section titles
 * @module config/content
 */

export const contentConfig = {
    // Animation timing
    animation: {
        loadingDelay: 1500
    },

    // 3D Labels (floating info boxes)
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
        }
    ],

    // 3D Section Titles (fly-through text)
    sectionTitles: [
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
            position: { x: 15, y: 5, z: -115 },
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
            cinematic: true
        },
        {
            id: 'finale',
            title: 'JAGALAH',
            subtitle: 'BUMI',
            description: 'Karena bumi bukan warisan nenek moyang, tapi titipan anak cucu',
            position: { x: 0, y: 150, z: -140 },
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
            position: { x: 0, y: 250, z: -145 },
            color: 0xffffff,
            emissive: 0xaaaaaa,
            isVertical: true,
            faceCamera: true,
            cinematic: true
        }
    ],

    // Animal interaction descriptions
    animalInfo: {
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
    }
};
