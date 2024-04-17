import { TheSupersonicPlugin } from '../../lib/src'
import type { Configuration as DriverConfiguration } from '../../lib/src/Driver.types'
import { toFixed } from '../../lib/src/utils'

const isMobile = matchMedia('(max-width: 1024px)').matches
const elementSize: number = isMobile ? 150 : 190
const elementsAmount = 1000
const maxHorizontalElements = Math.ceil(window.innerWidth / elementSize)
const maxRows = Math.ceil(window.innerHeight / elementSize)
const elementsOnScreen = maxRows * maxHorizontalElements
const drivers: DriverConfiguration = {}

const props = [
  {
    name: 'translateX',
    minStart: 0,
    maxStart: 0,
    minEnd: -(window.innerWidth / 5),
    maxEnd: window.innerWidth / 5,
  },

  {
    name: 'translateY',
    minStart: 0,
    maxStart: 0,
    minEnd: -(window.innerHeight / 5),
    maxEnd: window.innerHeight / 5,
  },

  {
    name: 'rotate',
    minStart: 0,
    maxStart: 0,
    minEnd: -90,
    maxEnd: 90,
  },
  {
    name: 'scale',
    minStart: 1,
    maxStart: 1,
    minEnd: 3,
    maxEnd: 3.5,
  },
]

let row = 0
const last10sprites: any = []
function gen() {
  return Math.floor(Math.random() * 49) + 1
}

function randomSprite() {
  const index = gen()
  if (last10sprites.includes(index))
    return randomSprite()
  if (last10sprites.length === 10)
    last10sprites.shift()
  last10sprites.push(index)
  return index
}
for (let i = 0; i < elementsAmount; i++) {
  const sprite = randomSprite()
  const image = document.createElement('span')
  image.classList.add('barth')
  image.classList.add(`barth-${sprite}`)

  if (i % maxHorizontalElements === 0 && i > 0)
    row++

  const elementTop = row * elementSize

  image.style.top = `${elementTop}px`
  image.style.left = `${(i % maxHorizontalElements) * elementSize}px`
  // @ts-expect-error foo
  image.style.zIndex = i + 100
  image.id = `barth-${i}`

  document.body.appendChild(image)
}

const height = Math.ceil(row * elementSize)

const driverHeight = elementSize * 2
const driverAmount = Math.ceil((height - window.innerHeight) / driverHeight)
const driversOnScreen = Math.ceil(window.innerHeight / driverHeight)

for (let i = 0; i < driverAmount; i++) {
  const driverId = `driver-${i}`
  const start = document.createElement('i')
  start.classList.add('driver')
  const driverStart = i * driverHeight + window.innerHeight
  start.style.top = `${driverStart}px`

  document.body.appendChild(start)

  const end = document.createElement('i')
  end.classList.add('driver')
  end.style.top = `${driverStart + driverHeight + window.innerHeight}px`
  document.body.appendChild(end)

  const elementsPerDriver = elementsOnScreen / driversOnScreen

  const driverRow = Math.round(driverStart / elementSize) - driversOnScreen
  const driverStartFromElement = driverRow * maxHorizontalElements

  drivers[driverId] = {
    start,
    end,
    hooks: {
      onAfterInit({ driver }) {
        driver.data.elements = []

        for (let index = 0; index < elementsPerDriver; index++) {
          const element: any = {}
          element.domElement = document.querySelector<HTMLElement>(`#barth-${index + driverStartFromElement}`)!

          element.properties = {}

          for (let i = 0; i < props.length; i++) {
            const sourceProp = props[i]

            element.properties[sourceProp.name] = {}

            const targetProp = element.properties[sourceProp.name]

            targetProp.start = Math.random() * (sourceProp.maxStart - sourceProp.minStart) + sourceProp.minStart
            if (sourceProp.name === 'opacity' || sourceProp.name === 'scale')
              targetProp.start = Number.parseFloat(targetProp.start.toFixed(2))
            else targetProp.start = Math.ceil(targetProp.start)

            targetProp.end = Math.random() * (sourceProp.maxEnd - sourceProp.minEnd) + sourceProp.minEnd
            if (sourceProp.name === 'opacity' || sourceProp.name === 'scale')
              targetProp.end = Number.parseFloat(targetProp.end.toFixed(2))
            else targetProp.end = Math.ceil(targetProp.end)

            targetProp.distance = toFixed(targetProp.end - targetProp.start, 2)
          }

          driver.data.elements.push(element)
        }
      },
      onAfterRender({ driver }) {
        driver.data.elements.forEach((element: any) => {
          const translateX = element.properties.translateX.distance * driver.progress + element.properties.translateX.start
          const translateY = element.properties.translateY.distance * driver.progress + element.properties.translateY.start
          const scale = element.properties.scale.distance * driver.progress + element.properties.scale.start
          const rotate = element.properties.rotate.distance * driver.progress + element.properties.rotate.start

          element.domElement.style.setProperty('transform',
          // eslint-disable-next-line prefer-template
            'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) '
            + 'scale(' + scale + ') '
            + 'rotate(' + rotate + 'deg')
        })
      },
    },
  }
}

const plugin = new TheSupersonicPlugin({
  drivers,
})

// @ts-expect-error foo
window.plugin = plugin
