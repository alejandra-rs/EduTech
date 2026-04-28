import React, { useRef } from 'react';
import { useAutoResize } from './useAutoResize';
import Input from '../Input';

const EditorHeader = ({ title, description, onTitleChange, onDescChange }) => {
  const titleRef = useRef(null);
  useAutoResize(titleRef, title);

  return (
    <div className="mb-10 space-y-4">
      <div className="group border-b border-gray-100 pb-2">
        <textarea
          ref={titleRef}
          rows="1"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Título"
          className="w-full text-2xl font-extrabold text-gray-800 outline-none resize-none overflow-hidden bg-transparent placeholder:text-gray-200 transition-all"
        />
        <div className="h-0.5 w-0 group-focus-within:w-full bg-blue-500 transition-all duration-500 rounded-full" />
      </div>

      <Input
        rows={3}
        autoResize
        label="Descripción"
        value={description}
        onChange={(e) => onDescChange(e.target.value)}
        placeholder="Escribe una descripción (opcional)"
      />
    </div>
  );
};

export default EditorHeader;
