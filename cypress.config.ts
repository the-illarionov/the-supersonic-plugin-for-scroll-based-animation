import { defineConfig } from "cypress"

export default defineConfig({
	e2e: {
		video: false,
		screenshotOnRunFailure: false,
		supportFile: false,
		baseUrl: "http://localhost:4173/the-supersonic-plugin-for-scroll-based-animation",
	},
})
