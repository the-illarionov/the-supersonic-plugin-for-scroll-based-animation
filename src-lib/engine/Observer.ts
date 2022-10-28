import { Driver } from "./Driver"
import { Globals } from "../singletons/Globals"
import { throwError } from "../singletons/Helpers"

export class Observer {
	instance: IntersectionObserver

	constructor(observables: HTMLElement[]) {
		this.instance = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const target = entry.target as HTMLElement
					const driverId = target.dataset.supersonicDriver!
					const driver = Driver.instances.get(driverId)

					if (!driver) {
						throwError(`Observer can't find driver "${driverId}"`)
						return
					}

					if (entry.isIntersecting) {
						driver.activate()
					} else {
						driver.deactivate()
					}
				})
			},
			{
				rootMargin: Globals.config.options!.observerRootMargin,
			}
		)

		observables.forEach((observable) => {
			this.instance.observe(observable)
		})
	}

	uninit() {
		this.instance.disconnect()
	}
}
