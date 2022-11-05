import { Globals, devGlobals } from "../singletons/Globals"
import { Driver } from "../engine/Driver"
import { Property } from "../engine/Property"
import { Element } from "../engine/Element"
import { Observer } from "../engine/Observer"

/**
 * Main class handling all of the logic. To initialize the plugin, you create a new instance of this class
 */
export class TheSuperSonicPluginForScrollBasedAnimation {
	/** IntersectionObserver instance */
	observer: Observer | null = null
	/** Debounced window.resize listener */
	resizeWrapper: Function | null = null

	constructor(config: MainConfiguration) {
		Globals.initConfig(config)

		this.initInstances()
		this.updateLimits()
		this.initObserver()
		this.addEventListeners()

		this.render({ useActiveDrivers: false })
		Globals.renderedInitially = true

		if (Globals.config.hooks?.onInit) Globals.config.hooks.onInit(this)

		if (devGlobals.showConsole) {
			console.log("Driver instances:", Driver.instances)
			console.log("Property instances:", Property.instances)
			console.log("Element instances:", Element.instances)
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

			if (hooks.onBeforeRender) hooks.onBeforeRender()

			Driver.render({ useActiveDrivers })
			Element.render()

			Globals.rafId = requestAnimationFrame(() => {
				this.render({ useActiveDrivers: true })
			})

			if (hooks.onAfterRender) hooks.onAfterRender()
			if (!devGlobals.isProduction) devGlobals.updateConsoleBg()
		}
	}

	/** Updates global scroll and driver DOM elements top offset. Called once on page load and each time after window.resize */
	updateLimits() {
		this.updateScroll()
		Driver.updateLimits()

		if (Globals.config.hooks!.onUpdateLimits) Globals.config.hooks!.onUpdateLimits()
	}

	/** Updates global scroll */
	updateScroll() {
		Globals.scroll =
			window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
	}

	/** Add event listeners */
	addEventListeners() {
		this.resizeWrapper = debounce(() => {
			this.updateLimits()
			this.render({ useActiveDrivers: false })
		})

		window.addEventListener("resize", this.onResize.bind(this))
	}

	/** Removes event listeners */
	removeEventListeners() {
		window.removeEventListener("resize", this.onResize)
	}

	/** Debounced window.resize listener */
	onResize() {
		this.resizeWrapper!()
	}

	static Driver = Driver
	static Property = Property
	static Element = Element
	static Globals = Globals
}

function debounce(func: Function) {
	let timer: any
	return () => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			// @ts-ignore
			func.apply(this)
		}, 500)
	}
}
