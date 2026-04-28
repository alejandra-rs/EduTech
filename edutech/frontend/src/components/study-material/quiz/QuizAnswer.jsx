import React from 'react';
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import Input from '../../Input';

const QuizAnswer = ({ value, onChange, onDelete, isCorrect, onToggleCorrect, canDelete = true }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 group ${
    isCorrect ? 'border-green-400 bg-green-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'
  }`}>
    <button
      onClick={onToggleCorrect}
      className={`w-5 h-5 rounded border flex items-center justify-center transition-all active:scale-75 flex-shrink-0 ${
        isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-gray-50 hover:border-green-400'
      }`}
    >
      {isCorrect && <CheckIcon className="w-3 h-3 stroke-[4px]" />}
    </button>

    <div className="flex-1">
      <Input
        autoResize
        rows={1}
        value={value}
        onChange={onChange}
        placeholder="Respuesta..."
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all bg-white overflow-hidden resize-none ${
          isCorrect ? 'text-green-900' : 'text-gray-700'
        }`}
      />
    </div>

    {canDelete && (
      <button onClick={onDelete} className="text-gray-300 p-1 rounded hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
        <TrashIcon className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default QuizAnswer;
