import { useState } from 'react';
import { HandThumbDownIcon } from '@heroicons/react/24/solid';

export const DislikeButton = ({ getDislikess = 0 }) => {
  const [dislikes, setDislikes] = useState(getDislikess);
  const [active, setActive] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleDislike = () => {
    setActive(!active);
    setDislikes(active ? dislikes - 1 : dislikes + 1);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
  };

  return (
    <div className="flex items-center gap-2 select-none group">
      <button
        onClick={handleDislike}
        className={`
          transition-all duration-200 
          ${animate ? 'scale-125' : 'scale-100'}
          ${active ? 'text-black' : 'text-gray-400 hover:text-black/80'}
          p-1.5 rounded-full
          hover:bg-gray-100/50
        `}
      >
        <HandThumbDownIcon className="w-7 h-7" />
      </button>
      <span className={`font-bold text-xl transition-colors ${active ? 'text-black' : 'text-gray-600'}`}>
        {dislikes}
      </span>
    </div>
  );
};

export default DislikeButton;
