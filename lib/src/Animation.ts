import type { Constructor, Render } from './Animation.types'

export class Animation {
  id: string
  animation: CSSAnimation

  constructor({ id, animation }: Constructor) {
    this.id = id
    this.animation = animation
  }

  render({ driverProgress }: Render) {
    // как будто хук может вовзращать driverProgress
    this.animation.currentTime = driverProgress * 1000
  }
}
