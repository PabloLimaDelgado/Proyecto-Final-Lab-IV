import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "c1c7-191-81-200-2.ngrok-free.app",
    },
  },
});
