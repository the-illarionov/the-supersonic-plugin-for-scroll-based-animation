import { Globals, devGlobals } from "../singletons/Globals"
import { throwError } from "../singletons/Helpers"
import { Driver } from "./Driver"
import { Property } from "./Property"

/**
 * The main purpose of Element is to track down DOM elements and apply CSS properties to them. Element doesn't know anything about Driver or Property
 */
export class Element {
	/** CSS selector. You can have different CSS selectors for same element and they will be considered as separate instances of Element */
	id: string
	/** Normally, one Element instance goes for one DOM element, but you can have multiple DOM elements with same selector, so it is an Array */
	domElements!: Array<HTMLElement>
	/** Element hooks */
	hooks: ElementHooks
	/** You can store your custom data here to use between hooks */
	data = {}
	/** List of added Property instances */
	properties: Map<string, Property> = new Map()
	/** In case of translate presence we need to keep them */
	translate3d: translate3d = {
		translateX: "0",
		translateY: "0",
		translateZ: "0",
	}

	constructor({ id, hooks }: ElementConstructor) {
		this.id = id
		this.hooks = hooks ?? {}

		this.initDomElements()
		this.saveInitialTranslate()

		Element.instances.set(this.id, this)

		if (this.hooks.onInit) this.hooks.onInit(this)
	}

	/** Parsing initial translate values and save them */
	saveInitialTranslate() {
		const matrix = window.getComputedStyle(this.domElements[0]).transform

		if (matrix.includes("matrix")) {
			// @ts-ignore
			const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ")
			const matrixType = matrix.includes("3d") ? "3d" : "2d"

			this.translate3d = {
				translateX: (matrixType === "2d" ? matrixValues[4] : matrixValues[12]) + "px",
				translateY: (matrixType === "2d" ? matrixValues[5] : matrixValues[13]) + "px",
				translateZ: (matrixType === "2d" ? "0" : matrixValues[14]) + "px",
			}
		}
	}

	/** Initializing DOM elements */
	initDomElements() {
		this.domElements = Array.from(document.querySelectorAll(this.id))
		if (this.domElements.length === 0) throwError(`Can't find Element: "${this.id}"`)
		this.domElements.forEach((domElement) => {
			domElement.setAttribute("data-supersonic-type", "element")
			domElement.setAttribute("data-supersonic-element-id", this.id)
		})
	}

	/** Main core of the whole plugin. Element parses it's "properties", normalizes them and applies */
	render() {
		if (this.hooks.onBeforeRender) this.hooks.onBeforeRender(this)

		if (devGlobals.showConsole) {
			console.log(`%cElement "${this.id}" starts rendering`, devGlobals.consoleStyles)
		}

		const flatProperties = this.calculateFlatProperties()

		for (let property in flatProperties) {
			this.domElements.forEach((domElement) => {
				domElement.style.setProperty(property, flatProperties[property])
			})
		}

		if (devGlobals.showConsole) {
			console.log(
				`%c/Element "${this.id}" finished rendering, properties: ${JSON.stringify(flatProperties)}`,
				devGlobals.consoleStyles
			)
		}

		if (this.hooks.onAfterRender) this.hooks.onAfterRender(this)
	}

	/**
	 * Called by Property.ts:56. On the first onload render it checks if property already exists and if it does, checks if driver of added property is closest to scroll. It prevents bugs when:
	 * 1. You have multiple drivers animating same property
	 * 2. You scroll
	 * 3. You reload page */
	addProperty(property: Property) {
		if (!Globals.renderedInitially) {
			const currentProperty = this.properties.get(property.cssProperty)

			if (currentProperty) {
				const distanceNew = property.driver.initialDistanceToScroll
				const distanceOld = currentProperty.driver.initialDistanceToScroll
				const negativeNew = distanceNew < 0 ? true : false
				const negativeOld = distanceOld < 0 ? true : false

				let stopAdding = false

				if (!negativeNew && !negativeOld) stopAdding = distanceNew > distanceOld
				else if (!negativeNew && negativeOld) stopAdding = distanceNew < distanceOld

				if (stopAdding) return
			}
		}

		this.properties.set(property.cssProperty, property)

		if (this.hooks.onAddProperty) this.hooks.onAddProperty(this, property)
	}

	/** Turns multiple transform properties into single CSS "transform" value */
	calculateFlatProperties() {
		const flatProperties: flattenedProperties = {}

		let translateValuesDirty = false

		for (let property of this.properties.values()) {
			const { cssProperty, value, unit } = property
			const valueWithUnit = value + unit

			if (Element.translate3dKeys.includes(cssProperty)) {
				this.translate3d[cssProperty as keyof translate3d] = valueWithUnit
				translateValuesDirty = true
			} else if (cssProperty === "scale") {
				flatTransformSecure(flatProperties)

				flatProperties.transform += `scale3d(${valueWithUnit}, ${valueWithUnit}, ${valueWithUnit}) `
			} else if (Element.transformKeys.includes(cssProperty)) {
				flatTransformSecure(flatProperties)

				flatProperties.transform += `${cssProperty}(${valueWithUnit}) `
			} else {
				flatProperties[cssProperty] = valueWithUnit
			}
		}

		if (translateValuesDirty) {
			flatTransformSecure(flatProperties)

			flatProperties.transform += `translate3d(${this.translate3d.translateX}, ${this.translate3d.translateY}, ${this.translate3d.translateZ}) `
		}

		return flatProperties
	}

	/** To allow user to hook to an initiator driver's updateLimits() */
	updateLimits(driver: Driver) {
		if (this.hooks.onUpdateLimits) this.hooks.onUpdateLimits(this, driver)
	}

	//
	//
	// static properties
	/** All Elements instances */
	static instances: Map<string, Element> = new Map()

	/** Element instances which are being animated right now */
	static activeInstances: Set<Element> = new Set()

	//
	//
	// static methods
	/** Initialize Element instances */
	static init({ drivers, elements }: MainConfiguration) {
		for (let driverId in drivers) {
			const driver = Driver.instances.get(driverId)!

			const properties = drivers[driverId].properties
			for (let cssProperty in properties) {
				const property = Property.instances.get(`${driverId}---${cssProperty}`)!

				for (let selector of properties[cssProperty].elements!) {
					let element = Element.instances.get(selector)
					if (!element) {
						let hooks: ElementHooks | undefined = undefined
						if (elements && elements[selector] && elements[selector].hooks) hooks = elements[selector].hooks
						element = new Element({ id: selector, hooks })
					}
					driver.elements.add(element)
					property.elements.add(element)
				}
			}
		}
	}

	/** Uninitialize Element instances */
	static uninit() {
		Element.instances.clear()
	}

	/** Render all of active Element instances */
	static render() {
		for (let element of Element.activeInstances.values()) {
			element.render()
		}

		Element.activeInstances.clear()
	}

	static transformKeys = [
		"perspective",
		"scaleX",
		"scaleY",
		"scale",
		"skewX",
		"skewY",
		"skew",
		"rotateX",
		"rotateY",
		"rotate",
	]

	static translate3dKeys = ["translateX", "translateY", "translateZ"]
}

function flatTransformSecure(properties: flattenedProperties) {
	if (!properties.transform) properties.transform = ""
}
