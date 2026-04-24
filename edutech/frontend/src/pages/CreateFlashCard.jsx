import React, { useState } from 'react';
import QuizHeader from '../components/QuizHeader';
import FlashCardItem from '../components/FlashCardItem';
import { 
  PlusCircleIcon, 
  ChevronLeftIcon, 
  Square3Stack3DIcon, 
  Bars3BottomLeftIcon 
} from "@heroicons/react/24/solid";

const CreateFlashCard = () => {
  const [header, setHeader] = useState({ title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState(true);
  const [cards, setCards] = useState([
    { id: 'c-1', front: '', back: '' }
  ]);

  const addCard = () => {
    setCards([...cards, { id: `c-${Date.now()}`, front: '', back: '' }]);
  };

  const deleteCard = (id) => {
    if (cards.length > 1) setCards(cards.filter(c => c.id !== id));
    else alert("Necesitas al menos una flashcard.");
  };

  const updateCard = (id, updatedCard) => {
    setCards(cards.map(c => c.id === id ? updatedCard : c));
  };

  const scrollToCard = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isHeaderValid = header.title.trim() !== "";
  const emptyFronts = cards.some(c => c.front.trim() === "");
  const emptyBacks = cards.some(c => c.back.trim() === "");
  const canPublish = isHeaderValid && !emptyFronts && !emptyBacks;

  const handlePublish = () => {
    if (!canPublish) return alert("Rellena todos los campos antes de publicar.");
    alert("¡Flashcards publicadas! 🎴");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className={`fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 transition-all duration-300 z-50 shadow-2xl ${showSidebar ? 'w-72' : 'w-0'}`}>
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
              ${canPublish ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Square3Stack3DIcon className="w-4 h-4" />
            Publicar Flashcards
          </button>

          <nav className="flex-1 overflow-y-auto space-y-2">
            {cards.map((c, index) => (
              <button
                key={c.id}
                onClick={() => scrollToCard(c.id)}
                className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-white hover:shadow-sm text-left transition-all group"
              >
                <Bars3BottomLeftIcon className="w-4 h-4 text-gray-300 mt-0.5 group-hover:text-indigo-500" />
                <span className="text-xs text-gray-600 group-hover:text-indigo-600 truncate font-medium">
                  {c.front || `Tarjeta ${index + 1}`}
                </span>
              </button>
            ))}
          </nav>

          {!canPublish && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100 mt-4">
              <p className="text-[10px] text-red-500 font-bold uppercase mb-1 tracking-tighter">Requisitos faltantes:</p>
              <ul className="text-[10px] text-red-400 list-disc pl-3 space-y-1 font-medium">
                {!isHeaderValid && <li>Título del mazo</li>}
                {emptyFronts && <li>Preguntas vacías</li>}
                {emptyBacks && <li>Respuestas vacías</li>}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <div className="max-w-4xl mx-auto p-12 pb-32">
          <QuizHeader 
            title={header.title}
            description={header.description}
            onTitleChange={(v) => setHeader({ ...header, title: v })}
            onDescChange={(v) => setHeader({ ...header, description: v })}
          />

          <div className="space-y-4 mt-10">
            {cards.map((c) => (
              <div id={c.id} key={c.id} className="scroll-mt-24">
                <FlashCardItem 
                  card={c} 
                  onUpdate={(newC) => updateCard(c.id, newC)}
                  onDelete={() => deleteCard(c.id)}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={addCard}
            className={`fixed bottom-8 p-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 active:scale-90 transition-all duration-300 group z-50 
              ${showSidebar ? 'right-[312px]' : 'right-8'}`}
          >
            <PlusCircleIcon className="w-8 h-8" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateFlashCard;