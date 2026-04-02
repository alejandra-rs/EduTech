import React, { useState } from 'react';
import { AcademicCapIcon, BellIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/solid';

export const WidgetSubject = ({ 
  subjectName = "Subject", 
  courseName = "Course", 
  onNavigate, 
  onSubscribe,
  className = ""
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleBellClick = (e) => {
    e.stopPropagation();
    const newState = !isSubscribed;
    setIsSubscribed(newState);
    if (onSubscribe) onSubscribe(newState);
  };

  return (
    <div 
      onClick={onNavigate}
      className={`group relative w-full max-w-[350px] h-[110px] bg-white rounded-[18px] border-2 border-solid border-black/20 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] overflow-hidden ${className}`}
    >
      <div className="flex h-full p-4 items-center gap-4">

        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <AcademicCapIcon className="w-7 h-7 text-gray-700" />
        </div>

        <div className="flex flex-col flex-grow min-w-0">
          <span className="text-xs font-medium italic text-gray-500 flex items-center gap-1">
            {courseName}
          </span>
          <h3 className="text-xl font-bold text-black truncate leading-tight">
            {subjectName}
          </h3>
        </div>

        <button 
          onClick={handleBellClick}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
            ${isSubscribed 
              ? 'bg-yellow-100 text-yellow-600 shadow-inner' 
              : 'bg-gray-50 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
            }`}
          title={isSubscribed ? "Anular suscripción" : "Suscribirme"}
        >
          <BellIcon className={`w-6 h-6 ${isSubscribed ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400 group-hover:w-2 transition-all" />
    </div>
  );
};

export default WidgetSubject;