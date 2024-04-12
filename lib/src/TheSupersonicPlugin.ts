/* import { Globals, devGlobals } from './singletons/Globals' */
import { Driver } from './Driver'
import { Property } from './Property'
import { Element } from './Element'
import { Observer } from './Observer'
import { debounce } from './utils'

import type { Configuration, Hooks, Render } from './TheSupersonicPlugin.types'

/**
 *
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 *
 * @example
 * const plugin = new TheSuperSonicPlugin({
 *  // config
 * });
 *
 */
export class TheSuperSonicPlugin {
  /** Current window scrollY */
  scroll = 0

  /** Current screen height */
  screenHeight = 0

  /** Required to get all of the drivers render at once to stand on their first frame */
  renderedInitially: boolean = false

  hooks: Hooks = {}

  /** IntersectionObserver instance */
  observer: Observer | null = null

  /** Debounced resize listener */
  onResize: EventListener | null = null

  constructor({ drivers, hooks = {}, elements = {} }: Configuration) {
    this.hooks = hooks

    if (this.hooks?.onBeforeInit)
      this.hooks.onBeforeInit(this)

    // Initializing instances
    Driver.init({ drivers, plugin: this })
    Property.init({ drivers })
    Element.init({ drivers, elements, plugin: this })

    this.updateLimits()

    // Creating IntersectionObserver, which handles "active" state on Driver instances
    const observables = Array.from(document.querySelectorAll<HTMLElement>('[data-supersonic-type="helper"]'))
    this.observer = new Observer(observables)

    // Adding event listener for resize
    const resize = () => {
      if (this.hooks?.onBeforeResize)
        this.hooks.onBeforeResize(this)

      this.updateLimits()
      this.render({ useActiveDrivers: false })

      if (this.hooks.onAfterResize)
        this.hooks.onAfterResize(this)
    }
    this.onResize = debounce(resize, 250)
    window.addEventListener('resize', this.onResize)

    this.render({ useActiveDrivers: false })
    this.renderedInitially = true

    if (this.hooks?.onAfterInit)
      this.hooks.onAfterInit(this)

    console.log('Driver instances:', Driver.instances)
    console.log('Property instances:', Property.instances)
    console.log('Element instances:', Element.instances)
  }

  /** Removes all of the plugin stuff (useful for SPA) */
  uninit() {
    Driver.uninit()
    Property.uninit()
    Element.uninit()
    this.observer!.uninit()

    window.removeEventListener('resize', this.onResize!)
  }

  /** Main rendering cycle. Active drivers are visible ones. On initial plugin load all of the drivers must be rendered in their initial stage, so "useActiveDrivers: false" */
  render({ useActiveDrivers }: Render) {
    this.updateScroll()

    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this)

    Driver.render({ useActiveDrivers, plugin: this })
    Element.render()

    requestAnimationFrame(() => {
      this.render({ useActiveDrivers: true })
    })

    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this)
  }

  /** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
  updateLimits() {
    this.updateScreenHeight()
    this.updateScroll()
    Driver.updateLimits()
  }

  updateScroll() {
    this.scroll = window.scrollY || document.documentElement.scrollTop
  }

  /** Dirty hack for calculating screen height. We can't just use "window.innerHeight" because it "jumps" on mobile phones when you scroll and toolbar collapses */
  updateScreenHeight() {
    const styles: { [key: string]: string } = {
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100vh',
      width: '1px',
      zIndex: '-1',
      visibility: 'hidden',
    }
    const helper = document.createElement('div')
    for (const property in styles)
      helper.style.setProperty(property, styles[property])

    document.body.appendChild(helper)
    this.screenHeight = helper.clientHeight
    helper.remove()
  }

  static Driver = Driver
  static Property = Property
  static Element = Element
}
