import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NotebookFooter from './components/PublicacionFooter.jsx'
const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <NotebookFooter />
  </StrictMode>,
)