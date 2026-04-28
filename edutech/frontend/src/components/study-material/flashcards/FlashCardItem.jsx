import React, { useRef } from 'react';
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAutoResize } from '../useAutoResize';

const FlashCardItem = ({ card, onUpdate, onDelete }) => {
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useAutoResize(frontRef, card.front);
  useAutoResize(backRef, card.back);

  return (
    <div className="flex gap-3 items-center group animate-in fade-in slide-in-from-bottom-2">
      <div className="flex-1 flex bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-blue-500/20">

        <div className="flex-1 p-5 bg-gray-50/50 border-r border-gray-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Pregunta</span>
          <textarea
            ref={frontRef}
            rows="1"
            value={card.front}
            onChange={(e) => onUpdate({ ...card, front: e.target.value })}
            placeholder="Escribe la pregunta..."
            className="text-sm font-bold text-gray-800 outline-none w-full placeholder:text-gray-300 resize-none overflow-hidden bg-transparent"
          />
        </div>

        <div className="flex-1 p-5 bg-white">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Respuesta</span>
          <textarea
            ref={backRef}
            rows="1"
            value={card.back}
            onChange={(e) => onUpdate({ ...card, back: e.target.value })}
            placeholder="Escribe la respuesta..."
            className="text-sm font-medium text-gray-600 outline-none w-full placeholder:text-gray-300 resize-none overflow-hidden bg-transparent"
          />
        </div>
      </div>

      <button
        onClick={onDelete}
        className="mt-0.5 text-gray-300 p-1 rounded hover:text-red-500 hover:bg-red-50 hover:rotate-12 active:scale-75 transition-all"
        title="Eliminar flashcard"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FlashCardItem;
