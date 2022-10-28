import fs from "fs-extra"
import { resolve } from "path"

export default function ({ folder }) {
	return {
		name: "move-build",
		apply: "build",
		closeBundle() {
			Promise.all([
				fs.move(resolve(folder, "site/src-site/index.html"), resolve(folder, "site/index.html")),
				fs.move(resolve(folder, "site/src-site/bartholomew.html"), resolve(folder, "site/bartholomew.html")),
			]).then(() => {
				fs.remove(resolve(folder, "site/src-site/"))
			})
		},
	}
}
