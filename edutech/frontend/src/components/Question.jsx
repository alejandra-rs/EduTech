import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";
import Answer from './Answer';

const Question = () => {
  const [answers, setAnswers] = useState([
    { id: 1, text: '', isCorrect: false },
    { id: 2, text: '', isCorrect: false }
  ]);
  const [title, setTitle] = useState('');
  const titleRef = useRef(null);

  // Ajustar altura del título
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const addAnswer = () => {
    setAnswers([...answers, { id: Date.now(), text: '', isCorrect: false }]);
  };

  const deleteAnswer = (id) => {
    if (answers.length > 1) setAnswers(answers.filter(ans => ans.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          <textarea 
            ref={titleRef}
            rows="1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Cuál es tu pregunta?" 
            className="text-2xl font-bold text-gray-800 outline-none w-full placeholder:text-gray-300 resize-none overflow-hidden"
          />
          <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full"></div>
        </div>
        
        <button 
          onClick={addAnswer}
          className={`
            flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm border border-blue-100
            transition-all duration-150 
            hover:bg-blue-600 hover:text-white 
            active:scale-95 active:shadow-inner active:bg-blue-700
          `}
        >
          <PlusIcon className="w-5 h-5 stroke-[2.5px]" />
          Añadir
        </button>
      </div>

      <div className="space-y-4">
        {answers.map((answer) => (
          <Answer
            key={answer.id}
            value={answer.text}
            isCorrect={answer.isCorrect}
            onChange={(e) => {
                setAnswers(answers.map(ans => 
                    ans.id === answer.id ? { ...ans, text: e.target.value } : ans
                ));
            }}
            onDelete={() => deleteAnswer(answer.id)}
            onToggleCorrect={() => {
                setAnswers(answers.map(ans => 
                    ans.id === answer.id ? { ...ans, isCorrect: !ans.isCorrect } : ans
                ));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Question;