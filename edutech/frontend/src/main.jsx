import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Asegúrate de importar tus estilos de Tailwind
import CargarPublicacionPDF from './pages/CargarPublicacionPDF'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CargarPublicacionPDF />
  </StrictMode>,
)