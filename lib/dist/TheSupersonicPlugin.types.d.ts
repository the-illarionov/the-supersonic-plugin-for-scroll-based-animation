import { Configuration as DriverConfiguration } from './Driver.types';
import { TheSuperSonicPlugin } from './TheSupersonicPlugin';

export type Configuration = {
    hooks?: Hooks;
    drivers: DriverConfiguration;
};
export type Hooks = {
    onBeforeInit?: (plugin: TheSuperSonicPlugin) => void;
    onAfterInit?: (plugin: TheSuperSonicPlugin) => void;
    /** You can `return false` inside your hook, it will cancel rendering */
    onBeforeRender?: (plugin: TheSuperSonicPlugin) => void | undefined | boolean;
    onAfterRender?: (plugin: TheSuperSonicPlugin) => void;
    onBeforeResize?: (plugin: TheSuperSonicPlugin) => void;
    onAfterResize?: (plugin: TheSuperSonicPlugin) => void;
};
export type Render = {
    useActiveDrivers: boolean;
};
