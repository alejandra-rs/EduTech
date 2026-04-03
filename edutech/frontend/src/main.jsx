import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BellButton from './components/BellButton.jsx';

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <BellButton />
  </StrictMode>,
)