/**
 * Photo Mode - Capture screenshots of the 3D scene
 * @module PhotoMode
 */

export class PhotoMode {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.renderer = sceneManager.renderer;

        this.isActive = false;
        this.hideUI = false;
    }

    capture() {
        // Hide UI elements temporarily
        const uiElements = document.querySelectorAll('.content, footer, .progress-bar, #back-button, .controls-panel');
        uiElements.forEach(el => {
            el.dataset.originalDisplay = el.style.display;
            el.style.display = 'none';
        });

        // Force render
        this.sceneManager.render();

        // Capture canvas
        const canvas = this.renderer.domElement;
        const dataURL = canvas.toDataURL('image/png', 1.0);

        // Create download link
        const link = document.createElement('a');
        link.download = `forest-journey-${Date.now()}.png`;
        link.href = dataURL;
        link.click();

        // Restore UI
        uiElements.forEach(el => {
            el.style.display = el.dataset.originalDisplay || '';
        });

        // Show notification
        this.showNotification('📸 Screenshot saved!');

        return dataURL;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'photo-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: rgba(168, 230, 207, 0.9);
            color: #0a1a0f;
            border-radius: 30px;
            font-weight: 600;
            z-index: 1000;
            animation: fadeInOut 2s ease forwards;
        `;

        // Add animation keyframes if not exists
        if (!document.querySelector('#photo-mode-styles')) {
            const style = document.createElement('style');
            style.id = 'photo-mode-styles';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}
