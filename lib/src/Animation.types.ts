import type { Animation } from './Animation'
import type { Driver } from './Driver'

export type AnimationConstructor = {
  id: string
  hooks: AnimationHooks
  cssAnimation: CSSAnimation
  driver: Driver
  domElement: HTMLElement
}

export type AnimationHooks = {
  onInit?: (animation: Animation) => void
  /** You can `return false` inside your hook, it will cancel rendering. Or you can return a number, it will be an animation currentTime */
  onBeforeRender?: (animation: Animation) => void | undefined | boolean | number
  onAfterRender?: (animation: Animation) => void
}

type AnimationConfiguration = |
  string |
  {
    name: string
    hooks: AnimationHooks
  }

export type ElementSelector = |
  string |
  {
    selector: string
    animations: AnimationConfiguration[]
  }

export type AnimationRender = {
  driverProgress: number
}
