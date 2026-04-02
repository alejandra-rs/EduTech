import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LikeButton from './components/Like.jsx'
import DislikeButton from './components/Dislike.jsx'
import ViewsDisplay from './components/Views.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <div className="min-h-screen bg-white p-10 flex gap-10 items-start">
      <LikeButton initialLikes={10} />
      <DislikeButton initialDislikes={2} />
      <ViewsDisplay views={1530} />
    </div>
  </StrictMode>,
)