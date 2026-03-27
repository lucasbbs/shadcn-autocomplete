/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { autocompleteDataApi } from "./vite.autocomplete-data-api";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), autocompleteDataApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests-setup.ts",
  },
});
