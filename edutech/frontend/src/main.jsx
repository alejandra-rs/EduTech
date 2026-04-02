import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TodosCursos from './pages/AllCourses.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <TodosCursos />
  </StrictMode>,
)