/**
 * 3D Labels - Floating labels that appear beside 3D objects
 * @module Labels3D
 */

export class Labels3D {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.camera = sceneManager.getCamera();
        this.labels = [];
        this.container = null;

        this.init();
    }

    init() {
        this.createContainer();
        this.createLabels();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'labels-3d-container';
        document.body.appendChild(this.container);
    }

    createLabels() {
        const labelData = [
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
        ];

        labelData.forEach(data => {
            const label = this.createLabelElement(data);
            this.labels.push({
                element: label,
                ...data
            });
            this.container.appendChild(label);
        });
    }

    createLabelElement(data) {
        const label = document.createElement('div');
        label.className = `label-3d ${data.theme || ''} ${data.side}`;
        label.id = `label-${data.id}`;

        label.innerHTML = `
            <div class="label-content">
                <h3 class="label-title">${data.title}</h3>
                <p class="label-description">${data.description}</p>
            </div>
            <div class="label-connector"></div>
        `;

        return label;
    }

    update() {
        const scrollProgress = this.sceneManager.getScrollProgress();

        this.labels.forEach(label => {
            const { min, max } = label.visibleRange;
            const isVisible = scrollProgress >= min && scrollProgress <= max;

            if (isVisible) {
                // Calculate visibility intensity (fade in/out at edges)
                const rangeSize = max - min;
                const fadeZone = rangeSize * 0.2; // 20% fade zone

                let opacity = 1;
                if (scrollProgress < min + fadeZone) {
                    opacity = (scrollProgress - min) / fadeZone;
                } else if (scrollProgress > max - fadeZone) {
                    opacity = (max - scrollProgress) / fadeZone;
                }

                // Project 3D position to 2D screen
                const screenPos = this.projectToScreen(label.position3D);

                if (screenPos) {
                    label.element.style.opacity = opacity;
                    label.element.style.visibility = 'visible';

                    // Position based on side preference
                    if (label.side === 'center') {
                        label.element.style.left = '50%';
                        label.element.style.top = `${Math.min(screenPos.y, 70)}%`;
                        label.element.style.transform = `translate(-50%, -50%) scale(${0.8 + opacity * 0.2})`;
                    } else {
                        // Keep labels in a readable position (not too far off screen)
                        const clampedX = Math.max(10, Math.min(90, screenPos.x));
                        const clampedY = Math.max(15, Math.min(85, screenPos.y));

                        label.element.style.left = `${clampedX}%`;
                        label.element.style.top = `${clampedY}%`;
                        label.element.style.transform = `translate(-50%, -50%) scale(${0.8 + opacity * 0.2})`;
                    }
                }
            } else {
                label.element.style.opacity = 0;
                label.element.style.visibility = 'hidden';
            }
        });
    }

    projectToScreen(position3D) {
        const vector = new THREE.Vector3(position3D.x, position3D.y, position3D.z);

        // Project to normalized device coordinates
        vector.project(this.camera);

        // Check if behind camera
        if (vector.z > 1) {
            return null;
        }

        // Convert to screen percentage
        const x = (vector.x * 0.5 + 0.5) * 100;
        const y = (-vector.y * 0.5 + 0.5) * 100;

        return { x, y };
    }

    getLabels() {
        return this.labels;
    }
}
