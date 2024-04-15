import type { TheSuperSonicPlugin } from './TheSupersonicPlugin'
import type { Configuration as DriverConfiguration } from './Driver.types'

export type Configuration = {
  hooks?: Hooks
  drivers: DriverConfiguration
}

export type Hooks = {
  onBeforeInit?: (object: { plugin: TheSuperSonicPlugin }) => void
  onAfterInit?: (object: { plugin: TheSuperSonicPlugin }) => void

  /** You can `return false` inside your hook, it will cancel rendering */
  onBeforeRender?: (object: { plugin: TheSuperSonicPlugin }) => void | undefined | boolean
  onAfterRender?: (object: { plugin: TheSuperSonicPlugin }) => void

  onBeforeResize?: (object: { plugin: TheSuperSonicPlugin }) => void
  onAfterResize?: (object: { plugin: TheSuperSonicPlugin }) => void
}

export type Render = {
  useActiveDrivers: boolean
}
