import type { TheSupersonicPlugin } from './TheSupersonicPlugin'

export type PluginConfiguration = {
  id?: string
  hooks?: PluginHooks
  debug?: boolean
}

export type PluginHooks = {
  onBeforeInit?: (plugin: TheSupersonicPlugin) => void
  onAfterInit?: (plugin: TheSupersonicPlugin) => void

  /** You can `return false` inside your hook, it will cancel rendering */
  onBeforeRender?: (plugin: TheSupersonicPlugin) => void | undefined | boolean
  onAfterRender?: (plugin: TheSupersonicPlugin) => void

  onBeforeResize?: (plugin: TheSupersonicPlugin) => void
  onAfterResize?: (plugin: TheSupersonicPlugin) => void
}

export type PluginRender = {
  useActiveDrivers: boolean
}
