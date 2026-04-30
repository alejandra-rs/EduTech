import React, { useRef } from 'react';
import Input from '../Input';

const EditorHeader = ({ title, description, onTitleChange, onDescChange }) => {
  return (
    <div className="mb-10 space-y-4">
      <div className="group border-b border-gray-100 pb-2">
        <Input
          noBorder
          label="Título"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Título"
        />
        <div className="h-0.5 w-0 group-focus-within:w-full bg-blue-500 transition-all duration-500 rounded-full" />
      </div>

      <Input
        textarea
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
