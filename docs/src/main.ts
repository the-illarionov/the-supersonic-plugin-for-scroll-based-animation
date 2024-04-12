import { TheSuperSonicPlugin } from '@lib/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: { // value of "[data-supersonic-driver]"
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
