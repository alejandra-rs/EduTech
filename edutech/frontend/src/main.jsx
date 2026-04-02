import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SearchBar from './components/SearchBar.jsx'
//import { WidgetCourse } from './components/Course.jsx'

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
    <SearchBar />
  </StrictMode>,
)