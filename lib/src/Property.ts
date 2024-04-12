import type { Driver } from './Driver'
import { toFixed } from './utils'
import type { Element } from './Element'
import type { Constructor, Hooks } from './Property.types'
import type { TheSuperSonicPlugin } from './TheSupersonicPlugin'

/**
 * The main purpose of Property is to translate this.driver.progress into CSS property
 */
export class Property {
  /** Corresponding Driver instance */
  driver: Driver
  /** Name of any valid CSS numeric property */
  cssProperty: string
  /** Consists of ${driver.id}---${cssProperty} */
  id: string
  /** Starting numeric value of property (can be a Function) */
  start: number | Function
  /** Ending numeric value of property (can be a Function) */
  end: number | Function
  /** Property hooks */
  hooks: Hooks
  /** Current value of property */
  value: number = -1
  /** You can store your custom data here to use between hooks */
  data = {}
  /** What should be added in the end of property value. If left blank, "" is added */
  unit: string
  /** Elements which are animated by this Property. Elements are added during creating Element instance */
  elements: Set<Element> = new Set()

  plugin: TheSuperSonicPlugin

  constructor({ driverId, cssProperty, start, end, plugin, unit = '', hooks = {} }: Constructor) {
    this.cssProperty = cssProperty
    this.start = start
    this.end = end
    this.unit = unit
    this.hooks = hooks
    this.plugin = plugin

    this.id = `${driverId}---${cssProperty}`
    this.driver = this.plugin.driverInstances.get(driverId)!

    this.plugin.propertyInstances.set(this.id, this)
    this.driver.properties.add(this)

    if (this.hooks.onInit)
      this.hooks.onInit(this)
  }

  /** Property calculates it's value depending on driver.progress and adds itself to all of the corresponding elements */
  render() {
    this.value = this.calculateValue()

    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this)

    console.log(`Property "${this.id}" starts rendering, value is ${this.value}`)

    for (const element of this.elements)
      element.addProperty(this)

    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this)

    console.log(`Property "${this.id}" finished rendering`)
  }

  /** Calculates value */
  calculateValue() {
    const start = this.start instanceof Function ? this.start(this) : this.start
    const end = this.end instanceof Function ? this.end(this) : this.end
    const value = this.driver.progress * (end - start) + start

    let precision = 2
    if (this.unit === 'px')
      precision = 1

    return toFixed(value, precision)
  }

  /** To allow user to hook to parent driver's updateLimits() */
  updateLimits() {
    if (this.hooks.onUpdateLimits)
      this.hooks.onUpdateLimits(this)
  }
}
