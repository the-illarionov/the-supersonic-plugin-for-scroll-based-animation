import { Element } from './Element';
import { Driver } from './Driver';

/**
 * The main purpose of Property is to translate this.driver.progress into CSS property
 */
export declare class Property {
    /** Corresponding Driver instance */
    driver: Driver;
    /** Name of any valid CSS numeric property */
    cssProperty: string;
    /** Consists of ${driver.id}---${cssProperty} */
    id: string;
    /** Starting numeric value of property (can be a Function) */
    start: number | Function;
    /** Ending numeric value of property (can be a Function) */
    end: number | Function;
    /** Property hooks */
    hooks: PropertyHooks;
    /** Current value of property */
    value: number;
    /** You can store your custom data here to use between hooks */
    data: {};
    /** What should be added in the end of property value. If left blank, "" is added */
    unit: string;
    /** Elements which are animated by this Property. Elements are added during creating Element instance */
    elements: Set<Element>;
    constructor({ driverId, cssProperty, start, end, unit, hooks }: PropertyConstructor);
    /** Property calculates it's value depending on driver.progress and adds itself to all of the corresponding elements */
    render(): void;
    /** Calculates value */
    calculateValue(): number;
    /** To allow user to hook to parent driver's updateLimits() */
    updateLimits(): void;
    /** All Property instances */
    static instances: Map<string, Property>;
    /** Initialize Property instances with check for mediaQueries */
    static init({ drivers }: MainConfiguration): void;
    /** Uninitialize Property instances */
    static uninit(): void;
}
