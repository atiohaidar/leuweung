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
        // Styles are handled in controls.css

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000); // Increased duration slightly for better visibility
    }
}
