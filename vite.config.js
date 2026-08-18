import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  // basicSsl gives the dev server a self-signed HTTPS cert. Browsers only
  // allow microphone access on secure origins (https or localhost) — plain
  // http on a LAN IP (host: 0.0.0.0) is treated as insecure and mic access
  // silently fails, which is what "No microphone was found" actually was.
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true
  }
});