import { Constructor, Render } from './Animation.types';

export declare class Animation {
    id: string;
    animation: CSSAnimation;
    constructor({ id, animation }: Constructor);
    render({ driverProgress }: Render): void;
}
