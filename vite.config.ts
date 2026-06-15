import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@portfolio": fileURLToPath(
        new URL("./apps/portfolio/src", import.meta.url),
      ),
      "@admin": fileURLToPath(
        new URL("./apps/admin/src", import.meta.url),
      ),
      "@shared": fileURLToPath(
        new URL("./apps/shared", import.meta.url),
      ),
    },
  },
});