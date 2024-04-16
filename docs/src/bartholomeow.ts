import { Animation, TheSupersonicPlugin } from '../../lib/src'
import type { Configuration as DriverConfiguration } from '../../lib/src/Driver.types'

const isMobile = matchMedia('(max-width: 1024px)').matches
const elementSize: number = isMobile ? 150 : 190
const elementsAmount = 1000
const maxHorizontalElements = Math.ceil(window.innerWidth / elementSize)
const maxRows = Math.ceil(window.innerHeight / elementSize)
const elementsOnScreen = maxRows * maxHorizontalElements
const drivers: DriverConfiguration = {}

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

        if (driverRow >= 0) {
          for (let index = 0; index < elementsPerDriver; index++) {
            const domElement = document.querySelector<HTMLElement>(`#barth-${index + driverStartFromElement}`)!

            driver.data.elements.push(domElement)
          }
        }
      },
      onBeforeRender({ driver }) {
        driver.data.elements.forEach((element) => {
          element.style.setProperty('transform', `translate3d(${driver.progress * 500}%, 0, 0)`)
        })
      },
    },
  }
}

const plugin = new TheSupersonicPlugin({
  drivers,
  debug: true,
})

window.plugin = plugin
