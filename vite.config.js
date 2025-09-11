// vite.config.js (ESM)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import svgr from 'vite-plugin-svgr'
// (path 모듈 불필요)

export default defineConfig({
  plugins: [react(), svgr(),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
