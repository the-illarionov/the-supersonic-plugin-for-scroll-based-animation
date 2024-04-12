import { Driver } from './Driver';

export type Constructor = {
    observables: HTMLElement[];
    driverInstances: Map<string, Driver>;
    driverActiveInstances: Set<Driver>;
};
