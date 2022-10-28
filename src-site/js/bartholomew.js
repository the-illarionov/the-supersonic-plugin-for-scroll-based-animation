import ThePlugin from "../../src-lib/main"

const isMobile = matchMedia("(max-width: 1024px)").matches
const elementSize = isMobile ? 150 : 200
const elementsAmount = 1000
const maxHorizontalElements = Math.round(window.innerWidth / elementSize)
const maxRows = Math.round(window.innerHeight / elementSize)
const elementsOnScreen = maxRows * maxHorizontalElements
const config = { drivers: {} }
const renderedElements = {}

let row = 0
let last10sprites = []
function gen() {
	return Math.floor(Math.random() * 49) + 1
}

function randomSprite() {
	const index = gen()
	if (last10sprites.indexOf(index) > -1) return randomSprite()
	if (last10sprites.length == 10) last10sprites.shift()
	last10sprites.push(index)
	return index
}
for (let i = 0; i < elementsAmount; i++) {
	const sprite = randomSprite()
	let image = document.createElement("span")
	image.classList.add("barth")
	image.classList.add("barth-" + sprite)

	if (i % maxHorizontalElements === 0 && i > 0) row++

	const elementTop = row * elementSize

	image.style.top = elementTop + "px"
	image.style.left = (i % maxHorizontalElements) * elementSize + "px"
	image.style.zIndex = i + 100
	image.dataset.id = "supersonic-" + i
	renderedElements[image.dataset.id] = {}

	document.body.appendChild(image)
}

const height = Math.ceil(elementsAmount / maxHorizontalElements) * elementSize

const driversOnScreen = 5
const driverHeight = Math.ceil(window.innerHeight / driversOnScreen)
const driverAmount = Math.ceil((height - window.innerHeight) / driverHeight)

const props = [
	{
		name: "translateX",
		minStart: 0,
		maxStart: 0,
		minEnd: -(window.innerWidth / 15),
		maxEnd: window.innerWidth / 15,
		unit: "px",
	},

	{
		name: "translateY",
		minStart: 0,
		maxStart: 0,
		minEnd: -(window.innerHeight / 15),
		maxEnd: window.innerHeight / 15,
		unit: "px",
	},

	{
		name: "rotate",
		minStart: 0,
		maxStart: 0,
		minEnd: -90,
		maxEnd: 90,
		unit: "deg",
	},
	{
		name: "scale",
		minStart: 1,
		maxStart: 1,
		minEnd: 1.5,
		maxEnd: 1.7,
	},

	/* {
					name: "opacity",
					minStart: 1,
					maxStart: 1,
					minEnd: 0.3,
					maxEnd: 0.5,
				}, */
]

for (let i = 0; i < driverAmount; i++) {
	const driverId = "driver" + i
	const order = i
	let driver = document.createElement("i")
	driver.dataset.supersonicDriver = driverId
	driver.dataset.supersonicType = "start"
	driver.classList.add("driver")
	const driverStart = order * driverHeight
	driver.style.top = driverStart + "px"
	driver.dataset.index = i
	driver.dataset.supersonicEdge = "top"

	document.body.appendChild(driver)

	driver = document.createElement("i")
	driver.dataset.supersonicDriver = driverId
	driver.dataset.supersonicType = "end"
	driver.dataset.supersonicEdge = "top"
	driver.classList.add("driver")
	driver.style.top = driverStart + driverHeight + "px"
	document.body.appendChild(driver)

	config.drivers[driverId] = generateProps(i)
}

function generateProps(driverIndex) {
	const result = { properties: {} }
	const driverTop = parseInt(document.querySelector("[data-index='" + driverIndex + "']").style.top)
	const driverRow = parseInt(driverTop / elementSize)
	const driverStartFromElement = driverRow * maxHorizontalElements

	for (let i = 0; i < props.length; i++) {
		const sourceProp = props[i]

		result.properties[sourceProp.name] = {}

		const targetProp = result.properties[sourceProp.name]

		targetProp.start = Math.random() * (sourceProp.maxStart - sourceProp.minStart) + sourceProp.minStart
		if (sourceProp.name == "opacity" || sourceProp.name == "scale")
			targetProp.start = parseFloat(targetProp.start.toFixed(2))
		else targetProp.start = Math.ceil(targetProp.start)

		targetProp.end = Math.random() * (sourceProp.maxEnd - sourceProp.minEnd) + sourceProp.minEnd
		if (sourceProp.name == "opacity" || sourceProp.name == "scale")
			targetProp.end = parseFloat(targetProp.end.toFixed(2))
		else targetProp.end = Math.ceil(targetProp.end)

		targetProp.unit = sourceProp.unit

		const elements = []

		for (let y = 0; y < elementsOnScreen; y++) {
			const elementIndex = y + driverStartFromElement
			if (elementIndex < elementsAmount) {
				if (typeof renderedElements["supersonic-" + elementIndex][sourceProp.name] === "undefined") {
					if (Math.random() > 0.5) {
						renderedElements["supersonic-" + elementIndex][sourceProp.name] = driverIndex
						elements.push(`[data-id="supersonic-${elementIndex}"]`)
					}
				}
			}
		}

		result.properties[sourceProp.name].elements = elements
	}

	return result
}

const scroller = new ThePlugin(config)

window.scroller = scroller
window.ThePlugin = ThePlugin
