import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import manifest from "./manifest.json"

const manifest = {
  "registerType": "prompt",
  "includeAssests": ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  "manifest": {
    "name": "GogoaT",
    "short_name": "GogoaT",
    "description": "Find your train...instantly!",
    "icons": [
      {
        "src": "favicon/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "favicon"
      },
      {
        "src": "favicon//android-chrome-384x384.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "favicon"
      },
      {
        "src": "favicon/apple-touch-icon.png",
        "sizes": "180x180",
        "type": "image/png",
        "purpose": "apple touch icon"
      }
    ],
    "theme_color": "#171717",
    "background_color": "#f0e7db",
    "display": "standalone",
    "scope": "/",
    "start_url": "/",
    "orientation": "portrait"
  }
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifest)],
})
