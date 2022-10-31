import { resolve } from "path"
import { defineConfig } from "vite"
import routing from "./src-site/plugins/routing"
import inlineAssets from "./src-site/plugins/inline-assets"
import moveBuild from "./src-site/plugins/move-build"

const base = "/the-supersonic-plugin-for-scroll-based-animation/"
const page = process.env.PAGE

export default defineConfig(({ mode }) => {
	return {
		base,
		plugins: [
			//
			routing(),
			moveBuild({ folder: __dirname, page }),
			inlineAssets({ base, page }),
		],
		assetsInclude: ["**/*.glb"],
		build: {
			emptyOutDir: page === "index",
			outDir: "./site",
			assetsDir: "",
			rollupOptions: {
				input: {
					[page]: resolve(__dirname, "src-site/" + page + ".html"),
				},
			},
		},

		esbuild: {
			drop: mode === "production" ? ["console"] : [],
		},
	}
})
