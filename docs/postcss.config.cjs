function bartholomeow() {
  return {
    postcssPlugin: 'bartholomeow',
    AtRule: {
      barth: (atRule) => {
        const size = Number.parseInt(atRule.params)
        let resultCss = ''
        let row = 0
        for (let i = 0; i < 49; i++) {
          if (i % 7 === 0 && i > 0)
            row++

          resultCss += `
              .barth-${i + 1} {
                background-position: ${(i % 7) * size}px ${row * size}px
              }
            `
        }
        atRule.after(resultCss)
        atRule.remove()
      },
    },
  }
}

bartholomeow.postcss = true

module.exports = {
  plugins: [
    bartholomeow,
  ],
}
