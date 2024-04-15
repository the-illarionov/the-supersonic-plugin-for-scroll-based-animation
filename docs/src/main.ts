import { TheSuperSonicPlugin } from '@lib/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      elements: ['.foo'],
    },
  },

})

console.log(f)
