import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';

export const ViewsDisplay = ({ views = 0 }) => {
  const [showExact, setShowExact] = useState(false);

  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  return (
    <button 
      onClick={() => setShowExact(!showExact)}
      className={`
        flex items-center gap-2.5 px-4 py-2 
        bg-gray-100 rounded-full w-fit 
        transition-all duration-200
        hover:bg-gray-200 active:scale-95
        group select-none
      `}
    >
      <EyeIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
      
      <div className="flex items-baseline gap-1.5">
        <span className="font-extrabold text-2xl text-gray-600 leading-none tabular-nums">
          {showExact ? views : formatViews(views)}
        </span>
        
        <span className="font-medium text-sm text-gray-500 uppercase tracking-wide">
          Views
        </span>
      </div>
    </button>
  );
};

export default ViewsDisplay;