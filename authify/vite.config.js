import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    global: 'window',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // YEH NAYA PROXY ADD KARO WEBSOCKET KE LIYE
      '/ws': {
        target: 'http://localhost:8080',
        ws: true, // <-- YEH ZAROORI HAI
        changeOrigin: true,
        secure: false,
      }
    }
  }
})