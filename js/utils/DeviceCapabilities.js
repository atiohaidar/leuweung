/**
 * Device Capabilities - Detect device type and adjust settings for optimal performance
 * @module DeviceCapabilities
 */

export class DeviceCapabilities {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.isTouchDevice = this.detectTouch();
        this.gpuTier = this.estimateGPUTier();
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        // Performance multipliers based on device capabilities
        this.performanceSettings = this.calculatePerformanceSettings();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    estimateGPUTier() {
        // Simple GPU tier estimation
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) return 'low';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();

            // High-end GPUs
            if (/nvidia|geforce|rtx|gtx|radeon rx|adreno 6|apple gpu|mali-g7/i.test(renderer)) {
                return 'high';
            }
            // Mid-range
            if (/intel|adreno 5|mali-g5|mali-t/i.test(renderer)) {
                return 'medium';
            }
        }

        // Default based on device type
        if (this.isMobile) return 'low';
        if (this.isTablet) return 'medium';
        return 'medium';
    }

    calculatePerformanceSettings() {
        const settings = {
            particleMultiplier: 1,
            renderScale: 1,
            shadowsEnabled: true,
            maxLights: 10,
            antialias: true
        };

        if (this.gpuTier === 'low' || this.isMobile) {
            settings.particleMultiplier = 0.3;
            settings.renderScale = 0.75;
            settings.shadowsEnabled = false;
            settings.maxLights = 3;
            settings.antialias = false;
        } else if (this.gpuTier === 'medium' || this.isTablet) {
            settings.particleMultiplier = 0.6;
            settings.renderScale = 0.9;
            settings.shadowsEnabled = true;
            settings.maxLights = 5;
            settings.antialias = true;
        }

        return settings;
    }

    /**
     * Get adjusted count based on device capabilities
     * @param {number} baseCount - The base count for high-end devices
     * @returns {number} Adjusted count
     */
    getAdjustedCount(baseCount) {
        return Math.floor(baseCount * this.performanceSettings.particleMultiplier);
    }

    /**
     * Get render scale for device
     * @returns {number} Render scale (0-1)
     */
    getRenderScale() {
        return this.performanceSettings.renderScale;
    }

    /**
     * Check if device supports a feature
     * @param {string} feature - Feature name
     * @returns {boolean}
     */
    supports(feature) {
        switch (feature) {
            case 'shadows':
                return this.performanceSettings.shadowsEnabled;
            case 'antialias':
                return this.performanceSettings.antialias;
            case 'touch':
                return this.isTouchDevice;
            default:
                return true;
        }
    }

    /**
     * Log device info for debugging
     */
    logInfo() {
        console.log('📱 Device Capabilities:', {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isTouchDevice: this.isTouchDevice,
            gpuTier: this.gpuTier,
            pixelRatio: this.pixelRatio,
            settings: this.performanceSettings
        });
    }
}

// Singleton instance
let instance = null;

export function getDeviceCapabilities() {
    if (!instance) {
        instance = new DeviceCapabilities();
    }
    return instance;
}
