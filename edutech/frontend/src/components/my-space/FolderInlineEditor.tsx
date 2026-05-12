import React, { useState } from 'react';
import Input from '../Input';

interface FolderInlineEditorProps {
  existingNames: string[];
  onSave: (value: string) => void;
  onCancel: () => void;
}

export const FolderInlineEditor = ({ 
  existingNames, 
  onSave, 
  onCancel 
}: FolderInlineEditorProps) => {
  const [value, setValue] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    const duplicate = existingNames.some(
      name => name.toLowerCase() === newValue.trim().toLowerCase()
    );
    setIsDuplicate(duplicate);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDuplicate) {
      const trimmedValue = value.trim();
      if (trimmedValue === '') {
        onCancel();
      } else {
        onSave(trimmedValue);
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="w-full">
      <div className="group pb-2">
        <Input
          noBorder
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="nombre..."
          className={`text-4xl font-extrabold font-['Montserrat'] leading-tight transition-colors duration-300 ${
            isDuplicate ? 'text-red-500' : 'text-main-black'
          }`}
        />
        
        <div className={`h-1 transition-all duration-500 rounded-full mt-1 ${
          isDuplicate 
            ? 'w-full bg-red-500'
            : 'w-0 group-focus-within:w-full bg-blue-500'
        }`} />

        {isDuplicate && (
          <p className="text-red-500 text-xs mt-2 font-bold animate-pulse">
            Ya tienes una carpeta con este nombre aquí
          </p>
        )}
      </div>
    </div>
  );
};