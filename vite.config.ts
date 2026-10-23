import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' — сайт работает и на GitHub Pages (username.github.io/repo), и на любом хостинге
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
