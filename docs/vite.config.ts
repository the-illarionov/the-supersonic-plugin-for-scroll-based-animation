import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@lib': fileURLToPath(new URL('../lib/src', import.meta.url)),
      },
    },
  }
})
