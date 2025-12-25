/**
 * Throttle & Debounce Utilities
 * Optimizes event handlers to prevent performance issues
 * @module Throttle
 */

/**
 * Throttle a function to run at most once per interval
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum time between calls (ms)
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit) {
    let inThrottle = false;
    let lastArgs = null;

    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    fn.apply(this, lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };
}

/**
 * Debounce a function to only run after a pause in calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Time to wait after last call (ms)
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
    let timeoutId = null;

    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}

/**
 * RequestAnimationFrame-based throttle for smooth animations
 * @param {Function} fn - Function to throttle
 * @returns {Function} RAF-throttled function
 */
export function rafThrottle(fn) {
    let ticking = false;
    let lastArgs = null;

    return function (...args) {
        lastArgs = args;

        if (!ticking) {
            requestAnimationFrame(() => {
                fn.apply(this, lastArgs);
                ticking = false;
            });
            ticking = true;
        }
    };
}

/**
 * Leading edge throttle - calls immediately, then throttles
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum time between calls (ms)
 * @returns {Function} Throttled function
 */
export function throttleLeading(fn, limit) {
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();

        if (now - lastCall >= limit) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}
