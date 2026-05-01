import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bars3BottomLeftIcon, ArrowPathIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import QuizCard from '../components/study-material/quiz/QuizCard';
import ConfirmModal from '../components/study-material/ConfirmModal';
import StudySidebar from '../components/study-material/StudySidebar';
import StudyHeader from '../components/study-material/StudyHeader';
import CompletionBanner from '../components/study-material/CompletionBanner';
import ReactionsContainer from '../components/ReactionsContainer';
import { getDocument } from '@services/connections';

const TakeQuiz = () => {
  const { id, subjectId, postId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({});
  const [results, setResults] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    getDocument(postId)
      .then(post => setQuizData({
        title: post.title,
        description: post.description,
        questions: (post.qui?.questions || []).map(q => ({
          id: q.id,
          title: q.title,
          answers: q.answers.map(a => ({ id: a.id, text: a.text, isCorrect: a.is_correct })),
        })),
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const questions = quizData?.questions || [];

  const handleSelect = (qId, ansId, isMultiple) => {
    setSelections(prev => {
      const current = prev[qId] || [];
      if (isMultiple) {
        const next = current.includes(ansId) ? current.filter(i => i !== ansId) : [...current, ansId];
        return { ...prev, [qId]: next };
      }
      return { ...prev, [qId]: [ansId] };
    });
  };

  const handleCorrectAll = () => {
    const next = { ...results };
    questions.forEach(q => {
      if (next[q.id] !== undefined) return;
      const selected = selections[q.id] || [];
      const correct = q.answers.filter(a => a.isCorrect).map(a => a.id);
      const isMultiple = correct.length > 1;
      next[q.id] = isMultiple
        ? correct.length === selected.length && selected.every(i => correct.includes(i))
        : q.answers.find(a => a.id === selected[0])?.isCorrect || false;
    });
    setResults(next);
  };

  const handleReset = () => {
    setConfirmReset(false);
    setResults({});
    setSelections({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: questions.length,
    correct: Object.values(results).filter(Boolean).length,
    incorrect: Object.values(results).filter(v => v === false).length,
    answered: Object.keys(results).length,
  };

  const sidebarActions = [
    {
      label: "Corregir Todo", icon: CheckBadgeIcon, onClick: handleCorrectAll,
      className: "flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-orange-600 shadow-md transition-all active:scale-95",
    },
    {
      label: "Reiniciar", icon: ArrowPathIcon, onClick: () => setConfirmReset(true),
      className: "flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-all",
    },
  ];

  const sidebarNavItems = questions.map((question) => ({
    id: question.id, label: question.title, status: results[question.id], icon: Bars3BottomLeftIcon,
    onClick: () => document.getElementById(`view-${question.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  }));

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">Cargando cuestionario…</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <ConfirmModal open={confirmReset} title="¿Reiniciar?" message="Se borrarán todas las respuestas seleccionadas." onConfirm={handleReset} onCancel={() => setConfirmReset(false)} />

      <StudySidebar show={showSidebar} onToggle={() => setShowSidebar(visible => !visible)} title="Tu Progreso" stats={stats} actions={sidebarActions} navTitle="Navegación" navItems={sidebarNavItems} />

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? "pr-72" : "pr-0"}`}>
        <div className="max-w-3xl mx-auto p-12">

          <StudyHeader onBack={() => navigate(`/${id}/${subjectId}/post`)} backLabel="Volver a la asignatura" title={quizData?.title} description={quizData?.description} titleSize="text-3xl" descriptionStyle="text-gray-500 italic" />

          <div className="space-y-6">
            {questions.map(question => (
              <div id={`view-${question.id}`} key={question.id} className="scroll-mt-24">
                <QuizCard
                  question={question}
                  isCorrected={results[question.id] !== undefined}
                  selectedIds={selections[question.id] || []}
                  onSelect={handleSelect}
                  onAnswered={(qId, ok) => setResults(p => ({ ...p, [qId]: ok }))}
                  onReset={qId => setSelections(p => ({ ...p, [qId]: [] }))}
                />
              </div>
            ))}
          </div>

          {stats.answered === stats.total && stats.total > 0 && <CompletionBanner variant="quiz" stats={stats} onRestart={() => setConfirmReset(true)} />}

          <hr className="mt-10 mb-5 border-gray-200"></hr>
          <div className="flex justify-end">
            <ReactionsContainer postId={Number(postId)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TakeQuiz;
