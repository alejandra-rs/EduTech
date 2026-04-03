import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import SearchBar from '../components/SearchBar';
import BellButton from '../components/BellButton';
import Tabs from '../components/Tabs';
import PostGrid from '../components/PostGrid';
import NotebookFooter from '../components/Footer';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [activeTabs, setActiveTabs] = useState([]); 

  const [isSubscribed, setIsSubscribed] = useState(() => {
    const saved = localStorage.getItem(`sub-${subjectId}`);
    return saved === 'true';
  });

  const handleToggleSubscription = () => {
    const newState = !isSubscribed;
    setIsSubscribed(newState);
    localStorage.setItem(`sub-${subjectId}`, newState);
  };

  const dummyPosts = [
    { id: 1, title: "Apuntes Tema 1", type: "pdf", date: "2026-03-20", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: 2, title: "Resumen Final", type: "pdf", date: "2026-03-22", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: 3, title: "Guía de estudio", type: "pdf", date: "2026-03-23", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: 4, title: "Examen 2025", type: "pdf", date: "2026-03-24", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  ];

  const filteredPosts = dummyPosts.filter(post => {
    if (activeTabs.length === 0) return true; 
    return activeTabs.includes(post.type);    
  });

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white z-20">
        <div className="px-12 pt-10 pb-6 flex justify-between items-center">
          <div onClick={() => navigate(-1)} className="group flex items-center gap-4 cursor-pointer">
            <span className="text-4xl font-light group-hover:-translate-x-2 transition-transform">{'<'}</span>
            <h1 className="text-5xl font-bold text-gray-800 uppercase tracking-tight">
              {subjectId || "CALCULO"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <PlusCircleIcon className="w-10 h-10" />
            </button>
            <BellButton isSubscribed={isSubscribed} onClick={handleToggleSubscription} />
          </div>
        </div>
        <div className="px-12 pb-6">
          <div className="max-w-4xl mx-auto">
            <SearchBar placeholder="Buscar en esta asignatura..." color="bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
              <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
            </div>

            <div className="mb-20">
                {filteredPosts.length > 0 ? (
                    <PostGrid posts={filteredPosts} />
                ) : (
                    <div className="text-center py-20 text-gray-400 italic">
                        No hay recursos que coincidan con los filtros seleccionados.
                    </div>
                )}
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <NotebookFooter />
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;