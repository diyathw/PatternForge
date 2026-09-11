import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites from /<repo>/, not the domain root.
  // GITHUB_PAGES is set only by .github/workflows/deploy.yml, so local dev
  // and any other deploy target keep the default root base.
  base: process.env.GITHUB_PAGES ? '/PatternForge/' : '/',
  plugins: [react(), tailwindcss()],
})
