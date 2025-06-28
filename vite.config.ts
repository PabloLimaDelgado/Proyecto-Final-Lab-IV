import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true, 
    },
    hmr: {
      host: 'f318-186-122-2-175.ngrok-free.app', 
    },
  },
})
