/**
 * Configuration - Re-exports from modular config folder
 * This file is kept for backward compatibility
 * 
 * Config files are now organized in js/config/:
 * - scene.js    : Scene, camera, lighting, ground
 * - objects.js  : Trees, fireflies, particles, wildlife, etc.
 * - effects.js  : All effects settings
 * - content.js  : Text content, labels, section titles
 * - ui.js       : UI controls
 * - themes.js   : Seasonal themes
 * - index.js    : Combines all into CONFIG
 * 
 * @module config
 */

export { CONFIG } from './config/index.js';
export * from './config/index.js';
