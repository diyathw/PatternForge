import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// GitHub Pages serves index.html with a 10-minute cache (out of our control —
// no custom headers on GH Pages). Every deploy replaces all hashed asset
// files, so a browser holding a stale cached index.html can reference a JS
// chunk that no longer exists (e.g. the lazily-loaded Monaco code editor on
// the Practice page). Vite fires this event when that happens; reload once to
// pick up the fresh index.html and bundle rather than leaving the app stuck.
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
