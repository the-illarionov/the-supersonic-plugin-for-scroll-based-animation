import { expect, it } from 'vitest'

import { Animation } from './Animation'
import type { Driver } from './Driver'

it('adds onInit hook', () => {
  const animation = new Animation({
    id: 'animation-id',
    driver: {} as Driver,
    hooks: {
      onInit(animation) {
        animation.data.foo = 'bar'
      },
    },
    cssAnimation: {} as CSSAnimation,
    domElement: {} as HTMLElement,
  })

  expect(animation.data.foo).toBe('bar')
})

it('renders', () => {
  const animation = new Animation({
    id: 'animation-id',
    driver: {} as Driver,
    hooks: {},
    cssAnimation: { currentTime: 0 } as CSSAnimation,
    domElement: {} as HTMLElement,
  })

  animation.render({ driverProgress: 0.1234 })

  expect(animation.cssAnimation.currentTime).toBe(1234)
})

it('adds onBeforeRender hook', () => {
  const animation = new Animation({
    id: 'animation-id',
    driver: {} as Driver,
    hooks: {
      onBeforeRender(animation) {
        animation.data.foo = 'bar'
        return false
      },
    },
    cssAnimation: { currentTime: 0 } as CSSAnimation,
    domElement: {} as HTMLElement,
  })

  animation.render({ driverProgress: 0.1234 })

  expect(animation.data.foo).toBe('bar')
  expect(animation.cssAnimation.currentTime).toBe(0)
})

it('manually sets animation.currentTime', () => {
  const animation = new Animation({
    id: 'animation-id',
    driver: {} as Driver,
    hooks: {
      onBeforeRender() {
        return 100
      },
    },
    cssAnimation: { currentTime: 0 } as CSSAnimation,
    domElement: {} as HTMLElement,
  })

  animation.render({ driverProgress: 0.1234 })

  expect(animation.cssAnimation.currentTime).toBe(100)
})

it('adds onAfterRender hook', () => {
  const animation = new Animation({
    id: 'animation-id',
    driver: {} as Driver,
    hooks: {
      onAfterRender(animation) {
        animation.data.foo = 'bar'
      },
    },
    cssAnimation: {} as CSSAnimation,
    domElement: {} as HTMLElement,
  })

  animation.render({ driverProgress: 0.1234 })

  expect(animation.data.foo).toBe('bar')
})
