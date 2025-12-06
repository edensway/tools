import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/tools/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Eden's Way – Tools",
        short_name: "tools",
        start_url: "/tools/",
        scope: "/tools/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#DC0B5B",
        description: "Tools for measuring body fat, size, and overall body composition.",
        icons: [
          {
            src: "/tools/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/tools/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      includeAssets: ["favicon.ico", "robots.txt"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      }
    })
  ]
});