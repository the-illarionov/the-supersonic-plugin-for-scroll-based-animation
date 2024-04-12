import { Driver } from './Driver'

export class Observer {
  instance: IntersectionObserver

  constructor(observables: HTMLElement[]) {
    this.instance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          const driverId = target.dataset.supersonicDriver!
          const driver = Driver.instances.get(driverId)

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
