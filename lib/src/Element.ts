import type { Driver } from './Driver'
import type { Property } from './Property'

import type { Constructor, Hooks } from './Element.types'
import type { TheSuperSonicPlugin } from './TheSupersonicPlugin'

/**
 * The main purpose of Element is to track down DOM elements and apply CSS properties to them. Element doesn't know anything about Driver or Property
 */
export class Element {
  /** CSS selector. You can have different CSS selectors for same element and they will be considered as separate instances of Element */
  id: string
  /** Normally, one Element instance goes for one DOM element, but you can have multiple DOM elements with same selector, so it is an Array */
  domElements: Array<HTMLElement>
  /** Element hooks */
  hooks: Hooks
  /** You can store your custom data here to use between hooks */
  data = {}
  /** List of added Property instances */
  properties: Map<string, Property> = new Map()
  /** In case of translate presence we need to keep them */
  translate3d: {
    [key: string]: string
  } = {
      translateX: '0',
      translateY: '0',
      translateZ: '0',
    }

  plugin: TheSuperSonicPlugin

  constructor({ id, hooks, plugin }: Constructor) {
    this.id = id
    this.plugin = plugin
    this.hooks = hooks ?? {}

    // Initializing domElements
    this.domElements = Array.from(document.querySelectorAll(this.id))
    if (this.domElements.length === 0)
      throw new Error(`Can't find Element: "${this.id}"`)
    this.domElements.forEach((domElement) => {
      domElement.setAttribute('data-supersonic-type', 'element')
      domElement.setAttribute('data-supersonic-element-id', this.id)
    })

    // Parsing initial translate values and save them
    const matrix = window.getComputedStyle(this.domElements[0]).transform
    if (matrix.includes('matrix')) {
      // @ts-expect-error matrix
      const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
      const matrixType = matrix.includes('3d') ? '3d' : '2d'

      this.translate3d = {
        translateX: `${matrixType === '2d' ? matrixValues[4] : matrixValues[12]}px`,
        translateY: `${matrixType === '2d' ? matrixValues[5] : matrixValues[13]}px`,
        translateZ: `${matrixType === '2d' ? '0' : matrixValues[14]}px`,
      }
    }

    this.plugin.elementInstances.set(this.id, this)

    if (this.hooks.onInit)
      this.hooks.onInit(this)
  }

  /** Main core of the whole plugin. Element parses it's "properties", normalizes them and applies */
  render() {
    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this)

    console.groupCollapsed(`%cElement "${this.id}" starts rendering`, `color: ${this.plugin.consoleColor}`)

    const flatProperties = this.calculateFlatProperties()

    for (const property in flatProperties) {
      this.domElements.forEach((domElement) => {
        domElement.style.setProperty(property, flatProperties[property])
      })
    }

    console.log(
				`Element "${this.id}" finished rendering, properties: ${JSON.stringify(flatProperties)}`,
    )
    console.groupEnd()

    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this)
  }

  /**
   * Called by Property.ts:56. On the first onload render it checks if property already exists and if it does, checks if driver of added property is closest to scroll. It prevents bugs when:
   * 1. You have multiple drivers animating same property
   * 2. You scroll
   * 3. You reload page
   */
  addProperty(property: Property) {
    if (!this.plugin.renderedInitially) {
      const currentProperty = this.properties.get(property.cssProperty)

      if (currentProperty) {
        const distanceNew = property.driver.initialDistanceToScroll
        const distanceOld = currentProperty.driver.initialDistanceToScroll
        const negativeNew = distanceNew < 0
        const negativeOld = distanceOld < 0

        let stopAdding = false

        if (!negativeNew && !negativeOld)
          stopAdding = distanceNew > distanceOld
        else if (!negativeNew && negativeOld)
          stopAdding = distanceNew < distanceOld

        if (stopAdding)
          return
      }
    }

    this.properties.set(property.cssProperty, property)

    if (this.hooks.onAddProperty)
      this.hooks.onAddProperty(this, property)
  }

  /** Turns multiple transform properties into single CSS "transform" value */
  calculateFlatProperties() {
    const flatProperties: {
      [key: string]: string
    } = {}

    let translateValuesDirty = false

    for (const property of this.properties.values()) {
      const { cssProperty, value, unit } = property
      const valueWithUnit = value + unit

      if (Element.translate3dKeys.includes(cssProperty)) {
        this.translate3d[cssProperty] = valueWithUnit
        translateValuesDirty = true
      }
      else if (cssProperty === 'scale') {
        flatTransformSecure(flatProperties)

        flatProperties.transform += `scale3d(${valueWithUnit}, ${valueWithUnit}, ${valueWithUnit}) `
      }
      else if (Element.transformKeys.includes(cssProperty)) {
        flatTransformSecure(flatProperties)

        flatProperties.transform += `${cssProperty}(${valueWithUnit}) `
      }
      else {
        flatProperties[cssProperty] = valueWithUnit
      }
    }

    if (translateValuesDirty) {
      flatTransformSecure(flatProperties)

      flatProperties.transform += `translate3d(${this.translate3d.translateX}, ${this.translate3d.translateY}, ${this.translate3d.translateZ}) `
    }

    return flatProperties
  }

  /** To allow user to hook to an initiator driver's updateLimits() */
  updateLimits(driver: Driver) {
    if (this.hooks.onUpdateLimits)
      this.hooks.onUpdateLimits(this, driver)
  }

  static transformKeys = [
    'perspective',
    'scaleX',
    'scaleY',
    'scale',
    'skewX',
    'skewY',
    'skew',
    'rotateX',
    'rotateY',
    'rotate',
  ]

  static translate3dKeys = ['translateX', 'translateY', 'translateZ']
}

function flatTransformSecure(properties: {
  [key: string]: string
}) {
  if (!properties.transform)
    properties.transform = ''
}
