const codes = document.querySelectorAll("pre")

codes.forEach((code) => {
	const copy = document.createElement("div")
	copy.classList.add("copy-clipboard")
	copy.innerHTML = `
	<svg height="16" version="1.1" width="16" height="16" viewBox="0 0 16 16">
		<path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path>
		<path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
	</svg>
	`
	copy.onpointerdown = () => {
		const copyText = code.innerText.trim()
		navigator.clipboard.writeText(copyText).then(() => {
			copy.classList.add("copied")
		})
	}
	copy.onpointerout = () => {
		copy.classList.remove("copied")
	}
	code.appendChild(copy)
})