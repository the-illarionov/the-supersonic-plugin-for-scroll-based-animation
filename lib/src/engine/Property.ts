import { Driver } from "./Driver"
import { Element } from "./Element"
import { devGlobals } from "../singletons/Globals"
import { supersonicToFixed } from "../singletons/Helpers"

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
	hooks: PropertyHooks
	/** Current value of property */
	value: number = -1
	/** You can store your custom data here to use between hooks */
	data = {}
	/** What should be added in the end of property value. If left blank, "" is added */
	unit: string
	/** Elements which are animated by this Property. Elements are added during creating Element instance */
	elements: Set<Element> = new Set()

	constructor({ driverId, cssProperty, start, end, unit, hooks }: PropertyConstructor) {
		this.cssProperty = cssProperty
		this.start = start
		this.end = end
		this.unit = unit ?? ""
		this.hooks = hooks ?? {}

		this.id = `${driverId}---${cssProperty}`
		this.driver = Driver.instances.get(driverId)!

		Property.instances.set(this.id, this)
		this.driver.properties.add(this)

		if (this.hooks.onInit) this.hooks.onInit(this)
	}

	/** Property calculates it's value depending on driver.progress and adds itself to all of the corresponding elements */
	render() {
		this.value = this.calculateValue()

		if (this.hooks.onBeforeRender) this.hooks.onBeforeRender(this)
		if (devGlobals.showConsole) {
			console.log(`%c	Property "${this.id}" starts rendering, value is ${this.value}`, devGlobals.consoleStyles)
		}

		for (let element of this.elements) {
			element.addProperty(this)
		}

		if (this.hooks.onAfterRender) this.hooks.onAfterRender(this)

		if (devGlobals.showConsole) {
			console.log(`%c	/Property "${this.id}" finished rendering`, devGlobals.consoleStyles)
		}
	}

	/** Calculates value */
	calculateValue() {
		let start = this.start instanceof Function ? this.start(this) : this.start
		let end = this.end instanceof Function ? this.end(this) : this.end
		const value = this.driver.progress * (end - start) + start

		let precision = 2
		if (this.unit === "px") precision = 1

		return supersonicToFixed(value, precision)
	}

	/** To allow user to hook to parent driver's updateLimits() */
	updateLimits() {
		if (this.hooks.onUpdateLimits) this.hooks.onUpdateLimits(this)
	}

	//
	//
	// static properties
	/** All Property instances */
	static instances: Map<string, Property> = new Map()

	//
	//
	// static methods
	/** Initialize Property instances with check for mediaQueries */
	static init({ drivers }: MainConfiguration) {
		for (let driverId in drivers) {
			if ("properties" in drivers[driverId]) {
				if ("default" in drivers[driverId].properties) {
					const rules = Object.keys(drivers[driverId].properties)
					let match = "default"
					for (let rule of rules) {
						if (rule !== "default" && matchMedia(rule).matches) match = rule
					}
					drivers[driverId].properties = drivers[driverId].properties[match]
				}

				let properties = drivers[driverId].properties

				for (let cssProperty in properties) {
					const data = properties[cssProperty]

					new Property({
						driverId,
						cssProperty,
						start: data.start,
						end: data.end,
						unit: data.unit,
						hooks: data.hooks,
					})
				}
			}
		}
	}

	/** Uninitialize Property instances */
	static uninit() {
		Property.instances.clear()
	}
}
