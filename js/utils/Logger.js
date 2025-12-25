/**
 * Centralized Logger Utility
 * Provides consistent logging with categories and levels
 * @module utils/Logger
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
};

// Default configuration
const config = {
    level: LOG_LEVELS.INFO,
    enabled: true
};

/**
 * Format message with emoji and category
 */
const formatMessage = (emoji, category, message) => {
    return `${emoji} [${category}] ${message}`;
};

export const Logger = {
    LEVELS: LOG_LEVELS,

    setLevel(level) {
        config.level = level;
    },

    disable() {
        config.enabled = false;
    },

    enable() {
        config.enabled = true;
    },

    debug(category, ...args) {
        if (!config.enabled || config.level > LOG_LEVELS.DEBUG) return;
        console.debug(formatMessage('🐛', category, args[0]), ...args.slice(1));
    },

    info(category, ...args) {
        if (!config.enabled || config.level > LOG_LEVELS.INFO) return;
        console.log(formatMessage('ℹ️', category, args[0]), ...args.slice(1));
    },

    warn(category, ...args) {
        if (!config.enabled || config.level > LOG_LEVELS.WARN) return;
        console.warn(formatMessage('⚠️', category, args[0]), ...args.slice(1));
    },

    error(category, ...args) {
        if (!config.enabled || config.level > LOG_LEVELS.ERROR) return;
        console.error(formatMessage('❌', category, args[0]), ...args.slice(1));
    },

    // Specific category helpers
    scene(message, ...args) { this.info('Scene', message, ...args); },
    object(message, ...args) { this.info('Object', message, ...args); },
    effect(message, ...args) { this.info('Effect', message, ...args); },
    ui(message, ...args) { this.info('UI', message, ...args); }
};
