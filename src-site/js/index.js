import TheSupersonicPluginForScrollBasedAnimation from "../../src-lib/main"
import { Scene, WebGLRenderer, AnimationMixer, Color, sRGBEncoding, ACESFilmicToneMapping, AmbientLight } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import modelUrl from "../models/example.glb"

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
		"example-10-driver": {
			hooks: {
				onInit(driver) {
					const container = document.querySelector(".example-10-element")
					const scene = new Scene()
					const renderer = new WebGLRenderer({ antialias: true, canvas: container.querySelector("canvas") })
					const easedProgress = 0

					scene.background = new Color(0x79bde7)
					scene.add(new AmbientLight(0xc0d5ff, 0.3))

					renderer.setPixelRatio(window.devicePixelRatio)
					renderer.setSize(container.clientWidth, container.clientHeight)
					renderer.outputEncoding = sRGBEncoding
					renderer.toneMapping = ACESFilmicToneMapping

					const loader = new GLTFLoader()
					loader.loadAsync(modelUrl).then((gltf) => {
						const camera = gltf.cameras[0]
						camera.aspect = container.clientWidth / container.clientHeight
						camera.fov = 70
						camera.updateProjectionMatrix()

						const mixer = new AnimationMixer(gltf.scene)
						const action = mixer.clipAction(gltf.animations[0])
						action.play()

						driver.data = { container, scene, renderer, easedProgress, camera, mixer }

						scene.add(gltf.scene)
					})
				},
				onBeforeRender(driver) {
					let delta = (driver.progress - driver.data.easedProgress) * 0.05

					if (Math.abs(delta) > 0.00001) driver.progress = driver.data.easedProgress += delta
				},
				onAfterRender(driver) {
					if (driver.data.camera) {
						const { renderer, scene, camera } = driver.data
						driver.data.mixer.setTime(1.95 * driver.progress)
						renderer.render(scene, camera)
					}
				},
				onUpdateLimits(driver) {
					if (driver.data.camera) {
						const { container, camera, renderer, scene } = driver.data

						camera.aspect = container.clientWidth / container.clientHeight
						camera.updateProjectionMatrix()

						renderer.setSize(container.clientWidth, container.clientHeight)

						renderer.render(scene, camera)
					}
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

window.scroller = scroller
window.TheSupersonicPluginForScrollBasedAnimation = TheSupersonicPluginForScrollBasedAnimation
