import { Configuration as ElementConfiguration } from './Element.types';
import { Configuration as DriverConfiguration } from './Driver.types';
import { TheSuperSonicPlugin } from './TheSupersonicPlugin';

export type Configuration = {
    hooks?: Hooks;
    drivers: {
        [id: string]: DriverConfiguration;
    };
    elements?: {
        [elementSelector: string]: ElementConfiguration;
    };
};
export type Hooks = {
    onBeforeInit?: (instance: TheSuperSonicPlugin) => void;
    onAfterInit?: (instance: TheSuperSonicPlugin) => void;
    onBeforeRender?: (instance: TheSuperSonicPlugin) => void;
    onAfterRender?: (instance: TheSuperSonicPlugin) => void;
    onBeforeResize?: (instance: TheSuperSonicPlugin) => void;
    onAfterResize?: (instance: TheSuperSonicPlugin) => void;
};
export type Render = {
    useActiveDrivers: boolean;
};
