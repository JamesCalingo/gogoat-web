import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { options } from "./manifest.json"

// const options = {
//     registerType: "autoUpdate",
//     includeAssests: [
//       "favicon.ico",
//       "apple-touch-icon.png",
//       "android-chrome-192x192.png",
//       "android-chrome-384x384.png",
//       "masked-icon.svg"
//     ],
//     manifest: {
//       name: "GogoaT",
//       short_name: "GogoaT",
//       description: "Find your train...instantly!",
//       icons: [
//         {
//           src: "/android-chrome-192x192.png",
//           sizes: "192x192",
//           type: "image/png",
//           purpose: "favicon"
//         },
//         {
//           src: "/android-chrome-384x384.png",
//           sizes: "512x512",
//           type: "image/png",
//           purpose: "favicon"
//         },
//         {
//           src: "/apple-touch-icon.png",
//           sizes: "180x180",
//           type: "image/png",
//           purpose: "apple touch icon"
//         },
//         {
//           src: "/maskable_icon.png",
//           sizes: "225x225",
//           type: "image/png",
//           purpose: "any maskable"
//         }
//       ],
//       theme_color: "#171717",
//       background_color: "#f0e7db",
//       display: "standalone",
//       scope: "/",
//       start_url: "/",
//       orientation: "portrait"
//     }
//   }



// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), VitePWA(options)]
})
