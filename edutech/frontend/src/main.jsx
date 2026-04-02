import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Course from './components/Subject.jsx'
import { WidgetCourse } from './components/Course.jsx'
import App from './prueba.jsx'

/*
const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <WidgetCourse />
  </StrictMode>,
)
*/

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)