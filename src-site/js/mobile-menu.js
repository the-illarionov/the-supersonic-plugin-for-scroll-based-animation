const nav = document.querySelector("nav")

document.querySelector(".mobile-menu").onpointerdown = () => {
	nav.classList.add("nav_active")
}

nav.onpointerdown = () => {
	setTimeout(() => {
		nav.classList.remove("nav_active")
	}, 100)
}
