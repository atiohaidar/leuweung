/**
 * FPS Display - Shows real-time FPS counter and performance stats
 * Toggle with ` (backtick) key
 * @module FPSDisplay
 */

import { getPerformanceMonitor } from './PerformanceMonitor.js';

export class FPSDisplay {
    constructor() {
        this.visible = false;
        this.element = null;
        this.monitor = getPerformanceMonitor();
        this.updateInterval = null;

        this.create();
        this.bindEvents();
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = 'fps-display';
        this.element.innerHTML = `
            <div class="fps-main">
                <span class="fps-value">60</span>
                <span class="fps-label">FPS</span>
            </div>
            <div class="fps-details">
                <div>Quality: <span class="quality-value">100%</span></div>
                <div>Frame: <span class="frame-value">16.67ms</span></div>
            </div>
        `;

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            #fps-display {
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: #00ff00;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 12px;
                padding: 8px 12px;
                border-radius: 6px;
                z-index: 10000;
                display: none;
                backdrop-filter: blur(4px);
                border: 1px solid rgba(0, 255, 0, 0.3);
                min-width: 100px;
            }
            
            #fps-display.visible {
                display: block;
            }
            
            #fps-display .fps-main {
                display: flex;
                align-items: baseline;
                gap: 4px;
                margin-bottom: 4px;
            }
            
            #fps-display .fps-value {
                font-size: 24px;
                font-weight: bold;
            }
            
            #fps-display .fps-label {
                font-size: 10px;
                opacity: 0.7;
            }
            
            #fps-display .fps-details {
                font-size: 10px;
                opacity: 0.8;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 4px;
            }
            
            #fps-display.good .fps-value { color: #00ff00; }
            #fps-display.warning .fps-value { color: #ffff00; }
            #fps-display.critical .fps-value { color: #ff4444; }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.element);
    }

    bindEvents() {
        // Toggle with backtick key
        window.addEventListener('keydown', (e) => {
            if (e.key === '`' || e.key === 'F3') {
                this.toggle();
            }
        });
    }

    toggle() {
        this.visible = !this.visible;
        this.element.classList.toggle('visible', this.visible);

        if (this.visible) {
            this.startUpdating();
            console.log('📊 FPS Display enabled (press ` to hide)');
        } else {
            this.stopUpdating();
        }
    }

    startUpdating() {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            this.update();
        }, 100);
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        const stats = this.monitor.getStats();
        const fps = stats.fps;
        const quality = Math.round(stats.qualityLevel * 100);

        this.element.querySelector('.fps-value').textContent = fps;
        this.element.querySelector('.quality-value').textContent = quality + '%';
        this.element.querySelector('.frame-value').textContent = stats.avgFrameTime + 'ms';

        // Update color based on FPS
        this.element.classList.remove('good', 'warning', 'critical');
        if (fps >= 55) {
            this.element.classList.add('good');
        } else if (fps >= 30) {
            this.element.classList.add('warning');
        } else {
            this.element.classList.add('critical');
        }
    }

    show() {
        this.visible = true;
        this.element.classList.add('visible');
        this.startUpdating();
    }

    hide() {
        this.visible = false;
        this.element.classList.remove('visible');
        this.stopUpdating();
    }
}

// Auto-initialize if in development mode
let instance = null;

export function getFPSDisplay() {
    if (!instance) {
        instance = new FPSDisplay();
    }
    return instance;
}
