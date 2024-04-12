import { Constructor } from './Observer.types';

export declare class Observer {
    instance: IntersectionObserver;
    constructor({ observables, driverInstances, driverActiveInstances }: Constructor);
    uninit(): void;
}
