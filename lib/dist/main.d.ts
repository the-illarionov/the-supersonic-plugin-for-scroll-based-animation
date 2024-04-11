import { Observer } from './engine/Observer';
import { Element } from './engine/Element';
import { Property } from './engine/Property';
import { Driver } from './engine/Driver';

/**
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 */
export declare class TheSuperSonicPluginForScrollBasedAnimation {
    /** IntersectionObserver instance */
    observer: Observer | null;
    /** Debounced resize listener */
    onResize: EventListener | null;
    constructor(config: MainConfiguration);
    /** Removes all of the plugin stuff (useful for SPA) */
    uninit(): void;
    /** Creates instances of Driver, Property and Element on plugin load */
    initInstances(): void;
    /** Creates IntersectionObserver, which handles "active" state on Driver instances */
    initObserver(): void;
    /** Main rendering cycle. Active drivers are visible ones. On initial plugin load all of the drivers must be rendered in their initial stage, so "useActiveDrivers: false" */
    render({ useActiveDrivers }: MainRender): void;
    /** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
    updateLimits(): void;
    /** Updates global scroll */
    updateScroll(): void;
    /** Dirty hack for calculating screen height. We can't just use "window.innerHeight" because it "jumps" on mobile phones when you scroll and toolbar collapses */
    updateScreenHeight(): void;
    /** Add event listeners */
    addEventListeners(): void;
    /** Removes event listeners */
    removeEventListeners(): void;
    static Driver: typeof Driver;
    static Property: typeof Property;
    static Element: typeof Element;
    static Globals: Globals;
}
