export default function ({ base }) {
	return {
		name: "inline-assets",
		enforce: "post",
		generateBundle(_, bundle) {
			const bundlesToDelete = [] as string[]
			const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"))
			const cssAssets = Object.keys(bundle).filter((i) => i.endsWith(".css"))
			const jsAssets = Object.keys(bundle).filter((i) => i.endsWith(".js"))

			for (const htmlFileName of htmlFiles) {
				const htmlChunk = bundle[htmlFileName]

				for (const jsName of jsAssets) {
					const jsChunk = bundle[jsName]

					if (
						jsChunk.name !== "TheSuperSonicPluginForScrollBasedAnimation" &&
						jsChunk.name !== "three" &&
						jsChunk.facadeModuleId &&
						jsChunk.facadeModuleId.indexOf(htmlChunk.fileName) > -1
					) {
						const reScript = new RegExp(
							`<script([^>]*?) src="${base}[./]*${jsChunk.fileName}"([^>]*)></script>`
						)
						bundlesToDelete.push(jsName)

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
				/* htmlChunk.source = htmlChunk.source.replace(/\s\B/gm, "") */
			}
			for (const name of bundlesToDelete) {
				delete bundle[name]
			}
		},
	}
}
