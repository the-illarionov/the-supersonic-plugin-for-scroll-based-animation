import { TheSuperSonicPlugin } from '@lib/index'

const f = new TheSuperSonicPlugin({
  drivers: {
    foo: {
      start: document.querySelector('.start'),
      end: document.querySelector('.end'),
      elements: [{
        selector: '.foo',
        animations: ['bar'],
      }],
    },
    foo2: {
      start: document.querySelector('.start-2'),
      end: document.querySelector('.end-2'),
      elements: [{
        selector: '.foo',
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
