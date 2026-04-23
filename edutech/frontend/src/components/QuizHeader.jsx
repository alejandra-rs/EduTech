import React, { useRef, useEffect } from 'react';

const QuizHeader = ({ title, description, onTitleChange, onDescChange }) => {
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const autoResize = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => autoResize(titleRef), [title]);
  useEffect(() => autoResize(descRef), [description]);

  return (
    <div className="mb-10 space-y-4">
      <div className="group border-b border-gray-100 pb-2">
        <textarea
          ref={titleRef}
          rows="1"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Título del cuestionario"
          className="w-full text-3xl font-extrabold text-gray-800 outline-none resize-none overflow-hidden bg-transparent placeholder:text-gray-200 transition-all"
        />
        <div className="h-0.5 w-0 group-focus-within:w-full bg-blue-500 transition-all duration-500 rounded-full"></div>
      </div>

      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus-within:bg-white focus-within:border-gray-200 transition-all">
        <label className="text-[10px] font-bold text-gray-400 uppercase px-1 block mb-1">Descripción</label>
        <textarea
          ref={descRef}
          rows="1"
          value={description}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="¿De qué trata este cuestionario?"
          className="w-full text-sm text-gray-600 outline-none resize-none overflow-hidden bg-transparent placeholder:text-gray-300"
        />
      </div>
    </div>
  );
};

export default QuizHeader;