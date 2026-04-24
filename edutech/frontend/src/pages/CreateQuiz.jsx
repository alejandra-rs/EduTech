import React, { useState } from 'react';
import QuizHeader from '../components/QuizHeader';
import Question from '../components/Question';
import { 
  PlusCircleIcon, 
  ChevronLeftIcon, 
  RocketLaunchIcon, 
  Bars3BottomLeftIcon 
} from "@heroicons/react/24/solid";

const CreateQuiz = () => {
  const [header, setHeader] = useState({ title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState(true);
  const [questions, setQuestions] = useState([
    { id: 'q-1', title: '', answers: [{ id: Date.now(), text: '', isCorrect: false }, { id: Date.now()+1, text: '', isCorrect: false }] }
  ]);

  const addQuestion = () => {
    const newId = `q-${Date.now()}`;
    setQuestions([...questions, { 
      id: newId, 
      title: '', 
      answers: [{ id: Date.now()+2, text: '', isCorrect: false }, { id: Date.now()+3, text: '', isCorrect: false }] 
    }]);
  };

  const deleteQuestion = (id) => {
    if (questions.length > 1) setQuestions(questions.filter(q => q.id !== id))
    else alert("El cuestionario debe tener al menos una pregunta.");
  };

  const updateQuestion = (id, updatedQ) => {
    setQuestions(questions.map(q => q.id === id ? updatedQ : q));
  };

  const scrollToQuestion = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const areQuestionsValid = questions.every(q => 
    q.title.trim() !== "" && 
    q.answers.some(a => a.isCorrect) &&
    q.answers.every(a => a.text.trim() !== "")
  );

  const isHeaderValid = header.title.trim() !== "";

  const canPublish = isHeaderValid && areQuestionsValid;

  const handlePublish = () => {
    if (!canPublish) {
      return alert("Por favor, rellena todos los campos y marca una respuesta correcta por pregunta.");
    }
    alert("¡Cuestionario publicado! 🚀");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside 
        className={`fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 transition-all duration-300 z-50 shadow-2xl ${
          showSidebar ? 'w-72' : 'w-0'
        }`}
      >
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className={`absolute top-10 -left-10 bg-white border border-gray-200 p-2 rounded-l-xl shadow-sm hover:bg-gray-50 transition-all ${!showSidebar ? 'translate-x-0' : ''}`}
        >
          <ChevronLeftIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${showSidebar ? 'rotate-180' : ''}`} />
        </button>

        <div className={`flex flex-col h-full p-5 overflow-hidden transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Esquema</h2>
          
          <button 
            onClick={handlePublish}
            disabled={!canPublish}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all mb-8
              ${canPublish ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            <RocketLaunchIcon className="w-4 h-4" />
            Publicar Cuestionario
          </button>

          <nav className="flex-1 overflow-y-auto space-y-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-white hover:shadow-sm text-left transition-all group"
              >
                <Bars3BottomLeftIcon className="w-4 h-4 text-gray-300 mt-0.5 group-hover:text-blue-500" />
                <span className="text-sm text-gray-600 group-hover:text-blue-600 truncate">
                  {q.title || `Pregunta ${index + 1}`}
                </span>
              </button>
            ))}
          </nav>

          {!canPublish && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100 mt-4">
              <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Requisitos faltantes:</p>
              <ul className="text-[10px] text-red-400 list-disc pl-3 space-y-1">
                {!isHeaderValid && <li>Título del cuestionario</li>}
                {questions.some(q => q.title.trim() === "") && <li>Títulos de pregunta vacíos</li>}
                {questions.some(q => !q.answers.some(a => a.isCorrect)) && <li>Marcar respuestas correctas</li>}
                {questions.some(q => q.answers.some(a => a.text.trim() === "")) && <li>Textos de respuesta vacíos</li>}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto p-12">
          <QuizHeader 
            title={header.title}
            description={header.description}
            onTitleChange={(v) => setHeader({ ...header, title: v })}
            onDescChange={(v) => setHeader({ ...header, description: v })}
          />

          <div className="space-y-6 mt-10">
            {questions.map((q) => (
              <div id={q.id} key={q.id} className="scroll-mt-24">
                <Question 
                  question={q} 
                  onUpdate={(newQ) => updateQuestion(q.id, newQ)}
                  onDelete={() => deleteQuestion(q.id)}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={addQuestion}
            className={`fixed bottom-8 p-3 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 active:scale-90 transition-all duration-300 group z-50 
              ${showSidebar ? 'right-[312px]' : 'right-8'}`}
          >
            <PlusCircleIcon className="w-8 h-8" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;