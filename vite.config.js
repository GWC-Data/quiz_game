import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ command }) => ({
  // basicSsl gives the dev server a self-signed HTTPS cert. Browsers only
  // allow microphone access on secure origins (https or localhost) — plain
  // http on a LAN IP (host: 0.0.0.0) is treated as insecure and mic access
  // silently fails, which is what "No microphone was found" actually was.
  // Only apply it to `vite dev` — `vite preview` is what Render runs in
  // production, and Render's proxy speaks plain HTTP to the container, so a
  // TLS-wrapped response there shows up to visitors as a 502.
  plugins: [react(), tailwindcss(), ...(command === "serve" ? [basicSsl()] : [])],
  server: {
    host: "0.0.0.0",
    allowedHosts: true
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true
  }
}));