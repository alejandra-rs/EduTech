import React, { useRef, useEffect } from 'react';
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

const Answer = ({ value, onChange, onDelete, isCorrect, onToggleCorrect }) => {
  const textareaRef = useRef(null);

  // Ajustar altura automáticamente
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={`
      flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-300 group
      ${isCorrect 
        ? 'border-green-500 bg-green-50 shadow-md' 
        : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}
    `}>
      <button
        onClick={onToggleCorrect}
        className={`
          mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center 
          transition-all duration-200 active:scale-75 flex-shrink-0
          ${isCorrect 
            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' 
            : 'border-gray-300 bg-gray-50 hover:border-green-400'}
        `}
      >
        {isCorrect && <CheckIcon className="w-4 h-4 stroke-[3px]" />}
      </button>
      
      <textarea
        ref={textareaRef}
        rows="1"
        value={value}
        onChange={onChange}
        placeholder="Escribe una respuesta..."
        className={`
          flex-1 outline-none bg-transparent text-sm font-medium transition-colors resize-none overflow-hidden py-1
          ${isCorrect ? 'text-green-900 placeholder:text-green-300' : 'text-gray-600'}
        `}
      />

      <button 
        onClick={onDelete}
        className={`
          text-gray-300 p-1.5 rounded-lg transition-all duration-200
          hover:text-red-500 hover:bg-red-50 hover:rotate-12
          active:scale-75 active:rotate-0
        `}
        title="Eliminar"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Answer;