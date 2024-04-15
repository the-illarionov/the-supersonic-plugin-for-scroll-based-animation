import { TheSuperSonicPlugin } from '../../lib/src/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      elements: ['.foo'],
      hooks: {
        onUpdateLimits({ driver, screenHeight }) {
          driver.helper.updateLimits({
            top: driver.start.top,
            height: driver.end.top - driver.start.top + screenHeight,
          })
        },
      },
    },
  },
})

console.log(f)
