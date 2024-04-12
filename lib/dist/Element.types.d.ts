import { Configuration as DriverConfiguration } from './Driver.types';
import { TheSuperSonicPlugin } from './TheSupersonicPlugin';
import { Property } from './Property';
import { Driver } from './Driver';
import { Element } from './Element';

export type Hooks = {
    onInit?: (instance: Element) => any;
    onBeforeRender?: (instance: Element) => any;
    onAfterRender?: (instance: Element) => any;
    onUpdateLimits?: (instance: Element, driver: Driver) => any;
    onAddProperty?: (instance: Element, property: Property) => any;
};
export type Constructor = {
    id: string;
    plugin: TheSuperSonicPlugin;
    hooks?: Hooks;
};
export type Configuration = {
    hooks?: Hooks;
};
export type Init = {
    drivers: {
        [id: string]: DriverConfiguration;
    };
    plugin: TheSuperSonicPlugin;
    elements: {
        [elementSelector: string]: Configuration;
    };
};
