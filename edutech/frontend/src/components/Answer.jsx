import React, { useRef, useEffect } from 'react';
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

const Answer = ({ value, onChange, onDelete, isCorrect, onToggleCorrect, canDelete = true }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={`flex items-start gap-2 p-1.5 px-2.5 rounded-lg border transition-all duration-200 group ${
      isCorrect ? 'border-green-400 bg-green-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'
    }`}>
      <button
        onClick={onToggleCorrect}
        className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-all active:scale-75 flex-shrink-0 ${
          isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-gray-50 hover:border-green-400'
        }`}
      >
        {isCorrect && <CheckIcon className="w-3 h-3 stroke-[4px]" />}
      </button>
      
      <textarea
        ref={textareaRef}
        rows="1"
        value={value}
        onChange={onChange}
        placeholder="Respuesta..."
        className={`flex-1 outline-none bg-transparent text-[10px] font-medium transition-colors resize-none overflow-hidden py-0.5 ${
          isCorrect ? 'text-green-900' : 'text-gray-600'
        }`}
      />

      {canDelete && (
        <button
          onClick={onDelete}
          className="mt-0.5 text-gray-300 p-1 rounded hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Answer;