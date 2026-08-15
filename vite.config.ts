import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname)
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Split the framework and animation runtime into their own chunks so a
        // content change doesn't invalidate them in visitors' caches.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"]
        }
      }
    }
  }
});
