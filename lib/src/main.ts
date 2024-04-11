import { Globals, devGlobals } from './singletons/Globals'
import { Driver } from './engine/Driver'
import { Property } from './engine/Property'
import { Element } from './engine/Element'
import { Observer } from './engine/Observer'

/**
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 */
export class TheSuperSonicPluginForScrollBasedAnimation {
  /** IntersectionObserver instance */
  observer: Observer | null = null

  /** Debounced resize listener */
  onResize: EventListener | null = null

  constructor(config: MainConfiguration) {
    Globals.initConfig(config)

    this.initInstances()
    this.updateLimits()
    this.initObserver()
    this.addEventListeners()

    this.render({ useActiveDrivers: false })
    Globals.renderedInitially = true

    if (Globals.config.hooks?.onInit)
      Globals.config.hooks.onInit(this)

    if (devGlobals.showConsole) {
      console.log('Driver instances:', Driver.instances)
      console.log('Property instances:', Property.instances)
      console.log('Element instances:', Element.instances)
    }
  }

  /** Removes all of the plugin stuff (useful for SPA) */
  uninit() {
    Driver.uninit()
    Property.uninit()
    Element.uninit()

    this.removeEventListeners()
    this.observer!.uninit()
    this.observer = null

    Globals.reset()
  }

  /** Creates instances of Driver, Property and Element on plugin load */
  initInstances() {
    const drivers = Globals.config.drivers
    const elements = Globals.config.elements

    Driver.init({ drivers })
    Property.init({ drivers })
    Element.init({ drivers, elements })
  }

  /** Creates IntersectionObserver, which handles "active" state on Driver instances */
  initObserver() {
    const observables = Array.from(document.querySelectorAll<HTMLElement>('[data-supersonic-type="helper"]'))

    this.observer = new Observer(observables)
  }

  /** Main rendering cycle. Active drivers are visible ones. On initial plugin load all of the drivers must be rendered in their initial stage, so "useActiveDrivers: false" */
  render({ useActiveDrivers }: MainRender) {
    const hooks = Globals.config.hooks!

    if (Globals.rafActive) {
      this.updateScroll()

      if (hooks.onBeforeRender)
        hooks.onBeforeRender()

      Driver.render({ useActiveDrivers })
      Element.render()

      Globals.rafId = requestAnimationFrame(() => {
        this.render({ useActiveDrivers: true })
      })

      if (hooks.onAfterRender)
        hooks.onAfterRender()
      if (!devGlobals.isProduction)
        devGlobals.updateConsoleBg()
    }
  }

  /** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
  updateLimits() {
    this.updateScreenHeight()
    this.updateScroll()
    Driver.updateLimits()

    if (Globals.config.hooks!.onUpdateLimits)
      Globals.config.hooks!.onUpdateLimits()
  }

  /** Updates global scroll */
  updateScroll() {
    Globals.scroll
			= window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  }

  /** Dirty hack for calculating screen height. We can't just use "window.innerHeight" because it "jumps" on mobile phones when you scroll and toolbar collapses */
  updateScreenHeight() {
    const styles = {
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100vh',
      width: '1px',
      zIndex: '-1',
      visibility: 'hidden',
    }
    const helper = document.createElement('div')
    for (const property in styles) {
      // @ts-expect-error
      helper.style.setProperty(property, styles[property])
    }
    document.body.appendChild(helper)
    Globals.screenHeight = helper.clientHeight // it is a dirty hack because this line causes a reflow
    helper.remove()
  }

  /** Add event listeners */
  addEventListeners() {
    this.onResize = () => {
      this.updateLimits()
      this.render({ useActiveDrivers: false })
    }

    window.addEventListener('resize', this.onResize)
  }

  /** Removes event listeners */
  removeEventListeners() {
    window.removeEventListener('resize', this.onResize!)
  }

  static Driver = Driver
  static Property = Property
  static Element = Element
  static Globals = Globals
}
