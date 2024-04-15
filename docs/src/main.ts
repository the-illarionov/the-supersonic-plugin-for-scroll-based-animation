import { TheSuperSonicPlugin } from '../../lib/src/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
    },
  },
})

console.log(f)
