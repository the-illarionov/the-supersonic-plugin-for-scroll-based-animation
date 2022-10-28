import { resolve } from "path"
import { defineConfig } from "vite"
import { name } from "./package.json"

const minify = process.env.MINIFY === "on" ? true : false

function fileName(format) {
	return name + (format === "iife" ? ".iife" : "") + (minify ? ".min" : "") + ".js"
}

export default defineConfig(({ mode }) => {
	return {
		build: {
			minify,
			outDir: "lib",
			emptyOutDir: minify,
			lib: {
				entry: resolve(__dirname, "src-lib/main.ts"),
				name: "TheSuperSonicPluginForScrollBasedAnimation",
				formats: ["es", "iife"],
				fileName,
			},
		},
		esbuild: {
			drop: mode === "production" ? ["console"] : [],
		},
	}
})
