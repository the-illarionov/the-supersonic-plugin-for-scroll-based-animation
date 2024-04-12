import { Configuration as DriverConfiguration } from './Driver.types';
import { TheSuperSonicPlugin } from './TheSupersonicPlugin';

export type Configuration = {
    hooks?: Hooks;
    drivers: DriverConfiguration;
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
