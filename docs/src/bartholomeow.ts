import { TheSupersonicPlugin } from '../../lib/src/TheSupersonicPlugin'

const isMobile = matchMedia('(max-width: 1024px)').matches
const elementSize: number = isMobile ? 150 : 190
const elementsAmount = 1000
const maxHorizontalElements = Math.ceil(window.innerWidth / elementSize)
const maxRows = Math.ceil(window.innerHeight / elementSize)
const elementsOnScreen = maxRows * maxHorizontalElements
const drivers: any = {}
const renderedElements = {}

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
  image.dataset.id = `supersonic-${i}`
  // @ts-expect-error foo
  renderedElements[image.dataset.id] = {}

  document.body.appendChild(image)
}

const height = Math.ceil(row * elementSize)

const driverHeight = elementSize * 2
const driverAmount = Math.ceil((height - window.innerHeight) / driverHeight)
const driversOnScreen = Math.ceil(window.innerHeight / driverHeight)

for (let i = 0; i < driverAmount; i++) {
  const driverId = `driver${i}`
  const start = document.createElement('i')
  start.classList.add('driver')
  const driverStart = i * driverHeight
  start.style.top = `${driverStart}px`
  // @ts-expect-error foo
  start.dataset.index = i

  document.body.appendChild(start)

  const end = document.createElement('i')
  end.classList.add('driver')
  end.style.top = `${driverStart + driverHeight}px`
  document.body.appendChild(end)

  const elements = []
  const driverRow = Math.round(driverStart / elementSize)
  const driverStartFromElement = driverRow * maxHorizontalElements

  for (let y = 0; y < Math.ceil(elementsOnScreen / driversOnScreen); y++) {
    const elementIndex = y + driverStartFromElement

    elements.push(`[data-id="supersonic-${elementIndex}"]`)
  }

  drivers[driverId] = {
    start,
    end,
  }
}

const plugin = new TheSupersonicPlugin({
  drivers,
  debug: true,
})

window.plugin = plugin
