import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          barth: resolve(__dirname, 'bartholomeow.html'),
        },
      },
    },
  }
})
