import fs from "fs-extra"
import { resolve } from "path"

export default function ({ folder, page }) {
	return {
		name: "move-build",
		apply: "build",
		closeBundle() {
			Promise.all([
				fs.move(resolve(folder, "site/src-site/" + page + ".html"), resolve(folder, "site/" + page + ".html")),
			]).then(() => {
				fs.remove(resolve(folder, "site/src-site/"))
			})
		},
	}
}
