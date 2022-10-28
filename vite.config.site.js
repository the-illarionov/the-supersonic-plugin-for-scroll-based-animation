import { resolve } from "path"
import { defineConfig } from "vite"
import routing from "./src-site/plugins/routing"
//import inlineAssets from "./src-site/plugins/inline-assets"
import moveBuild from "./src-site/plugins/move-build"

const base = "/the-supersonic-plugin-for-scroll-based-animation/"

export default defineConfig(({ mode }) => {
	return {
		base,
		plugins: [
			//
			routing(),
			moveBuild({ folder: __dirname }),
			//inlineAssets({ base }),
		],
		assetsInclude: ["**/*.glb"],
		build: {
			outDir: "./site",
			assetsDir: "",
			rollupOptions: {
				input: {
					index: resolve(__dirname, "src-site/index.html"),
					bartholomew: resolve(__dirname, "src-site/bartholomew.html"),
				},
				output: {
					manualChunks: {
						three: ["three"],
					},
				},
			},
		},

		esbuild: {
			drop: mode === "production" ? ["console"] : [],
		},
	}
})
