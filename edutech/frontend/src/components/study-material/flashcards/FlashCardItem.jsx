import React from 'react';
import { TrashIcon } from "@heroicons/react/24/outline";
import Input from '../../Input';

const FlashCardItem = ({ card, onUpdate, onDelete }) => (
  <div className="flex gap-3 items-start group animate-in fade-in slide-in-from-bottom-2">
    <div className="flex-1 grid grid-cols-2 gap-3">
      <Input
        rows={2}
        autoResize
        label="Pregunta"
        value={card.question}
        onChange={(e) => onUpdate({ ...card, question: e.target.value })}
        placeholder="Escribe la pregunta..."
      />
      <Input
        rows={2}
        autoResize
        label="Respuesta"
        value={card.answer}
        onChange={(e) => onUpdate({ ...card, answer: e.target.value })}
        placeholder="Escribe la respuesta..."
      />
    </div>
    <button
      onClick={onDelete}
      className="mt-8 text-gray-300 p-1 rounded hover:text-red-500 hover:bg-red-50 hover:rotate-12 active:scale-75 transition-all"
      title="Eliminar flashcard"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  </div>
);

export default FlashCardItem;
