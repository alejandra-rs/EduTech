import React, { useState } from 'react';

export const DocumentReport = ({ type, comment, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;

  const hasComment = comment && comment.length > 0;
  const shouldShowButton = hasComment && comment.length > maxLength;
  const displayedComment = hasComment && !isExpanded && shouldShowButton
    ? `${comment.substring(0, maxLength)}…`
    : comment;

  return (
    <div className="p-4 border-b border-gray-100 last:border-0 bg-white">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-md font-bold text-gray-900 tracking-tight"> {type} </span>
        <span className="text-xs text-gray-500"> {date} </span>
      </div>

      {hasComment ? (
        <p className="text-sm text-gray-600 leading-relaxed break-all whitespace-normal">
          {shouldShowButton ? displayedComment : comment}
          {shouldShowButton && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="ml-2 text-gray-400 hover:underline font-bold text-xs shrink-0"
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </p>
      ) : (
        <p className="text-sm italic text-gray-400 mt-1"> Sin comentario.</p>
      )}
    </div>
  );
};