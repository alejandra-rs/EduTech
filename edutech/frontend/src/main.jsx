import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CargarPublicacionVideo from './pages/CargarPublicacionVideo'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <CargarPublicacionVideo />
  </StrictMode>,
)