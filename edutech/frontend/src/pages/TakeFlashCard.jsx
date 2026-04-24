import React, { useState } from 'react';
import FlashCardView from '../components/FlashCardView';
import QuizStats from '../components/Stats';
import { 
  ChevronLeftIcon, 
  ArrowPathIcon,
  Square3Stack3DIcon
} from "@heroicons/react/24/solid";

const TakeFlashCard = ({ flashData }) => {
  const [results, setResults] = useState({}); // { cardId: true/false }
  const [showSidebar, setShowSidebar] = useState(true);

  const cards = flashData?.items || [];

  const handleResult = (id, isCorrect) => {
    setResults(prev => ({ ...prev, [id]: isCorrect }));
  };

  const handleReset = () => {
    if (window.confirm("¿Reiniciar sesión de estudio?")) {
      setResults({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stats = {
    total: cards.length,
    correct: Object.values(results).filter(v => v === true).length,
    incorrect: Object.values(results).filter(v => v === false).length,
    answered: Object.keys(results).length
  };

  return (
    <div className="flex min-h-screen bg-white">

      <aside className={`fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 transition-all duration-300 z-50 shadow-2xl ${showSidebar ? 'w-72' : 'w-0'}`}>
        <button onClick={() => setShowSidebar(!showSidebar)} className="absolute top-10 -left-10 bg-white border border-gray-200 p-2 rounded-l-xl shadow-sm">
          <ChevronLeftIcon className={`w-5 h-5 text-gray-500 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
        </button>

        <div className={`flex flex-col h-full p-5 overflow-hidden transition-opacity ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Estudio</h2>
          <QuizStats stats={stats} />

          <div className="mt-6">
            <button onClick={handleReset} className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <ArrowPathIcon className="w-3.5 h-3.5" />
              Reiniciar Mazo
            </button>
          </div>

          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-10 mb-4">Tarjetas</h2>
          <nav className="flex-1 overflow-y-auto space-y-1">
            {cards.map((c, index) => (
              <button 
                key={c.id} 
                onClick={() => document.getElementById(`card-${c.id}`).scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white transition-all group"
              >
                <div className={`w-2 h-2 rounded-full ${results[c.id] === undefined ? 'bg-gray-200' : results[c.id] ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-[12px] text-gray-600 truncate font-medium">Tarjeta {index + 1}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <div className="max-w-4xl mx-auto p-12">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">
              <Square3Stack3DIcon className="w-4 h-4" />
              Sesión de Flashcards
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">{flashData?.title}</h1>
            <p className="text-lg text-gray-500 leading-relaxed">{flashData?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((c) => (
              <div id={`card-${c.id}`} key={c.id} className="scroll-mt-28">
                <FlashCardView 
                  card={c} 
                  onResult={handleResult}
                  currentResult={results[c.id]}
                />
              </div>
            ))}
          </div>

          {stats.answered === stats.total && (
            <div className="mt-16 p-12 bg-indigo-600 rounded-[3rem] text-center text-white shadow-2xl shadow-indigo-200 animate-in zoom-in">
              <h2 className="text-3xl font-bold mb-2">¡Mazo completado! 🎯</h2>
              <p className="text-indigo-100 mb-8 font-medium">Has repasado todos los conceptos de esta sesión.</p>
              <div className="flex justify-center gap-8 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-black">{stats.correct}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-70">Dominadas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black">{stats.incorrect}</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-70">A repasar</div>
                </div>
              </div>
              <button onClick={handleReset} className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                Estudiar de nuevo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TakeFlashCard;