export default function () {
	return {
		name: "mpa",
		configureServer(server) {
			return () => {
				server.middlewares.use((req, res, next) => {
					req.url = "/src-site" + req.url
					next()
				})
			}
		},
	}
}
