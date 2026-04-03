import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const BellButton = ({ isSubscribed, onClick, className = "" }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <button 
      onClick={handleClick}
      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
        ${isSubscribed 
          ? 'bg-yellow-100 text-yellow-600 shadow-inner' 
          : 'bg-gray-50 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
        } ${className}`}
      title={isSubscribed ? "Anular suscripción" : "Suscribirme"}
    >
      <BellIcon className={`w-6 h-6 ${isSubscribed ? 'fill-current' : ''}`} />
    </button>
  );
};

export default BellButton;