import { afterEach, expect, it, vi } from 'vitest'
import { Driver } from './Driver'

it('adds onBeforeInit hook', () => {
  const driver = new Driver({
    id: 'id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    hooks: {
      onBeforeInit(driver) {
        driver.data.foo = 'bar'
      },
    },
  })

  expect(driver.data.foo).toBe('bar')
})

it('adds onAfterInit hook', () => {
  const driver = new Driver({
    id: 'id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    hooks: {
      onAfterInit(driver) {
        driver.data.foo = 'bar'
      },
    },
  })

  expect(driver.data.foo).toBe('bar')
})

it('adds onBeforeRender hook', () => {
  const driver = new Driver({
    id: 'id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    hooks: {
      onBeforeRender(driver) {
        driver.data.foo = 'bar'
        return false
      },
      onAfterRender(driver) {
        driver.data.foo = 'foo'
      },
    },
  })

  driver.render({ scroll: 0, renderedInitially: false })

  expect(driver.data.foo).toBe('bar')
})

it('adds onAfterRender hook', () => {
  const driver = new Driver({
    id: 'id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    hooks: {
      onAfterRender(driver) {
        driver.data.foo = 'foo'
      },
    },
  })

  driver.render({ scroll: 0, renderedInitially: false })

  expect(driver.data.foo).toBe('foo')
})

it('adds onUpdateLimits hook', () => {
  const { start, end } = createStartAndEnd()

  const driver = new Driver({
    id: 'id',
    start,
    end,
    hooks: {
      onUpdateLimits(driver) {
        driver.data.foo = 'foo'
      },
    },
  })

  driver.updateLimits({ scroll: 0, screenHeight: 0 })

  expect(driver.data.foo).toBe('foo')
})

it('creates borders and tests "updateLimits"', () => {
  const { start, end } = createStartAndEnd()

  const driver = new Driver({
    id: 'id',
    start,
    end,
  })

  driver.updateLimits({ scroll: 100, screenHeight: 0 })

  expect(driver.start.top).toBe(200)
  expect(driver.end.top).toBe(1100)
})

it('creates helper and tests "updateLimits"', () => {
  const driver = new Driver({
    id: 'id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
  })

  driver.helper.updateLimits({ start: 500, end: 800, screenHeight: 1000 })

  expect(driver.helper.domElement.style.top).toBe('1500px')
  expect(driver.helper.domElement.style.height).toBe('300px')
})

it('renders and calculates progress', () => {
  const { start, end } = createStartAndEnd()

  const driver = new Driver({
    id: 'id',
    start,
    end,
  })

  driver.updateLimits({ scroll: 0, screenHeight: 0 })

  driver.render({
    scroll: 550,
    renderedInitially: false,
  })

  expect(driver.progress).toBe(0.5)
})

it('reports an error if element is not found', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new Driver({
      id: 'id',
      start: {} as HTMLElement,
      end: {} as HTMLElement,
      elements: ['.foo'],
    })
  }).toThrowError('Can\'t find element ".foo"')
})

it('warns in console if element hasn\'t animations', () => {
  const { animatableElement } = createAnimatableElement()
  animatableElement.getAnimations = vi.fn(() => ([]))

  const consoleSpy = vi.spyOn(console, 'warn')

  // eslint-disable-next-line no-new
  new Driver({
    id: 'id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    elements: ['.animatable-element'],
  })

  expect(consoleSpy).toHaveBeenCalledWith('Element \".animatable-element\" hasn\'t animations')
})

it('creates animations from simple config', () => {
  const { firstAnimation, secondAnimation } = createAnimatableElement(true)

  const driver = new Driver({
    id: 'driver-id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    elements: ['.animatable-element'],
  })

  expect(driver.animations.get(firstAnimation)).toBeTruthy()
  expect(driver.animations.get(secondAnimation)).toBeTruthy()
})

it('creates only specified animations', () => {
  const { firstAnimation, secondAnimation } = createAnimatableElement(true)

  const driver = new Driver({
    id: 'driver-id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    elements: [{
      selector: '.animatable-element',
      animations: ['first-animation'],
    }],
  })

  expect(driver.animations.get(firstAnimation)).toBeTruthy()
  expect(driver.animations.get(secondAnimation)).toBeFalsy()
})

it('adds onInit hook to animation', () => {
  const { firstAnimation } = createAnimatableElement(true)

  const driver = new Driver({
    id: 'driver-id',
    start: {} as HTMLElement,
    end: {} as HTMLElement,
    elements: [{
      selector: '.animatable-element',
      animations: [{
        name: 'first-animation',
        hooks: {
          onInit(animation) {
            animation.data.foo = 'bar'
          },
        },
      }],
    }],
  })

  expect(driver.animations.get(firstAnimation)?.data.foo).toBe('bar')
})

it('renders animation', () => {
  const { firstAnimation } = createAnimatableElement(true)
  const { start, end } = createStartAndEnd()

  const driver = new Driver({
    id: 'driver-id',
    start,
    end,
    elements: ['.animatable-element'],
  })

  driver.updateLimits({ scroll: 0, screenHeight: 1000 })

  driver.render({ scroll: 550, renderedInitially: false })

  expect(driver.animations.get(firstAnimation)?.cssAnimation.currentTime).toBe(5000)
})

it('adds onBeforeRender hook to animation', () => {
  const { firstAnimation } = createAnimatableElement(true)
  const { start, end } = createStartAndEnd()

  const driver = new Driver({
    id: 'driver-id',
    start,
    end,
    elements: [{
      selector: '.animatable-element',
      animations: [{
        name: 'first-animation',
        hooks: {
          onBeforeRender(animation) {
            animation.data.foo = 'bar'

            return false
          },
          onAfterRender(animation) {
            animation.data.foo = 'foo'
          },
        },
      }],
    }],
  })

  driver.updateLimits({ scroll: 0, screenHeight: 1000 })

  driver.render({ scroll: 550, renderedInitially: false })

  expect(driver.animations.get(firstAnimation)?.data.foo).toBe('bar')
})

afterEach(() => {
  document.body.innerHTML = ''
})

function createStartAndEnd() {
  const start = document.createElement('div')
  const end = document.createElement('div')

  // @ts-expect-error not full implementation of DOMRect
  start.getBoundingClientRect = vi.fn(() => ({
    top: 100,
  }))

  // @ts-expect-error not full implementation of DOMRect
  end.getBoundingClientRect = vi.fn(() => ({
    top: 1000,
  }))

  return { start, end }
}

function createAnimatableElement(withAnimations = false) {
  const animatableElement = document.createElement('div')
  animatableElement.classList.add('animatable-element')
  document.body.appendChild(animatableElement)

  if (withAnimations) {
  // @ts-expect-error not full implementation of Animation
    animatableElement.getAnimations = vi.fn(() => ([
      {
        animationName: 'first-animation',
        currentTime: 0,
      },
      {
        animationName: 'second-animation',
        currentTime: 0,
      },
    ]))
  }

  const firstAnimation = 'driver-id---.animatable-element---0---first-animation'
  const secondAnimation = 'driver-id---.animatable-element---0---second-animation'

  return {
    animatableElement,
    firstAnimation,
    secondAnimation,
  }
}
