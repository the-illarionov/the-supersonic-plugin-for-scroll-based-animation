import type { Constructor } from './Observer.types'

export class Observer {
  instance: IntersectionObserver

  constructor({ observables, driverInstances, driverActiveInstances }: Constructor) {
    this.instance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          const driverId = target.dataset.supersonicDriver!
          const driver = driverInstances.get(driverId)

          if (!driver)
            throw new Error(`Observer can't find driver "${driverId}"`)

          if (entry.isIntersecting) {
            driverActiveInstances.add(driver)
            driver.activate()
          }

					 else {
            driverActiveInstances.delete(driver)
            driver.deactivate()
          }
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
