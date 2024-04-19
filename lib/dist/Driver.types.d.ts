import { TheSupersonicPlugin } from './TheSupersonicPlugin';
import { ElementSelector } from './Animation.types';
import { Driver } from './Driver';

export type DriverConfiguration = {
    id?: string;
    start: DriverBorderConfiguration;
    end: DriverBorderConfiguration;
    elements?: ElementSelector[];
    hooks?: DriverHooks;
};
export type DriverConstructor = Omit<DriverConfiguration, 'id'> & {
    id: string;
    plugin: TheSupersonicPlugin;
};
export type DriverRender = {
    scroll: number;
    renderedInitially: boolean;
    consoleColor?: string;
};
export type DriverCalculateProgress = {
    scroll: number;
    start: number;
    end: number;
};
export type DriverHooks = {
    onBeforeInit?: (driver: Driver) => void;
    onAfterInit?: (driver: Driver) => void;
    /** You can `return false` inside your hook, it will cancel rendering */
    onBeforeRender?: (driver: Driver) => void | undefined | boolean;
    onAfterRender?: (driver: Driver) => void;
    onActivation?: (driver: Driver) => void;
    onDeactivation?: (driver: Driver) => void;
    onUpdateLimits?: (driver: Driver) => void;
};
type DriverBorderConfiguration = HTMLElement | string | null;
export type DriverBorderConstructor = {
    domElement: DriverBorderConfiguration;
    driver: Driver;
    type: 'start' | 'end';
};
export type DriverHelperConstructor = {
    id: string;
    pluginId: string;
    debug?: boolean;
};
export type DriverUpdateLimits = {
    scroll: number;
    screenHeight: number;
};
export type DriverBorderUpdateLimits = {
    scroll: number;
    screenHeight: number;
};
export type DriverHelperUpdateLimits = {
    top: number;
    height: number;
};
export {};
