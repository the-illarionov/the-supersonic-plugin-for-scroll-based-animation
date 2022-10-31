import TheSupersonicPluginForScrollBasedAnimation from "../../src-lib/main"

import "./clipboard"
import "./open-source"
//import "./links"
import "./mobile-menu"

const config = {
	drivers: {
		"example-1-driver": {
			properties: {
				translateX: {
					start: 0,
					end: 100,
					unit: "%",
					elements: [".example-1-element"],
				},
			},
		},
		"example-2-driver": {
			properties: {
				rotate: {
					start: 0,
					end: 360,
					unit: "deg",
					elements: [".example-2-element"],
				},
				scale: {
					start: 1,
					end: 1.5,
					elements: [".example-2-element"],
				},
			},
		},
		"example-3-driver": {
			properties: {
				translateX: {
					start: 0,
					end: -100,
					unit: "%",
					elements: [".example-3-element-1"],
				},
				scale: {
					start: 1,
					end: 0.5,
					elements: [".example-3-element-2"],
				},
				opacity: {
					start: 1,
					end: 0,
					elements: [".example-3-element-1", ".example-3-element-2"],
				},
			},
		},
		"example-4-driver-1": {
			properties: {
				translateX: {
					start: 0,
					end: -50,
					unit: "%",
					elements: [".example-4-element-1"],
				},
			},
		},
		"example-4-driver-2": {
			properties: {
				translateX: {
					start: 0,
					end: 50,
					unit: "%",
					elements: [".example-4-element-2"],
				},
				opacity: {
					start: 1,
					end: 0,
					elements: [".example-4-element-1", ".example-4-element-2"],
				},
			},
		},
		"example-5-driver": {
			properties: {
				translateX: {
					start: 0,
					end: 100,
					unit: "%",
					elements: [".example-5-element"],
				},
			},
		},

		"example-6-driver": {
			properties: {
				default: {
					translateX: {
						start: 0,
						end: 50,
						unit: "%",
						elements: [".example-6-element"],
					},
					opacity: {
						start: 1,
						end: 0.5,
						elements: [".example-6-element"],
					},
				},
				"(max-width: 1024px)": {
					translateX: {
						start: 0,
						end: 20,
						unit: "%",
						elements: [".example-6-element"],
					},
					opacity: {
						start: 1,
						end: 0.5,
						elements: [".example-6-element"],
					},
				},
			},
		},
		"example-7-driver": {
			properties: {
				default: {
					translateX: {
						start: 0,
						end: -20,
						unit: "%",
						elements: [".example-7-element"],
					},
				},
				"(max-width: 1024px)": {
					opacity: {
						start: 1,
						end: 0,
						elements: [".example-7-element"],
					},
				},
			},
		},
		"example-8-driver": {
			hooks: {
				onInit(driver) {
					driver.data.easedProgress = 0
				},
				onBeforeRender(driver) {
					let delta = (driver.progress - driver.data.easedProgress) * 0.05

					if (Math.abs(delta) > 0.0001) driver.progress = driver.data.easedProgress += delta
				},
			},
			properties: {
				rotate: {
					start: 0,
					end: 360,
					unit: "deg",
					elements: [".example-8-element"],
				},
			},
		},

		"example-9-driver": {
			properties: {
				translateY: {
					start: 0,
					end: 300,
					unit: "px",
					elements: [".example-9-element-1", ".example-9-element-2", ".example-9-element-3"],
				},
			},
		},
		"example-11-driver": {
			properties: {
				translateY: {
					hooks: {
						onInit(property) {
							const element = document.querySelector(".example-11-element")
							property.data = {
								element,
								elementHeight: element.clientHeight,
								windowHeight: window.innerHeight,
							}
						},
						onUpdateLimits(property) {
							property.data.elementHeight = property.data.element.clientHeight
							property.data.windowHeight = window.innerHeight
							property.render()
							TheSupersonicPluginForScrollBasedAnimation.Element.instances
								.get(".example-11-element")
								.render()
						},
					},
					start(property) {
						return -property.data.elementHeight - 50
					},
					end(property) {
						return property.data.windowHeight - property.data.elementHeight
					},
					unit: "px",
					elements: [".example-11-element"],
				},
			},
		},
	},
	elements: {
		".example-9-element-2": {
			hooks: {
				onAddProperty(element, property) {
					const _property = { ...property }
					const x = _property.driver.progress
					const result = x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2

					_property.value *= result
					element.properties.set(_property.cssProperty, _property)
				},
			},
		},
		".example-9-element-3": {
			hooks: {
				onAddProperty(element, property) {
					const _property = { ...property }
					const x = _property.driver.progress
					const result = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2

					_property.value *= result

					element.properties.set(_property.cssProperty, _property)
				},
			},
		},
	},

	options: {},
	events: {},
}

const scroller = new TheSupersonicPluginForScrollBasedAnimation(config)
import("./custom-element").then(({ init }) => {
	init(TheSupersonicPluginForScrollBasedAnimation, scroller)
})

window.scroller = scroller
window.TheSupersonicPluginForScrollBasedAnimation = TheSupersonicPluginForScrollBasedAnimation
