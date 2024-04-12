import { Configuration as DriverConfiguration } from './Driver.types';
import { Property } from './Property';

export type Hooks = {
    onInit?: (instance: Property) => any;
    onBeforeRender?: (instance: Property) => any;
    onAfterRender?: (instance: Property) => any;
    onUpdateLimits?: (instance: Property) => any;
};
export type Constructor = {
    driverId: string;
    start: number;
    end: number;
    unit?: string;
    hooks?: Hooks;
    elements?: string[];
    cssProperty: string;
};
export type Init = {
    drivers: {
        [id: string]: DriverConfiguration;
    };
};
