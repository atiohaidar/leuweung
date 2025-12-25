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

    ],

    // 3D Section Titles (fly-through text)
    sectionTitles: [
        {
            id: 'giantTree',
            title: 'ADA POHON',
            subtitle: 'BANYAK',
            description: 'Jadi ada banyak pohon disini',
            position: { x: 0, y: 2, z: -24 },
            color: 0x4ade80,
            emissive: 0x22c55e
        },
        {
            id: 'wildlife',
            title: 'ADA HEWAN',
            subtitle: 'LIAR',
            description: 'Mereka hidup dengan (semoga damai)',
            position: { x: 0, y: 3, z: -58 },
            color: 0x60a5fa,
            emissive: 0x3b82f6
        },
        {
            id: 'river',
            title: 'SUNGAI',
            subtitle: 'JERNIH',
            description: 'Boleh di minum ga?',
            position: { x: 0, y: 2, z: -92 },
            color: 0x22d3ee,
            emissive: 0x06b6d4
        },
        {
            id: 'deforestation',
            title: 'TAPIII',
            subtitle: 'APA INI??',
            description: 'Keserakahan manusia yang bisa merugikan banyak pihak',
            position: { x: 15, y: 5, z: -115 },
            color: 0xfb923c,
            emissive: 0xf97316,
            faceCamera: true
        },
        {
            id: 'earth',
            title: 'LINDUNGI',
            subtitle: 'BUMI KITA',
            description: 'Kalo ke mars, belum tentu ada batagor',
            position: { x: 0, y: 25, z: -130 },
            color: 0xa78bfa,
            emissive: 0x8b5cf6,
            isVertical: true,
            faceCamera: true,
            cinematic: true
        },
        {
            id: 'finale',
            title: 'LIBRARY EXTERNAL?',
            subtitle: 'THREE JS',
            description: 'Tools nge bikinnya make Antigravity',
            position: { x: 0, y: 150, z: -140 },
            color: 0x4ade80,
            emissive: 0x22c55e,
            isVertical: true,
            faceCamera: true,
            cinematic: true
        },
        {
            id: 'credits',
            title: 'YEY UDAHAN',
            subtitle: 'UDAH GITU AJA',
            description: 'Iseng aja sebenernnya wkwkwk',
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
