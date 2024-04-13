import type { Animation } from './Animation'
import type { Driver } from './Driver'

export type Constructor = {
  id: string
  hooks: Hooks
  cssAnimation: CSSAnimation
  driver: Driver
  domElement: HTMLElement
}

export type Hooks = {
  onInit?: (animation: Animation) => void
  /** You can `return false` inside your hook, it will cancel rendering */
  onBeforeRender?: (animation: Animation) => void | undefined | boolean
  onAfterRender?: (animation: Animation) => void
}

type Configuration = |
  string |
  {
    name: string
    hooks: Hooks
  }

export type Selector = |
  string |
  {
    selector: string
    animations: Configuration[]
  }

export type Render = {
  driverProgress: number
}
