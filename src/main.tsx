import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/lib/i18n'
import { reloadOnceForChunkError } from '@/lib/chunk-reload'
import { App } from '@/app/app'
import './index.css'

window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForChunkError()) {
    event.preventDefault()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
