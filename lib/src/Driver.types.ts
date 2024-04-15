import type { Driver } from './Driver'
import type { Selector as AnimationSelector } from './Animation.types'

export type Constructor = {
  id: string
  hooks?: Hooks
  start: HTMLElement | null
  end: HTMLElement | null
  elements?: AnimationSelector[]
  pluginId: string
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
  onBeforeInit?: (driver: Driver) => void
  onAfterInit?: (driver: Driver) => void
  /** You can `return false` inside your hook, it will cancel rendering */
  onBeforeRender?: (driver: Driver) => void | undefined | boolean
  onAfterRender?: (driver: Driver) => void
  onActivation?: (driver: Driver) => void
  onDeactivation?: (driver: Driver) => void
  onUpdateLimits?: ({ driver, scroll, screenHeight }: { driver: Driver, scroll: number, screenHeight: number }) => void
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
