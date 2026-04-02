import { useState } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';

export const LikeButton = ({ initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [active, setActive] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    setActive(!active);
    setLikes(active ? likes - 1 : likes + 1);
    
    // Disparamos la animación de salto
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
  };

  return (
    <div className="flex items-center gap-2 font-bold">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita que el click afecte al padre (WidgetCourse)
          handleLike();
        }}
        className={`
          transition-all duration-200 ease-in-out
          ${animate ? 'scale-125 -translate-y-1' : 'scale-100'}
          ${active ? 'text-black' : 'text-gray-400'}
        `}
      >
        <HandThumbUpIcon className="w-6 h-6" />
      </button>
      <span className="text-black">{likes}</span>
    </div>
  );
};

export default LikeButton;