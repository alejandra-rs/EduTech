import React, { useState } from 'react';

export const ReportReason = ({ user, reason, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;

  const shouldShowButton = reason.length > maxLength;
  const displayedText = isExpanded ? reason : `${reason.substring(0, maxLength)}...`;

  return (
    <div className="flex gap-3 p-4 border-b border-gray-100 last:border-0 bg-gray-50/50">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
        {user[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{user}</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {shouldShowButton ? displayedText : reason}
          {shouldShowButton && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="ml-2 text-blue-600 hover:underline font-medium"
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};