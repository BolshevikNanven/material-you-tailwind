import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.tsx'
import { Snakebar } from './components/ui/snakebar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Snakebar />
    <App />
  </StrictMode>,
)
