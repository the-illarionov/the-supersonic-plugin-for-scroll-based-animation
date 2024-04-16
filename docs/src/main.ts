import { TheSupersonicPlugin } from '../../lib/src/index'

const f = new TheSupersonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      elements: ['.foo'],
      hooks: {
        /* onUpdateLimits({ driver }) {
          driver.helper.updateLimits({
            top: driver.start.top,
            height: driver.end.top - driver.start.top + driver.plugin.screenHeight,
          })
        }, */
      },
    },
  },
})

console.log(f)
