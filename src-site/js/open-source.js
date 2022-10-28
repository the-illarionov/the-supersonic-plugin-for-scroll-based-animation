document.querySelectorAll(".example__header__source").forEach((button) => {
	button.onpointerdown = (e) => {
		const parent = getParent({ target: e.target, className: "section" })
		parent.querySelector(".code").classList.toggle("code_active")
		document.body.classList.toggle("mobile-oh")
	}
})

document.querySelectorAll(".source-close").forEach((button) => {
	button.onpointerdown = (e) => {
		const parent = getParent({ target: e.target, className: "code" })
		parent.classList.remove("code_active")
		document.body.classList.remove("mobile-oh")
	}
})

function getParent({ target, className }) {
	if (target.parentNode.classList.contains(className)) return target.parentNode

	return getParent({ target: target.parentNode, className })
}
