import React, { useRef, useEffect } from 'react';
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Answer from './Answer';

const Question = ({ question, onUpdate, onDelete }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [question.title]);

  const addAnswer = () => {
    const newAnswer = { id: Date.now(), text: '', isCorrect: false };
    onUpdate({ ...question, answers: [...question.answers, newAnswer] });
  };

  return (
    <div className="flex gap-2 items-start animate-in fade-in slide-in-from-bottom-2">
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <textarea 
              ref={titleRef}
              rows="1"
              value={question.title}
              onChange={(e) => onUpdate({ ...question, title: e.target.value })}
              placeholder="Pregunta sin título" 
              className="text-sm font-bold text-gray-800 outline-none w-full placeholder:text-gray-300 resize-none overflow-hidden bg-transparent"
            />
            <div className="h-0.5 w-8 bg-blue-500 mt-1 rounded-full"></div>
          </div>
          
          <button 
            onClick={addAnswer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90 font-medium text-xs border border-gray-100"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5px]" />
            Respuesta
          </button>
        </div>

        <div className="space-y-2">
          {question.answers.map((ans) => (
            <Answer
              key={ans.id}
              value={ans.text}
              isCorrect={ans.isCorrect}
              onChange={(e) => {
                const newAnswers = question.answers.map(a => a.id === ans.id ? { ...a, text: e.target.value } : a);
                onUpdate({ ...question, answers: newAnswers });
              }}
              onDelete={() => {
                if(question.answers.length > 2) {
                  onUpdate({ ...question, answers: question.answers.filter(a => a.id !== ans.id) });
                } else {
                  alert("Cada pregunta debe tener al menos 2 respuestas.");
                }
              }}
              onToggleCorrect={() => {
                const newAnswers = question.answers.map(a => a.id === ans.id ? { ...a, isCorrect: !ans.isCorrect } : a);
                onUpdate({ ...question, answers: newAnswers });
              }}
            />
          ))}
        </div>
      </div>
      
      <button 
        onClick={onDelete}
        className="mt-4 p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:shadow-lg active:scale-90 transition-all shadow-sm"
        title="Eliminar pregunta"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Question;