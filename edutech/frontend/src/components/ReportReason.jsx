import React, { useState } from 'react';

export const ReportReason = ({ type, comment, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;

  const hasComment = comment && comment.length > 0;
  const shouldShowButton = hasComment && comment.length > maxLength;
  const displayedComment = isExpanded ? comment : `${comment.substring(0, maxLength)}...`;

  return (
    <div className="p-4 border-b border-gray-100 last:border-0 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-gray-900 tracking-tight">
          {type}
        </span>
        <span className="text-[10px] font-medium text-gray-400">
          {date}
        </span>
      </div>

      {hasComment ? (
        <p className="text-sm text-gray-600 leading-relaxed">
          {shouldShowButton ? displayedComment : comment}
          {shouldShowButton && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="ml-2 text-blue-600 hover:underline font-bold text-xs"
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </p>
      ) : (
        <p className="text-xs italic text-gray-400 mt-1 italic">
          Sin comentarios adicionales.
        </p>
      )}
    </div>
  );
};