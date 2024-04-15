import { URL, fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@lib': fileURLToPath(new URL('../lib/src', import.meta.url)),
      },
    },
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
