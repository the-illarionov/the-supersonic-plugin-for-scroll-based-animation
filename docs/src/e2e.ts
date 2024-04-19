import { TheSupersonicPlugin } from '../../lib/src/index'

const scrollLog = document.querySelector('#scroll-log')

const plugin = new TheSupersonicPlugin([
  {
    start: '.top-100',
    end: '.top-200',
    elements: [
      '.basic',
      {
        selector: '.cancel-render-animation',
        animations: [
          {
            name: 'basic',
            hooks: {
              onBeforeRender() {
                return false
              },
            },
          },
        ],
      },
      {
        selector: '.changes-bg-on-render',
        animations: [
          {
            name: 'basic',
            hooks: {
              onBeforeRender(animation) {
                animation.domElement.style.background = `#${animation.driver.plugin.scroll.toString(16)}`
              },
            },
          },
        ],
      },
    ],
  },
  {
    start: '.top-100',
    end: '.top-200',
    elements: ['.cancel-render-driver'],
    hooks: {
      onBeforeRender() {
        return false
      },
    },
  },
  {
    start: '.top-250',
    end: '.top-400',
    id: 'bottom',
    elements: ['.bottom-driver'],
  },
], {
  debug: true,
  hooks: {
    onBeforeRender(plugin) {
      scrollLog!.innerHTML = plugin.scroll.toString()
    },
  },
})

console.log(plugin)

// @ts-expect-error window
window.plugin = plugin
