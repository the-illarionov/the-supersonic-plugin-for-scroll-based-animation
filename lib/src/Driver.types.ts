import type { Driver } from './Driver'
import type { TheSuperSonicPlugin } from './TheSupersonicPlugin'

export type Constructor = {
  id: string
  hooks?: Hooks
  plugin: TheSuperSonicPlugin
}

export type Hooks = {
  onBeforeInit?: (instance: Driver) => any
  onAfterInit?: (instance: Driver) => any
  onBeforeRender?: (instance: Driver) => any
  onAfterRender?: (instance: Driver) => any
  onActivation?: (instance: Driver) => any
  onDeactivation?: (instance: Driver) => any
  onUpdateLimits?: (instance: Driver) => any
}

export type Configuration = {
  properties: any
  hooks?: Hooks
}

export type Init = {
  drivers: {
    [id: string]: Configuration
  }
  plugin: TheSuperSonicPlugin
}

export type Render = {
  useActiveDrivers: boolean
  plugin: TheSuperSonicPlugin
}

export type BorderConstructor = {
  domElement: HTMLElement | null
  selector: string
  plugin: TheSuperSonicPlugin
}

export type HelperConstructor = {
  driver: Driver
  plugin: TheSuperSonicPlugin
}
