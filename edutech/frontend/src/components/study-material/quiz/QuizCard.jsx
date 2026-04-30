import React from 'react';
import { CheckIcon } from "@heroicons/react/24/outline";

const QuizCard = ({ question, onAnswered, isCorrected, selectedIds, onSelect, onReset }) => {
  const isMultiple = question.answers.filter(a => a.isCorrect).length > 1;

  const handleCorrect = () => {
    const correctIds = question.answers.filter(a => a.isCorrect).map(a => a.id);
    const isPerfect = isMultiple 
      ? correctIds.length === selectedIds.length && selectedIds.every(id => correctIds.includes(id))
      : question.answers.find(a => a.id === selectedIds[0])?.isCorrect || false;

    onAnswered(question.id, isPerfect);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800 leading-snug">{question.title}</h3>
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {isMultiple ? "Múltiple" : "Única"}
        </span>
      </div>
      
      <div className="space-y-2">
        {question.answers.map((ans) => {
          const isSelected = selectedIds.includes(ans.id);
          let statusStyle = "border-gray-100 bg-white hover:border-gray-300";
          if (isSelected) statusStyle = "border-orange-400 bg-orange-50/30";
          if (isCorrected) {
            if (ans.isCorrect) statusStyle = "border-green-400 bg-green-50/50 text-green-900";
            else if (isSelected && !ans.isCorrect) statusStyle = "border-red-300 bg-red-50/50 text-red-900";
            else statusStyle = "border-gray-50 bg-white opacity-40";
          }

          return (
            <button
              key={ans.id}
              disabled={isCorrected}
              onClick={() => onSelect(question.id, ans.id, isMultiple)}
              className={`w-full flex items-center gap-3 p-3.5 px-4 rounded-lg border transition-all text-left text-sm font-medium ${statusStyle}`}
            >
              <div className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-all ${
                isMultiple ? 'rounded' : 'rounded-full'
              } ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300 bg-gray-50'}`}>
                {isSelected && <CheckIcon className="w-3 h-3 stroke-[4px]" />}
              </div>
              {ans.text}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex justify-between items-center border-t border-gray-50 pt-4">
        <button 
          onClick={() => onReset(question.id)}
          disabled={isCorrected}
          className={`text-[10px] font-bold uppercase transition-colors ${
            isCorrected || selectedIds.length === 0 ? 'opacity-0' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          Desmarcar
        </button>
        
        {!isCorrected ? (
          <button
            onClick={handleCorrect}
            className="px-5 py-1.5 rounded-lg font-bold text-[11px] bg-gray-800 text-white shadow-lg active:scale-95 hover:bg-black transition-all"
          >
            Corregir
          </button>
        ) : (
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic bg-gray-50 px-3 py-1 rounded-full">
            Respondida
          </span>
        )}
      </div>
    </div>
  );
};

export default QuizCard;