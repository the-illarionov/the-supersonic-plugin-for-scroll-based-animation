import { TheSupersonicPlugin } from '../../lib/src/index'

const scrollLog = document.querySelector('#scroll-log')

const plugin = new TheSupersonicPlugin({
  drivers: {
    'basic': {
      start: document.querySelector('.top-100'),
      end: document.querySelector('.top-200'),
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
                onBeforeRender({ animation }) {
                  animation.domElement.style.background = `#${animation.driver.plugin.scroll.toString(16)}`
                },
              },
            },
          ],
        },
      ],
    },
    'cancel-render-driver': {
      start: document.querySelector('.top-100'),
      end: document.querySelector('.top-200'),
      elements: ['.cancel-render-driver'],
      hooks: {
        onBeforeRender() {
          return false
        },
      },
    },
  },
  hooks: {
    onBeforeRender({ plugin }) {
      scrollLog!.innerHTML = plugin.scroll.toString()
    },
  },
  debug: true,
})

console.log(plugin)

// @ts-expect-error window
window.plugin = plugin

/* onUpdateLimits({ driver }) {
          driver.helper.updateLimits({
            top: driver.start.top,
            height: driver.end.top - driver.start.top + driver.plugin.screenHeight,
          })
        }, */
