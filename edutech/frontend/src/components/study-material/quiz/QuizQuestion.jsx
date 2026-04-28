import React, { useRef } from 'react';
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import QuizAnswer from './QuizAnswer';
import { useAutoResize } from '../useAutoResize';

const QuizQuestion = ({ question, onUpdate, onDelete, canDelete = true }) => {
  const titleRef = useRef(null);
  useAutoResize(titleRef, question.title);

  const addAnswer = () => {
    onUpdate({ ...question, answers: [...question.answers, { id: crypto.randomUUID(), text: '', isCorrect: false }] });
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
            <div className="h-0.5 w-8 bg-blue-500 mt-1 rounded-full" />
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
            <QuizAnswer
              key={ans.id}
              value={ans.text}
              isCorrect={ans.isCorrect}
              canDelete={question.answers.length > 2}
              onChange={(e) => onUpdate({ ...question, answers: question.answers.map(a => a.id === ans.id ? { ...a, text: e.target.value } : a) })}
              onDelete={() => onUpdate({ ...question, answers: question.answers.filter(a => a.id !== ans.id) })}
              onToggleCorrect={() => onUpdate({ ...question, answers: question.answers.map(a => a.id === ans.id ? { ...a, isCorrect: !ans.isCorrect } : a) })}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onDelete}
        disabled={!canDelete}
        className="mt-4 p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:border-gray-200"
        title="Eliminar pregunta"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuizQuestion;
