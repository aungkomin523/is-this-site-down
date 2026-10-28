import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { outDir: '../server/api/dist', emptyOutDir: true },
  server: {
    // During `npm run dev`, send /api requests to the local Express server
    proxy: { '/api': 'http://localhost:3000' },
  },
})
