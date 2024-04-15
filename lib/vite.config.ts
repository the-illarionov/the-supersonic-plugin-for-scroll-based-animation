/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        fileName: 'the-supersonic-plugin-for-scroll-based-animation',
        name: 'TheSuperSonicPlugin',
        formats: ['es', 'iife'],
      },
    },
    esbuild: {
      drop: mode === 'production'
        ? ['console']
        : [],
    },
    test: {
      environment: 'jsdom',
    },
    plugins: [dts({
      exclude: ['**/*.test.ts', '**/utils.ts'],
    })],
  }
})
