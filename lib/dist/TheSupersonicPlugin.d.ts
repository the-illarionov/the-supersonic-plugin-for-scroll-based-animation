import { Configuration, Hooks, Render } from './TheSupersonicPlugin.types';
import { Observer } from './Observer';
import { Driver } from './Driver';

/**
 *
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 *
 * @example
 * const plugin = new TheSuperSonicPlugin({
 *   drivers: {
 *     'name-of-your-driver': {
 *        start: document.querySelector('.start'),
 *        end: document.querySelector('.end'),
 *        elements: ['.animatable-element']
 *      }
 *   }
 * });
 *
 */
export declare class TheSuperSonicPlugin {
    /** Unique id of thisrunning instance */
    id: string;
    /** Current window scrollY */
    scroll: number;
    /** Current screen height */
    screenHeight: number;
    /** Required to get all of the drivers render at once to stand on their first frame */
    renderedInitially: boolean;
    /** Used to cancelAnimationFrame on 'uninit()' */
    rafId: number;
    /** Color of console messages in dev mode. It changes each frame to make it more convenient to visually separate frames */
    consoleColor: string;
    /** IntersectionObserver instance */
    observer: Observer | null;
    /** Debounced resize listener */
    onResize: EventListener | null;
    hooks: Hooks;
    driverInstances: Map<string, Driver>;
    driverActiveInstances: Set<Driver>;
    constructor({ drivers, hooks }: Configuration);
    /** Removes all of the plugin stuff (useful for SPA) */
    uninit(): void;
    /** Main rendering cycle. Active drivers are visible ones */
    render({ useActiveDrivers }: Render): false | undefined;
    /** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
    updateLimits(): void;
    updateScroll(): void;
    /** Dirty hack for calculating screen height. We can't just use "window.innerHeight" because it "jumps" on mobile phones when you scroll and toolbar collapses */
    updateScreenHeight(): void;
}
