/**
 * UI Configuration - User interface controls and settings
 * @module config/ui
 */

export const uiConfig = {
    // UI Controls
    controls: [
        { id: 'magic', label: '✨ Magic Particles', defaultActive: true },
        { id: 'birds', label: '🐦 Burung Terbang', defaultActive: true },
        { id: 'flashlight', label: '🔦 Mode Senter', defaultActive: false },
        { id: 'photo', label: '📸 Ambil Foto', type: 'action', icon: '📷' },
        { id: 'season', label: '🍂 Musim', type: 'cycle', defaultValue: 'SUMMER' }
    ]
};
