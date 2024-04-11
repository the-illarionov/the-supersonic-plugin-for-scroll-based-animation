import { Property } from './Property';
import { Driver } from './Driver';

/**
 * The main purpose of Element is to track down DOM elements and apply CSS properties to them. Element doesn't know anything about Driver or Property
 */
export declare class Element {
    /** CSS selector. You can have different CSS selectors for same element and they will be considered as separate instances of Element */
    id: string;
    /** Normally, one Element instance goes for one DOM element, but you can have multiple DOM elements with same selector, so it is an Array */
    domElements: Array<HTMLElement>;
    /** Element hooks */
    hooks: ElementHooks;
    /** You can store your custom data here to use between hooks */
    data: {};
    /** List of added Property instances */
    properties: Map<string, Property>;
    /** In case of translate presence we need to keep them */
    translate3d: translate3d;
    constructor({ id, hooks }: ElementConstructor);
    /** Parsing initial translate values and save them */
    saveInitialTranslate(): void;
    /** Initializing DOM elements */
    initDomElements(): void;
    /** Main core of the whole plugin. Element parses it's "properties", normalizes them and applies */
    render(): void;
    /**
     * Called by Property.ts:56. On the first onload render it checks if property already exists and if it does, checks if driver of added property is closest to scroll. It prevents bugs when:
     * 1. You have multiple drivers animating same property
     * 2. You scroll
     * 3. You reload page */
    addProperty(property: Property): void;
    /** Turns multiple transform properties into single CSS "transform" value */
    calculateFlatProperties(): flattenedProperties;
    /** To allow user to hook to an initiator driver's updateLimits() */
    updateLimits(driver: Driver): void;
    /** All Elements instances */
    static instances: Map<string, Element>;
    /** Element instances which are being animated right now */
    static activeInstances: Set<Element>;
    /** Initialize Element instances */
    static init({ drivers, elements }: MainConfiguration): void;
    /** Uninitialize Element instances */
    static uninit(): void;
    /** Render all of active Element instances */
    static render(): void;
    static transformKeys: string[];
    static translate3dKeys: string[];
}
