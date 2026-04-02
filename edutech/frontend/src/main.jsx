import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './prueba.jsx'
import { WidgetCourse } from './components/Course.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <WidgetCourse />
  </StrictMode>,
)