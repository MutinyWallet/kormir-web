import * as path from "path";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import solid from "vite-plugin-solid";
import wasm from "vite-plugin-wasm";

import manifest from "./manifest";

const pwaOptions: Partial<VitePWAOptions> = {
  base: "/",
  registerType: "prompt",
  devOptions: {
    enabled: false,
  },
  workbox: {
    navigateFallback: "/index.html",
    globPatterns: ["**/*.{js,css,html,svg,png,gif,wasm}"],
    // mutiny_wasm is 10mb, so we'll do 25mb to be safe
    maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
  },
  includeAssets: ["favicon.ico", "robots.txt"],
  manifest: manifest,
};

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist/public",
    emptyOutDir: true,
  },
  server: {
    port: 3069,
    fs: {
      // Allow serving files from one level up (so that if mutiny-node is a sibling folder we can use it locally)
      allow: [".."],
    },
  },
  plugins: [wasm(), solid(), VitePWA(pwaOptions)],
  resolve: {
    alias: [{ find: "~", replacement: path.resolve(__dirname, "./src") }],
  },
  optimizeDeps: {
    // Don't want vite to bundle these late during dev causing reload
    include: [],
    // This is necessary because otherwise `vite dev` can't find the wasm
    exclude: ["@benthecarman/kormir-wasm"],
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
});
