import { Driver } from './Driver';
import { AnimationConstructor, AnimationHooks, AnimationRender } from './Animation.types';

export declare class Animation {
    id: string;
    cssAnimation: CSSAnimation;
    /** You can store your custom data here to use between hooks */
    data: any;
    /** Reference to linked `Driver` instance */
    driver: Driver;
    /** You can access domElement this animation is belongs to */
    domElement: HTMLElement;
    hooks: AnimationHooks;
    constructor({ id, cssAnimation, hooks, driver, domElement }: AnimationConstructor);
    render({ driverProgress }: AnimationRender): false | undefined;
}
