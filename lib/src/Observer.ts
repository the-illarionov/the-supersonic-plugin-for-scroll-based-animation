import type { Constructor } from './Observer.types'

export class Observer {
  instance: IntersectionObserver

  constructor({ observables, plugin }: Constructor) {
    this.instance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          const driverId = target.dataset.supersonicDriver!
          const driver = plugin.driverInstances.get(driverId)

          if (!driver)
            throw new Error(`Observer can't find driver "${driverId}"`)

          if (entry.isIntersecting)
            driver.activate()
					 else
            driver.deactivate()
        })
      },
    )

    observables.forEach((observable) => {
      this.instance.observe(observable)
    })
  }

  uninit() {
    this.instance.disconnect()
  }
}
