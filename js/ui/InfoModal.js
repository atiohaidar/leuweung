/**
 * InfoModal - Displays detailed information about clicked 3D objects
 * Shows animal/tree info with beautiful animations
 * @module InfoModal
 */

import { CONFIG } from '../config.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../constants/events.js';
import { Logger } from '../utils/Logger.js';

export class InfoModal {
    constructor() {
        this.modal = null;
        this.isVisible = false;
        this.currentId = null;

        this.createModal();
        this.bindEvents();
    }

    createModal() {
        // Create modal container
        this.modal = document.createElement('div');
        this.modal.className = 'info-modal';
        this.modal.id = 'info-modal';

        this.modal.innerHTML = `
            <div class="info-modal-backdrop"></div>
            <div class="info-modal-content">
                <button class="info-modal-close" aria-label="Close">&times;</button>
                <div class="info-modal-header">
                    <span class="info-modal-emoji"></span>
                    <div class="info-modal-titles">
                        <h2 class="info-modal-name"></h2>
                        <p class="info-modal-latin"></p>
                    </div>
                </div>
                <div class="info-modal-body">
                    <p class="info-modal-description"></p>
                    <div class="info-modal-facts">
                        <h4>✨ Fakta Menarik</h4>
                        <ul class="info-modal-facts-list"></ul>
                    </div>
                    <div class="info-modal-meta">
                        <div class="info-modal-meta-item">
                            <span class="meta-label">🏠 Habitat</span>
                            <span class="meta-value info-modal-habitat"></span>
                        </div>
                        <div class="info-modal-meta-item">
                            <span class="meta-label">📊 Status</span>
                            <span class="meta-value info-modal-status"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
    }

    bindEvents() {
        // Close button
        const closeBtn = this.modal.querySelector('.info-modal-close');
        closeBtn.addEventListener('click', () => this.hide());

        // Backdrop click
        const backdrop = this.modal.querySelector('.info-modal-backdrop');
        backdrop.addEventListener('click', () => this.hide());

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Listen for object focus events from ObjectInteraction via EventBus
        eventBus.on(EVENTS.ANIMAL_INFO_REQUESTED, (data) => {
            if (data && data.id) {
                this.showInfo(data.id);
            }
        });
    }

    /**
     * Show info for an object by ID
     * @param {string} id - Object ID from config
     */
    showInfo(id) {
        const config = CONFIG.clickableObjects?.[id];
        if (!config?.info) {
            Logger.warn('InfoModal', `No info found for "${id}"`);
            return;
        }

        const info = config.info;
        this.currentId = id;

        // Populate modal content
        this.modal.querySelector('.info-modal-emoji').textContent = info.emoji || '';
        this.modal.querySelector('.info-modal-name').textContent = info.name || 'Unknown';
        this.modal.querySelector('.info-modal-latin').textContent = info.latinName || '';
        this.modal.querySelector('.info-modal-description').textContent = info.description || '';
        this.modal.querySelector('.info-modal-habitat').textContent = info.habitat || '-';
        this.modal.querySelector('.info-modal-status').textContent = info.status || '-';

        // Populate facts list
        const factsList = this.modal.querySelector('.info-modal-facts-list');
        factsList.innerHTML = '';
        if (info.facts && info.facts.length > 0) {
            info.facts.forEach(fact => {
                const li = document.createElement('li');
                li.textContent = fact;
                factsList.appendChild(li);
            });
        }

        // Apply theme if exists
        const content = this.modal.querySelector('.info-modal-content');
        content.className = 'info-modal-content';
        if (info.theme) {
            content.classList.add(`theme-${info.theme}`);
        }

        this.show();
    }

    /**
     * Show the modal with animation
     */
    show() {
        this.modal.classList.add('visible');
        this.isVisible = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Dispatch event
        eventBus.emit(EVENTS.MODAL_OPENED, { id: this.currentId });
        Logger.ui('Modal opened', this.currentId);
    }

    /**
     * Hide the modal with animation
     */
    hide() {
        this.modal.classList.remove('visible');
        this.isVisible = false;

        // Restore body scroll
        document.body.style.overflow = '';

        // Dispatch event
        eventBus.emit(EVENTS.MODAL_CLOSED, { id: this.currentId });

        // Also inform ObjectInteraction indirectly (optional, typically UI doesn't drive logic back)
        // But we might want to unfocus the object
        // For now, let's keep it simple. If we want unfocus, setup a listener in main.js

        this.currentId = null;
    }

    /**
     * Check if modal is currently visible
     */
    getIsVisible() {
        return this.isVisible;
    }

    /**
     * Get current displayed ID
     */
    getCurrentId() {
        return this.currentId;
    }
}
