import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizStats from '../components/Stats';
import QuizCard from '../components/study-material/quiz/QuizCard';
import { getDocument } from '@services/connections';
import {
  Bars3BottomLeftIcon,
  ChevronLeftIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

const transformQuizData = (post) => ({
  title: post.title,
  description: post.description,
  questions: (post.qui?.questions || []).map(q => ({
    id: q.id,
    title: q.title,
    answers: q.answers.map(a => ({
      id: a.id,
      text: a.text,
      isCorrect: a.is_correct,
    })),
  })),
});

const TakeQuiz = () => {
  const { id, subjectId, postId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});
  const [results, setResults] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    getDocument(postId)
      .then(post => setQuizData(transformQuizData(post)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const questions = quizData?.questions || [];

  const handleSelect = (qId, ansId, isMultiple) => {
    setSelections(prev => {
      const current = prev[qId] || [];
      if (isMultiple) {
        const newSel = current.includes(ansId) ? current.filter(id => id !== ansId) : [...current, ansId];
        return { ...prev, [qId]: newSel };
      }
      return { ...prev, [qId]: [ansId] };
    });
  };

  const handleAnswered = (qId, isCorrect) => {
    setResults(prev => ({ ...prev, [qId]: isCorrect }));
  };

  const handleCorrectAll = () => {
    const newResults = { ...results };
    questions.forEach(q => {
      if (newResults[q.id] === undefined) {
        const selectedIds = selections[q.id] || [];
        const correctIds = q.answers.filter(a => a.isCorrect).map(a => a.id);
        const isMultiple = correctIds.length > 1;
        const isPerfect = isMultiple
          ? correctIds.length === selectedIds.length && selectedIds.every(id => correctIds.includes(id))
          : q.answers.find(a => a.id === selectedIds[0])?.isCorrect || false;
        newResults[q.id] = isPerfect;
      }
    });
    setResults(newResults);
  };

  const handleReset = () => {
    if (window.confirm("¿Seguro que quieres reiniciar?")) {
      setResults({});
      setSelections({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stats = {
    total: questions.length,
    correct: Object.values(results).filter(v => v === true).length,
    incorrect: Object.values(results).filter(v => v === false).length,
    answered: Object.keys(results).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
        Cargando cuestionario…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-[13px]">
      <aside className={`fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 transition-all duration-300 z-50 shadow-2xl ${showSidebar ? 'w-72' : 'w-0'}`}>
        <button onClick={() => setShowSidebar(!showSidebar)} className="absolute top-10 -left-10 bg-white border border-gray-200 p-2 rounded-l-xl">
          <ChevronLeftIcon className={`w-5 h-5 text-gray-500 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
        </button>

        <div className={`flex flex-col h-full p-5 overflow-hidden transition-opacity ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Tu Progreso</h2>
          <QuizStats stats={stats} />

          <div className="mt-6 space-y-2">
            <button onClick={handleCorrectAll} className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700 shadow-md transition-all active:scale-95">
              <CheckBadgeIcon className="w-4 h-4" />
              Corregir Todo
            </button>
            <button onClick={handleReset} className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-all">
              <ArrowPathIcon className="w-3.5 h-3.5" />
              Rehacer
            </button>
          </div>

          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-10 mb-4">Navegación</h2>
          <nav className="flex-1 overflow-y-auto space-y-1">
            {questions.map((q, index) => (
              <button key={q.id} onClick={() => document.getElementById(`view-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="flex items-start gap-3 w-full p-2.5 rounded-lg hover:bg-white transition-all group">
                <Bars3BottomLeftIcon className={`w-4 h-4 mt-0.5 ${results[q.id] === undefined ? 'text-gray-300' : results[q.id] ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-gray-600 truncate">{q.title || `Pregunta ${index + 1}`}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto p-12">
          <button onClick={() => navigate(`/${id}/${subjectId}/post`)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Volver a la asignatura
          </button>

          <div className="mb-10 border-b border-gray-100 pb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">{quizData?.title}</h1>
            <p className="text-gray-500 italic">{quizData?.description}</p>
          </div>

          <div className="space-y-6">
            {questions.map((q) => (
              <div id={`view-${q.id}`} key={q.id} className="scroll-mt-24">
                <QuizCard
                  question={q}
                  isCorrected={results[q.id] !== undefined}
                  selectedIds={selections[q.id] || []}
                  onSelect={handleSelect}
                  onAnswered={handleAnswered}
                  onReset={(id) => setSelections(prev => ({ ...prev, [id]: [] }))}
                />
              </div>
            ))}
          </div>

          {stats.answered === stats.total && stats.total > 0 && (
            <div className="mt-16 p-10 bg-gray-900 rounded-[2.5rem] text-center text-white animate-in zoom-in duration-500">
              <h2 className="text-2xl font-bold mb-4">¡Cuestionario Completado! 🏆</h2>
              <div className="text-4xl font-black text-blue-400">{stats.correct} / {stats.total}</div>
              <button onClick={handleReset} className="mt-6 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Volver a empezar</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TakeQuiz;
