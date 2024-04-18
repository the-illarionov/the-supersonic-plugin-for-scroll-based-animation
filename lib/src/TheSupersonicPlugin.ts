import { Driver } from './Driver'
import { Observer } from './Observer'
import { debounce, generateId } from './utils'

import type { PluginConfiguration, PluginHooks, PluginRender } from './TheSupersonicPlugin.types'
import type { DriverConfiguration } from './Driver.types'

/**
 *
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 *
 * @example
 * const plugin = new TheSupersonicPlugin([
 *   {
 *      start: '.start',
 *      end: '.end',
 *      elements: ['.animatable-element']
 *   }
 * ]);
 *
 */
export class TheSupersonicPlugin {
  /** Unique id of this running instance. You explicitly define it or let plugin auto generate it */
  id: string
  /** Current window scrollY */
  scroll = 0

  /** Current screen height */
  screenHeight = 0

  /** Required to get all of the drivers render at once to stand on their first frame */
  renderedInitially: boolean = false

  /** Used to cancelAnimationFrame on 'uninit()' */
  rafId = 0

  /** Color of console messages in dev mode. It changes each frame to make it more convenient to visually separate frames */
  consoleColor = '#ffffff'

  /** IntersectionObserver instance */
  observer: Observer | null = null

  /** Debounced resize listener */
  onResize: EventListener | null = null
  /** You can store your custom data here to use between hooks */
  data: any = {}

  /** Make helper visible */
  debug: boolean

  hooks: PluginHooks = {}

  driverInstances: Map<string, Driver> = new Map()
  driverActiveInstances: Set<Driver> = new Set()

  constructor(drivers: DriverConfiguration[], configuration?: PluginConfiguration) {
    this.id = configuration?.id ?? generateId()
    this.hooks = configuration?.hooks ?? {}
    this.debug = configuration?.debug ?? false

    if (this.hooks?.onBeforeInit)
      this.hooks.onBeforeInit(this)

    // Initializing driver instances
    drivers.forEach((driverConfiguration) => {
      const id = driverConfiguration.id ?? generateId()

      const driver = new Driver({
        id,
        hooks: driverConfiguration.hooks,
        start: driverConfiguration.start,
        end: driverConfiguration.end,
        elements: driverConfiguration.elements,
        plugin: this,
      })
      this.driverInstances.set(id, driver)
    })

    this.updateLimits()

    // Creating IntersectionObserver, which handles "active" state on Driver instances
    const observables = Array.from(document.querySelectorAll<HTMLElement>(`[data-supersonic-type="helper"][data-supersonic-plugin-id="${this.id}"]`))
    this.observer = new Observer({
      observables,
      driverInstances: this.driverInstances,
    })

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

    console.log('Driver instances:', this.driverInstances)
  }

  /** Removes all of the plugin stuff (useful for SPA) */
  uninit() {
    for (const driver of this.driverInstances.values())
      driver.helper.uninit()

    this.driverInstances.clear()
    this.driverActiveInstances.clear()

    this.observer!.uninit()
    cancelAnimationFrame(this.rafId)

    window.removeEventListener('resize', this.onResize!)
  }

  /** Main rendering cycle. Active drivers are visible ones */
  render({ useActiveDrivers }: PluginRender) {
    this.updateScroll()

    if (this.hooks.onBeforeRender) {
      const onBeforeRenderReturn = this.hooks.onBeforeRender(this)

      if (typeof onBeforeRenderReturn === 'boolean' && !onBeforeRenderReturn)
        return false
    }

    const drivers = useActiveDrivers ? this.driverActiveInstances.values() : this.driverInstances.values()

    for (const driver of drivers) {
      driver.render({
        scroll: this.scroll,
        renderedInitially: this.renderedInitially,
        consoleColor: this.consoleColor,
      })
    }

    this.rafId = requestAnimationFrame(() => {
      this.render({ useActiveDrivers: true })
    })

    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this)

    if (import.meta.env.DEV) {
      const randomInt = ~~(Math.random() * 100000)
      this.consoleColor = `#${randomInt.toString(16).padStart(6, 'f')}`
    }
  }

  /** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
  updateLimits() {
    this.updateScreenHeight()
    this.updateScroll()

    for (const driver of this.driverInstances.values()) {
      driver.updateLimits({
        scroll: this.scroll,
        screenHeight: this.screenHeight,
      })
    }
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
}
