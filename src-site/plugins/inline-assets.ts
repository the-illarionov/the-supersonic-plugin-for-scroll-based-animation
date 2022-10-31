export default function ({ base, page }) {
	return {
		name: "inline-assets",
		enforce: "post",
		generateBundle(_, bundle) {
			const bundlesToDelete = [] as string[]
			const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"))
			const cssAssets = Object.keys(bundle).filter((i) => i.endsWith(".css"))
			const jsAssets = Object.keys(bundle).filter((i) => i.endsWith(".js"))
			const glbAssets = Object.keys(bundle).filter((i) => i.endsWith(".glb"))

			for (const htmlFileName of htmlFiles) {
				let preloads = ""
				const htmlChunk = bundle[htmlFileName]

				for (const jsName of jsAssets) {
					const jsChunk = bundle[jsName]

					if (jsChunk.name === "custom-element") {
						preloads = `
							<link rel="modulepreload" href="${jsChunk.fileName}" />
							<link rel="preload" href="${bundle[glbAssets[0]].fileName}" as="fetch" />
						`
					}

					if (jsChunk.name !== "custom-element") {
						const reScript = new RegExp(
							`<script([^>]*?) src="${base}[./]*${jsChunk.fileName}"([^>]*)></script>`
						)
						bundlesToDelete.push(jsName)

						jsChunk.code = jsChunk.code.replaceAll('"__VITE_PRELOAD__"', "void 0")

						htmlChunk.source = htmlChunk.source.replace(
							reScript,
							`<script type="module">${jsChunk.code}</script>`
						)
					}
				}

				for (const cssFileName of cssAssets) {
					const cssChunk = bundle[cssFileName]

					const reCss = new RegExp(`<link[^>]*? href="${base}[./]*${cssChunk.fileName}"[^>]*?>`)
					bundlesToDelete.push(cssFileName)
					htmlChunk.source = htmlChunk.source.replace(reCss, `<style>${cssChunk.source}</style>`)
				}
				htmlChunk.source = htmlChunk.source.replace("</head>", preloads + "</head>")
				/* htmlChunk.source = htmlChunk.source.replace(/\s\B/gm, "") */
			}
			for (const name of bundlesToDelete) {
				delete bundle[name]
			}
		},
	}
}
