import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CargarPublicacionVideo from './pages/CargarPublicacionVideo'
import App from './prueba'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)