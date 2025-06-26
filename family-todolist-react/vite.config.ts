import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // TODO: point this back to the server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
