import { TheSuperSonicPlugin } from '@lib/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      elements: ['.foo'],
    },
    foo3: {
      start: document.querySelector('.foo-3'),
      end: document.querySelector('.end-3'),
      elements: ['.foo-3'],
    },
  },

})

const b = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      elements: [{
        selector: '.foo-2',
        animations: ['bar'],
      }],
    },
    foo2: {
      start: document.querySelector('.start-2'),
      end: document.querySelector('.end-2'),
      elements: [{
        selector: '.foo-2',
        animations: [{
          name: 'qwe',
          hooks: {
            onBeforeRender(animation) {
              if (animation.domElement.dataset.foo)
                return false
            },
          },
        }],
      }],
    },
  },

})

console.log(f, b)
