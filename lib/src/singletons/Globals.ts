const Globals: Globals = {
	scroll: 0,
	screenHeight: 0,
	rafActive: true,
	rafId: 0,
	renderedInitially: false,

	config: {
		options: {
			observerRootMargin: "100px",
		},
		drivers: {},
	},

	reset() {
		Globals.scroll = 0
		Globals.rafActive = true
		Globals.rafId = 0
		Globals.renderedInitially = false
	},

	initConfig(config) {
		Globals.config = {
			options: { ...Globals.config.options, ...config.options },
			drivers: config.drivers ?? {},
			hooks: config.hooks ?? {},
			elements: config.elements ?? {},
		}
	},
}

// for development only
const devGlobals = {
	showConsole: true,
	isProduction: import.meta.env.PROD,
	consoleStyles: "color: green",
	// prettier-ignore
	colors: ['#1a410f','#b5450','#b58f3c','#1c9517','#f23271','#a5ac91','#49fea3','#2ef65f','#397dfe','#f6600','#b36058','#1d2b9f','#c51a9c','#9fc545','#d5a53e','#68eeb6','#59cce0','#e392e8','#a38457','#d4271c','#43b722','#ebf326','#ff0e97','#5f9878','#d419a2','#25a3d7','#3fa975','#e8f942','#fc25b','#d35877','#74197e','#3446fa','#c83432','#11cbc7','#eed109','#fc13ef','#622950','#cf2d9b','#1a17c5','#b4b5f2','#caedf3','#da3196','#b4b394','#6da3cb','#b768fc','#b30696','#d0cc3c','#e6e1a8','#e3047e','#4c66c2'],
	colorIndex: 0,
	updateConsoleBg() {
		devGlobals.consoleStyles = `color: ${devGlobals.colors[devGlobals.colorIndex]};`
		if (devGlobals.colorIndex < 49) devGlobals.colorIndex++
		else devGlobals.colorIndex = 0
	},
}

export { Globals, devGlobals }
