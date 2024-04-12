import { TheSuperSonicPlugin } from './TheSupersonicPlugin';
import { Driver } from './Driver';

export type Constructor = {
    id: string;
    hooks?: Hooks;
    plugin: TheSuperSonicPlugin;
    start: HTMLElement | null;
    end: HTMLElement | null;
};
export type Hooks = {
    onBeforeInit?: (instance: Driver) => any;
    onAfterInit?: (instance: Driver) => any;
    onBeforeRender?: (instance: Driver) => any;
    onAfterRender?: (instance: Driver) => any;
    onActivation?: (instance: Driver) => any;
    onDeactivation?: (instance: Driver) => any;
    onUpdateLimits?: (instance: Driver) => any;
};
export type Configuration = {
    properties: any;
    hooks?: Hooks;
    start: HTMLElement | null;
    end: HTMLElement | null;
};
export type Init = {
    drivers: {
        [id: string]: Configuration;
    };
    plugin: TheSuperSonicPlugin;
};
export type Render = {
    useActiveDrivers: boolean;
    plugin: TheSuperSonicPlugin;
};
export type BorderConstructor = {
    domElement: HTMLElement | null;
    plugin: TheSuperSonicPlugin;
    driver: Driver;
    type: 'start' | 'end';
};
export type HelperConstructor = {
    driver: Driver;
    plugin: TheSuperSonicPlugin;
};
