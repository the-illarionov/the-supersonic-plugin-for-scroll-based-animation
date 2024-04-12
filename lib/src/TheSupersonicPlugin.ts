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

  rafId = 0

  hooks: Hooks = {}

  consoleColor = '#ffffff'

  /** IntersectionObserver instance */
  observer: Observer | null = null

  /** Debounced resize listener */
  onResize: EventListener | null = null

  /** All Driver instances */
  driverInstances: Map<string, Driver> = new Map()
  /** All active Driver instances */
  driverActiveInstances: Set<Driver> = new Set()

  propertyInstances: Map<string, Property> = new Map()

  elementInstances: Map<string, Element> = new Map()
  /** Element instances which are being animated right now */
  elementActiveInstances: Set<Element> = new Set()

  constructor({ drivers, hooks = {}, elements = {} }: Configuration) {
    this.hooks = hooks

    if (this.hooks?.onBeforeInit)
      this.hooks.onBeforeInit(this)

    // Initializing driver instances
    for (const id in drivers) {
      new Driver({
        id,
        hooks: drivers[id].hooks,
        plugin: this,
        start: drivers[id].start,
        end: drivers[id].end,
      })
    }

    // Initializing properties
    for (const driverId in drivers) {
      if ('properties' in drivers[driverId]) {
        const properties = drivers[driverId].properties

        for (const cssProperty in properties) {
          const data = properties[cssProperty]

          new Property({
            driverId,
            cssProperty,
            start: data.start,
            end: data.end,
            unit: data.unit,
            hooks: data.hooks,
            plugin: this,
          })
        }
      }
    }

    // Initializing elements
    for (const driverId in drivers) {
      const driver = this.driverInstances.get(driverId)!

      const properties = drivers[driverId].properties
      for (const cssProperty in properties) {
        const property = this.propertyInstances.get(`${driverId}---${cssProperty}`)!

        for (const selector of properties[cssProperty].elements!) {
          let element = this.elementInstances.get(selector)
          if (!element) {
            let hooks: Hooks | undefined
            if (elements && elements[selector] && elements[selector].hooks)
              hooks = elements[selector].hooks
            element = new Element({ id: selector, hooks, plugin: this })
          }
          driver.elements.add(element)
          property.elements.add(element)
        }
      }
    }

    this.updateLimits()

    // Creating IntersectionObserver, which handles "active" state on Driver instances
    const observables = Array.from(document.querySelectorAll<HTMLElement>('[data-supersonic-type="helper"]'))
    this.observer = new Observer({ observables, plugin: this })

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
    console.log('Property instances:', this.propertyInstances)
    console.log('Element instances:', this.elementInstances)
  }

  /** Removes all of the plugin stuff (useful for SPA) */
  uninit() {
    for (const driver of this.driverInstances.values())
      driver.helper.uninit()

    this.driverInstances.clear()
    this.propertyInstances.clear()
    this.elementInstances.clear()

    this.observer!.uninit()
    cancelAnimationFrame(this.rafId)

    window.removeEventListener('resize', this.onResize!)
  }

  /** Main rendering cycle. Active drivers are visible ones. On initial plugin load all of the drivers must be rendered in their initial stage, so "useActiveDrivers: false" */
  render({ useActiveDrivers }: Render) {
    this.updateScroll()

    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this)

    // Rendering drivers
    const drivers = useActiveDrivers ? this.driverActiveInstances.values() : this.driverInstances.values()

    for (const driver of drivers) {
      if (!this.renderedInitially)
        driver.initialDistanceToScroll = driver.end.top - this.scroll
      driver.render()
    }

    // Rendering elements
    for (const element of this.elementActiveInstances.values())
      element.render()

    this.elementActiveInstances.clear()

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

    for (const driver of this.driverInstances.values())
      driver.updateLimits()
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
