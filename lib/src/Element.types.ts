import type { Element } from './Element'
import type { Driver } from './Driver'
import type { Property } from './Property'
import type { TheSuperSonicPlugin } from './TheSupersonicPlugin'

export type Hooks = {
  onInit?: (instance: Element) => any
  onBeforeRender?: (instance: Element) => any
  onAfterRender?: (instance: Element) => any
  onUpdateLimits?: (instance: Element, driver: Driver) => any
  onAddProperty?: (instance: Element, property: Property) => any
}

export type Constructor = {
  id: string
  plugin: TheSuperSonicPlugin
  hooks?: Hooks
}

export type Configuration = {
  [elementSelector: string]: {
    hooks?: Hooks
  }
}

export type ElementSelector = |
  string |
  {
    selector: string
    animations: string[]
  }
