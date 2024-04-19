import { afterEach, expect, it, vi } from 'vitest'
import { TheSupersonicPlugin } from './TheSupersonicPlugin'

const IOObserver = vi.fn()
const IODisconnect = vi.fn()

it('adds onBeforeInit hook', () => {
  const plugin = new TheSupersonicPlugin(
    [{ ...driverSetup() }],
    {
      hooks: {
        onBeforeInit(plugin) {
          plugin.data.foo = 'bar'
        },
      },
    },
  )

  expect(plugin.data.foo).toBe('bar')
})

it('creates driver instance onInit', () => {
  const plugin = new TheSupersonicPlugin([{ ...driverSetup(), id: 'foo' }])

  expect(plugin.driverInstances.has('foo')).toBeTruthy()
})

it('uninits', () => {
  const plugin = new TheSupersonicPlugin([{ ...driverSetup() }])

  plugin.uninit()

  expect(document.body.innerHTML).toBe('')
  expect(plugin.driverInstances.size).toBe(0)
  expect(plugin.driverActiveInstances.size).toBe(0)
  expect(IODisconnect).toHaveBeenCalledOnce()
})

it('adds onBeforeRender hook', () => {
  const plugin = new TheSupersonicPlugin([{ ...driverSetup() }], {
    hooks: {
      onBeforeRender(plugin) {
        plugin.data.foo = 'bar'
        return false
      },
      onAfterRender(plugin) {
        plugin.data.foo = 'foo'
      },
    },
  })

  expect(plugin.data.foo).toBe('bar')
})

it('renders all drivers', () => {
  const plugin = new TheSupersonicPlugin([
    {
      ...driverSetup(),
      id: 'foo',
    },
    {
      ...driverSetup(),
      id: 'bar',
    },
  ])

  plugin.screenHeight = 1000

  plugin.updateLimits()

  vi.stubGlobal('scrollY', 2000)

  plugin.render({ useActiveDrivers: false })

  expect(plugin.driverInstances.get('foo')?.progress).toBe(0.5)
  expect(plugin.driverInstances.get('bar')?.progress).toBe(0.5)
})

it('renders only active drivers', () => {
  const plugin = new TheSupersonicPlugin([
    {
      ...driverSetup(),
      id: 'foo',
    },
    {
      ...driverSetup(),
      id: 'bar',
    },
  ])

  plugin.screenHeight = 1000

  plugin.updateLimits()

  vi.stubGlobal('scrollY', 2000)

  plugin.driverInstances.get('foo')?.activate()

  plugin.render({ useActiveDrivers: true })

  expect(plugin.driverInstances.get('foo')?.progress).toBe(0.5)
  expect(plugin.driverInstances.get('bar')?.progress).toBe(0)
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.stubGlobal('scrollY', 0)
})

vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
  observe: IOObserver,
  disconnect: IODisconnect,
})))

function driverSetup() {
  const start = document.createElement('div')
  const end = document.createElement('div')

  // @ts-expect-error not full implementation of DOMRect
  start.getBoundingClientRect = vi.fn(() => ({
    top: 1000,
  }))

  // @ts-expect-error not full implementation of DOMRect
  end.getBoundingClientRect = vi.fn(() => ({
    top: 3000,
  }))

  return {
    start,
    end,
  }
}
