import type { Driver } from './Driver'
import type { Selector as AnimationSelector } from './Animation.types'

export type Constructor = {
  id: string
  hooks?: Hooks
  start: HTMLElement | null
  end: HTMLElement | null
  elements: AnimationSelector[]
}

export type Render = {
  scroll: number
  renderedInitially: boolean
  consoleColor: string
}

export type CalculateProgress = {
  scroll: number
  start: number
  end: number
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
  [id: string]: {
    start: HTMLElement | null
    end: HTMLElement | null
    elements: AnimationSelector[]
    hooks?: Hooks
  }
}

export type BorderConstructor = {
  domElement: HTMLElement | null
  driver: Driver
  type: 'start' | 'end'
}

export type HelperConstructor = {
  driver: Driver
}

export type UpdateLimits = {
  scroll: number
  screenHeight: number
}

export type BorderUpdateLimits = {
  scroll: number
}

export type HelperUpdateLimits = {
  screenHeight: number
}
