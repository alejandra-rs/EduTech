import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Subject from './pages/AllSubjects.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <Subject  />
  </StrictMode>,
)