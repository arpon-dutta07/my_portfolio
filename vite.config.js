
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], // Remove tailwindcss() since it's not needed
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
    },
  },
});