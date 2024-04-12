import type { Constructor } from './Animation.types'

export class Animation {
  element: HTMLElement

  constructor({ element }: Constructor) {
    this.element = element
  }
}
