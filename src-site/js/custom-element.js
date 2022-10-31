import { Scene, WebGLRenderer, AnimationMixer, Color, sRGBEncoding, ACESFilmicToneMapping, AmbientLight } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import modelUrl from "../models/example.glb"

export function init(TheSupersonicPluginForScrollBasedAnimation, instance) {
	new TheSupersonicPluginForScrollBasedAnimation.Driver({
		id: "example-10-driver",
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

					driver.updateLimits()
					instance.observer.instance.observe(driver.helper.domElement)
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
	})
}
