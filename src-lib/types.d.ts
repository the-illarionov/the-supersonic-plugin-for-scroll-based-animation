type _Element = import("./engine/Element").Element

interface Globals {
	scroll: number
	screenHeight: number
	rafActive: boolean
	rafId: number
	renderedInitially: boolean
	config: MainConfiguration
	reset()
	initConfig(config: MainConfiguration)
}

interface MainConfiguration {
	options?: {
		observerRootMargin?: string
	}
	hooks?: MainHooks

	drivers: DriverConfiguration
	elements?: ElementConfiguration
}

interface MainHooks {
	onBeforeRender?()
	onAfterRender?()
	onUpdateLimits?()
	onInit?(instance: TheSuperSonicPluginForScrollBasedAnimation)
}

interface MainRender {
	useActiveDrivers: boolean
}

//
//
// Driver
interface DriverConfiguration {
	[driverId: string]: {
		properties: any
		hooks?: DriverHooks
	}
}

interface DriverHooks {
	onInit?(instance: Driver)
	onBeforeRender?(instance: Driver)
	onAfterRender?(instance: Driver)
	onActivation?(instance: Driver)
	onDeactivation?(instance: Driver)
	onUpdateLimits?(instance: Driver)
}

interface DriverConstructor {
	id: string
	hooks: DriverHooks
}

interface DriverBorderConstructor {
	domElement: HTMLElement
	selector: string
}

//
//
// Property
interface PropertyConfiguration {
	driverId: string
	start: number
	end: number
	unit?: string
	hooks?: PropertyHooks
	elements?: string[]
}
interface PropertyConstructor extends PropertyConfiguration {
	cssProperty: string
}

interface PropertyHooks {
	onInit?(instance: Property)
	onBeforeRender?(instance: Property)
	onAfterRender?(instance: Property)
	onUpdateLimits?(instance: Property)
}

//
//
// Element
interface ElementConstructor {
	id: string
	hooks?: ElementHooks
}

interface ElementConfiguration {
	[elementSelector: string]: {
		hooks?: ElementHooks
	}
}

interface ElementHooks {
	onInit?(instance: _Element)
	onBeforeRender?(instance: _Element)
	onAfterRender?(instance: _Element)
	onUpdateLimits?(instance: _Element, driver: Driver)
	onAddProperty?(instance: _Element, property: Property)
}

interface translate3d {
	translateX: string
	translateY: string
	translateZ: string
}

interface flattenedProperties {
	[key: string]: string
}
