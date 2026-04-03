import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CargarPublicacionPDF from './pages/CargarPublicacionPDF'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <CargarPublicacionPDF />
  </StrictMode>,
)