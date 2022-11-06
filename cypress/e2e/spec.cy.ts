const timeout = 1000

describe("Scroll", () => {
	it("Works and keeps value after page reload on desktop", () => {
		cy.viewport(1200, 700)

		cy.visit("/")

		cy.wait(timeout)

		cy.scrollTo(0, 600)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-1-element").should("have.css", "transform", "matrix(1, 0, 0, 1, 527.498, 0)")

		cy.scrollTo(0, 1200)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-2-element").should(
			"have.css",
			"transform",
			"matrix3d(-1.24449, -0.197107, 0, 0, 0.197107, -1.24449, 0, 0, 0, 0, 1.26, 0, 0, 0, 0, 1)"
		)

		cy.scrollTo(0, 2100)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-3-element-1").should("have.css", "transform", "matrix(1, 0, 0, 1, -369.455, 0)")

		cy.get(".example-3-element-2").should(
			"have.css",
			"transform",
			"matrix3d(0.67, 0, 0, 0, 0, 0.67, 0, 0, 0, 0, 0.67, 0, 0, 0, 0, 1)"
		)

		cy.scrollTo(0, 3100)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)

		cy.get(".example-4-element-1")
			.should("have.css", "transform", "matrix(1, 0, 0, 1, -135.747, 0)")
			.and("have.css", "opacity", "0.05")

		cy.get(".example-4-element-2")
			.should("have.css", "transform", "matrix(1, 0, 0, 1, 131.772, 0)")
			.and("have.css", "opacity", "0.05")

		cy.scrollTo(0, 4150)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-5-element").should("have.css", "transform", "matrix(1, 0, 0, 1, 138.242, 0)")

		cy.scrollTo(0, 4900)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-6-element")
			.should("have.css", "transform", "matrix(1, 0, 0, 1, 286, 0)")
			.and("have.css", "opacity", "0.5")

		cy.scrollTo(0, 5600)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-7-element")
			.should("have.css", "transform", "matrix(1, 0, 0, 1, -114.4, 0)")
			.and("have.css", "opacity", "1")

		cy.scrollTo(0, 6000)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-8-element").should(
			"have.css",
			"transform",
			"matrix(-0.870184, -0.492727, 0.492727, -0.870184, 0, 0)"
		)

		cy.scrollTo(0, 6900)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)

		cy.get(".example-9-element-1").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 210.8)")

		cy.get(".example-9-element-2").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 197.661)")

		cy.get(".example-9-element-3").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 173.586)")

		cy.scrollTo(0, 8600)
		cy.wait(timeout)
		cy.reload()
		cy.wait(timeout)
		cy.get(".example-11-element")
			.should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 40.8)")
			.and("have.css", "opacity", "1")
	})

	it("Media query works on mobiles", () => {
		cy.viewport("iphone-7")

		cy.visit("/")

		cy.scrollTo(0, 5100)
		cy.wait(timeout)

		cy.get(".example-7-element").should("have.css", "transform", "none").and("have.css", "opacity", "0.18")
	})
})

export {}
