import React, { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import BellButton from './BellButton';

export const WidgetSubject = ({ 
  subjectName = "Subject", 
  courseName = "Course", 
  onNavigate, 
  onSubscribe,
  className = ""
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleSubscription = () => {
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

        <BellButton 
          isSubscribed={isSubscribed} 
          onClick={toggleSubscription} 
        />
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400 group-hover:w-2 transition-all" />
    </div>
  );
};

export default WidgetSubject;