import type { AnimationConstructor, AnimationHooks, AnimationRender } from './Animation.types'
import type { Driver } from './Driver'

export class Animation {
  id: string

  cssAnimation: CSSAnimation

  /** You can store your custom data here to use between hooks */
  data: any = {}

  /** Reference to linked `Driver` instance */
  driver: Driver

  /** You can access domElement this animation is belongs to */
  domElement: HTMLElement

  hooks: AnimationHooks

  constructor({ id, cssAnimation, hooks, driver, domElement }: AnimationConstructor) {
    this.id = id
    this.driver = driver
    this.cssAnimation = cssAnimation
    this.hooks = hooks
    this.domElement = domElement

    if (this.hooks.onInit)
      this.hooks.onInit(this)
  }

  render({ driverProgress }: AnimationRender) {
    let currentTime = driverProgress * 10000

    if (this.hooks.onBeforeRender) {
      const onBeforeRenderReturn = this.hooks.onBeforeRender(this)

      if (typeof onBeforeRenderReturn === 'number')
        currentTime = onBeforeRenderReturn

      else if (typeof onBeforeRenderReturn === 'boolean' && !onBeforeRenderReturn)
        return false
    }

    this.cssAnimation.currentTime = currentTime

    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this)
  }
}
