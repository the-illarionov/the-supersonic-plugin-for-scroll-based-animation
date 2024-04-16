import { Constructor } from './Observer.types';

export declare class Observer {
    instance: IntersectionObserver;
    constructor({ observables, driverInstances }: Constructor);
    uninit(): void;
}
