import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "components": path.resolve(__dirname, "./src/components"),
      "modules": path.resolve(__dirname, "./src/modules"),
      "utils": path.resolve(__dirname, "./src/utils"),
      "decorators": path.resolve(__dirname, "./src/decorators")
    },
  },
  plugins: [
    react({
      babel: {
          plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }]
          ],
      },
    }),
  ],
});
