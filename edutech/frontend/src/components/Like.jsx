import { useState } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';

const LikeButton = ({ initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [active, setActive] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    setActive(!active);
    setLikes(active ? likes - 1 : likes + 1);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
  };

  return (
    <div className="flex items-center gap-2 select-none group">
      <button
        onClick={handleLike}
        className={`
          transition-all duration-200 
          ${animate ? 'scale-125' : 'scale-100'}
          /* COLOR: base suave, hover negro, activo negro */
          ${active ? 'text-black' : 'text-gray-400 hover:text-black/80'}
          p-1.5 rounded-full /* Un pequeño padding para que el hover se vea mejor */
          hover:bg-gray-100/50 /* Fondo muy sutil en hover */
        `}
      >
        <HandThumbUpIcon className="w-7 h-7" />
      </button>
      <span className={`font-bold text-xl transition-colors ${active ? 'text-black' : 'text-gray-600'}`}>
        {likes}
      </span>
    </div>
  );
};

export default LikeButton;