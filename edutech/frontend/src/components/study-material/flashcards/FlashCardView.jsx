import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const FlashCardView = ({ card, onResult }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAnswer = (isCorrect) => {
    onResult(card.id, isCorrect);
    setIsFlipped(false);
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full">
      <div
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          minHeight: '16rem',
        }}
        className="w-full"
      >
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 bg-white border-2 border-gray-100 rounded-[2rem] shadow-sm
                     flex flex-col items-center justify-center p-8 text-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">
            Pregunta
          </span>
          <p className="text-xl font-bold text-gray-800 leading-tight">{card.question}</p>
          <button
            onClick={() => setIsFlipped(true)}
            className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase
                       hover:bg-indigo-50 px-4 py-2 rounded-full transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Ver Respuesta
          </button>
        </div>

        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 bg-indigo-600 rounded-[2rem] shadow-xl
                     flex flex-col items-center justify-center p-8 text-center text-white"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-4">
            Respuesta
          </span>
          <p className="text-lg font-medium mb-8">{card.answer}</p>

          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-2 bg-white/10 hover:bg-red-500 text-white
                         px-5 py-2.5 rounded-2xl transition-all font-bold text-xs uppercase"
            >
              <XMarkIcon className="w-5 h-5" /> No la sabía
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-green-500
                         hover:text-white px-5 py-2.5 rounded-2xl transition-all font-bold text-xs
                         uppercase shadow-lg"
            >
              <CheckIcon className="w-5 h-5 stroke-[3px]" /> La sabía
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardView;
