/**
 * Reusable Easing Functions
 * @module utils/Easing
 */

export const Easing = {
    /**
     * Linear easing (no easing)
     */
    linear: t => t,

    /**
     * Quadratic ease-in
     */
    easeInQuad: t => t * t,

    /**
     * Quadratic ease-out
     */
    easeOutQuad: t => t * (2 - t),

    /**
     * Quadratic ease-in-out
     */
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    /**
     * Cubic ease-in
     */
    easeInCubic: t => t * t * t,

    /**
     * Cubic ease-out
     */
    easeOutCubic: t => (--t) * t * t + 1,

    /**
     * Cubic ease-in-out
     */
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    /**
     * Elastic ease-out
     */
    easeOutElastic: t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
};
