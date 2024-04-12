import { TheSuperSonicPlugin } from '@lib/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      properties: {
        translateX: { // any valid numeric CSS property
          start: 0,
          end: 1000,
          unit: 'px',
          elements: ['.fo'], // array of any valid CSS selectors
        },
      },
    },
  },

})