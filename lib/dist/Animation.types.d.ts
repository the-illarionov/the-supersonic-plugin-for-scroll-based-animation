import { Driver } from './Driver';
import { Animation } from './Animation';

export type Constructor = {
    id: string;
    hooks: Hooks;
    cssAnimation: CSSAnimation;
    driver: Driver;
    domElement: HTMLElement;
};
export type Hooks = {
    onInit?: (animation: Animation) => void;
    /** You can `return false` inside your hook, it will cancel rendering. Or you can return a number, it will be an animation currentTime */
    onBeforeRender?: (animation: Animation) => void | undefined | boolean | number;
    onAfterRender?: (animation: Animation) => void;
};
type Configuration = string | {
    name: string;
    hooks: Hooks;
};
export type Selector = string | {
    selector: string;
    animations: Configuration[];
};
export type Render = {
    driverProgress: number;
};
export {};
