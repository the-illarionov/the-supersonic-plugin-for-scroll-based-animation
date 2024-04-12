import { Configuration, Hooks, Render } from './TheSupersonicPlugin.types';
import { Observer } from './Observer';
import { Driver } from './Driver';

/**
 *
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 *
 * @example
 * const plugin = new TheSuperSonicPlugin({
 *  // config
 * });
 *
 */
export declare class TheSuperSonicPlugin {
    /** Current window scrollY */
    scroll: number;
    /** Current screen height */
    screenHeight: number;
    /** Required to get all of the drivers render at once to stand on their first frame */
    renderedInitially: boolean;
    rafId: number;
    hooks: Hooks;
    consoleColor: string;
    /** IntersectionObserver instance */
    observer: Observer | null;
    /** Debounced resize listener */
    onResize: EventListener | null;
    /** All Driver instances */
    driverInstances: Map<string, Driver>;
    /** All active Driver instances */
    driverActiveInstances: Set<Driver>;
    constructor({ drivers, hooks }: Configuration);
    /** Removes all of the plugin stuff (useful for SPA) */
    uninit(): void;
    /** Main rendering cycle. Active drivers are visible ones */
    render({ useActiveDrivers }: Render): void;
    /** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
    updateLimits(): void;
    updateScroll(): void;
    /** Dirty hack for calculating screen height. We can't just use "window.innerHeight" because it "jumps" on mobile phones when you scroll and toolbar collapses */
    updateScreenHeight(): void;
}
