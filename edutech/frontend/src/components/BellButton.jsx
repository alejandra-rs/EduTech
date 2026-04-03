import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const BellButton = ({ isSubscribed, onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
        ${isSubscribed 
          ? 'bg-yellow-100 text-yellow-600 shadow-inner' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        } ${className}`}
    >
      <BellIcon className={`w-6 h-6 ${isSubscribed ? 'fill-current' : ''}`} />
    </button>
  );
};

export default BellButton;