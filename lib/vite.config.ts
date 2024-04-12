import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        fileName: 'the-supersonic-plugin-for-scroll-based-animation',
        formats: ['es'],
      },
    },
    esbuild: {
      drop: mode === 'production'
        ? ['console']
        : [],
    },
    plugins: [dts()],
  }
})
