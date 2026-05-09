import React from 'react';
import Input from '../Input';

export interface EditorHeaderProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescChange: (value: string) => void;
}

const EditorHeader = ({ 
  title, 
  description, 
  onTitleChange, 
  onDescChange 
}: EditorHeaderProps) => {
  return (
    <div className="mb-10 space-y-4">
      <div className="group border-b border-gray-100 pb-2">
        <Input
          noBorder
          label="Título"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTitleChange(e.target.value)}
          placeholder="Título"
        />
        <div className="h-0.5 w-0 group-focus-within:w-full bg-blue-500 transition-all duration-500 rounded-full" />
      </div>

      <Input
        textarea
        autoResize
        label="Descripción"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onDescChange(e.target.value)}
        placeholder="Escribe una descripción (opcional)"
      />
    </div>
  );
};

export default EditorHeader;