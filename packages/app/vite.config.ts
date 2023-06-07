import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/shipments',
  server: {
    fs: {
      strict: false
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
