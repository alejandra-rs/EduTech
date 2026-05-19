import React, { useEffect, useRef, useState } from 'react';

interface FolderInlineEditorProps {
  existingNames: string[];
  onSave: (value: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

export const FolderInlineEditor = ({
  existingNames,
  onSave,
  onCancel,
  initialValue = '',
}: FolderInlineEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsDuplicate(
      existingNames.some(name => name.toLowerCase() === newValue.trim().toLowerCase())
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDuplicate) {
      const trimmed = value.trim();
      if (trimmed === '') {
        onCancel();
      } else {
        onSave(trimmed);
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="w-full">
      <div className="group pb-1">
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="nombre..."
          className={`w-full bg-transparent outline-none text-sm font-semibold transition-colors duration-300 ${
            isDuplicate ? 'text-red-500' : 'text-gray-800'
          }`}
        />
        <div className={`h-0.5 transition-all duration-500 rounded-full mt-1 ${
          isDuplicate
            ? 'w-full bg-red-500'
            : 'w-0 group-focus-within:w-full bg-blue-500'
        }`} />
        {isDuplicate && (
          <p className="text-red-500 text-xs mt-1 font-semibold animate-pulse">
            Ya tienes una carpeta con este nombre
          </p>
        )}
      </div>
    </div>
  );
};
