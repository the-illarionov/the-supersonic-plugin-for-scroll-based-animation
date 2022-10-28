const navLinks = document.querySelector(".nav-links")
let linksHtml = ""

document.querySelectorAll(".example__header").forEach((header) => {
	const text = header.textContent.replace("source", "").trim()
	const id = text
		.toLowerCase()
		.replace(/^\d+\.\s/, "")
		.replace(/\s/g, "-")

	const anchor = document.createElement("div")
	anchor.setAttribute("id", id)
	anchor.classList.add("anchor")
	header.parentNode.insertBefore(anchor, header)

	linksHtml += `
		<div class="nav-link-container">
			<a href="#${id}" class="nav-link">${text}</a>
		</div>
	`

	navLinks.innerHTML = linksHtml
})
