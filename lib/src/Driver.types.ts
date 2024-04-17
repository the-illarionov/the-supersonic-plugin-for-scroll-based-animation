import type { Driver } from './Driver'
import type { Selector as AnimationSelector } from './Animation.types'
import type { TheSupersonicPlugin } from './TheSupersonicPlugin'

export type Constructor = {
  id: string
  hooks?: Hooks
  start: HTMLElement | null
  end: HTMLElement | null
  elements?: AnimationSelector[]
  plugin: TheSupersonicPlugin
}

export type Render = {
  scroll: number
  renderedInitially: boolean
  consoleColor?: string
}

export type CalculateProgress = {
  scroll: number
  start: number
  end: number
}

export type Hooks = {
  onBeforeInit?: (object: { driver: Driver }) => void
  onAfterInit?: (object: { driver: Driver }) => void
  /** You can `return false` inside your hook, it will cancel rendering */
  onBeforeRender?: (object: { driver: Driver }) => void | undefined | boolean
  onAfterRender?: (object: { driver: Driver }) => void
  onActivation?: (object: { driver: Driver }) => void
  onDeactivation?: (object: { driver: Driver }) => void
  onUpdateLimits?: (object: { driver: Driver }) => void
}

export type Configuration = {
  [id: string]: {
    start: HTMLElement | null
    end: HTMLElement | null
    elements?: AnimationSelector[]
    hooks?: Hooks
  }
}

export type BorderConstructor = {
  domElement: HTMLElement | null
  driver: Driver
  type: 'start' | 'end'
}

export type HelperConstructor = {
  id: string
  pluginId: string
  debug?: boolean
}

export type UpdateLimits = {
  scroll: number
  screenHeight: number
}

export type BorderUpdateLimits = {
  scroll: number
  screenHeight: number
}

export type HelperUpdateLimits = {
  top: number
  height: number
}
