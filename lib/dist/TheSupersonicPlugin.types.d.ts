import { Configuration as DriverConfiguration } from './Driver.types';
import { TheSupersonicPlugin } from './TheSupersonicPlugin';

export type Configuration = {
    drivers: DriverConfiguration;
    hooks?: Hooks;
    debug?: boolean;
};
export type Hooks = {
    onBeforeInit?: (object: {
        plugin: TheSupersonicPlugin;
    }) => void;
    onAfterInit?: (object: {
        plugin: TheSupersonicPlugin;
    }) => void;
    /** You can `return false` inside your hook, it will cancel rendering */
    onBeforeRender?: (object: {
        plugin: TheSupersonicPlugin;
    }) => void | undefined | boolean;
    onAfterRender?: (object: {
        plugin: TheSupersonicPlugin;
    }) => void;
    onBeforeResize?: (object: {
        plugin: TheSupersonicPlugin;
    }) => void;
    onAfterResize?: (object: {
        plugin: TheSupersonicPlugin;
    }) => void;
};
export type Render = {
    useActiveDrivers: boolean;
};
