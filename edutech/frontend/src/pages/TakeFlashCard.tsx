import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Square3Stack3DIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import FlashCardView from '../components/study-material/flashcards/FlashCardView';
import ConfirmModal from '../components/study-material/ConfirmModal';
import StudySidebar from '../components/study-material/StudySidebar';
import StudyHeader from '../components/study-material/StudyHeader';
import StudyProgressBar from '../components/study-material/StudyProgressBar';
import CardCarousel from '../components/study-material/flashcards/CardCarousel';
import CompletionBanner from '../components/study-material/CompletionBanner';
import ReactionsContainer from '../components/interactions/ReactionsContainer';
import { getDocument } from '../services/connections-documents';
import type { PostFlashcard } from '../models/documents/post.model';
import type { StudyFlashCard } from '../models/documents/postsTypesModels/flashcard.model';

interface FlashData {
  title: string;
  description: string;
  items: StudyFlashCard[];
}

const TakeFlashCard = () => {
  const { id, subjectId, postId } = useParams<{ id: string; subjectId: string; postId: string }>();
  const navigate = useNavigate();

  const [flashData, setFlashData] = useState<FlashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    getDocument(Number(postId))
      .then((post) => {
        const p = post as PostFlashcard;
        setFlashData({ title: p.title, description: p.description ?? '', items: p.fla?.cards ?? [], });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const cards: StudyFlashCard[] = flashData?.items ?? [];

  const handleResult = (cardId: string | number, isCorrect: boolean) => {
    const key = String(cardId);
    const updated = { ...results, [key]: isCorrect };
    setResults(updated);
    const next = cards.findIndex((c, i) => i > currentIndex && updated[String(c.id)] === undefined);
    if (next !== -1) { setCurrentIndex(next); return; }
    const first = cards.findIndex(c => updated[String(c.id)] === undefined);
    if (first !== -1) setCurrentIndex(first);
  };

  const handleReset = () => { setConfirmReset(false); setResults({}); setCurrentIndex(0); };

  const stats = {
    total: cards.length,
    correct: Object.values(results).filter(Boolean).length,
    incorrect: Object.values(results).filter(v => v === false).length,
    answered: Object.keys(results).length,
  };

  const sidebarActions = [
    {
      label: "Reiniciar", icon: ArrowPathIcon,
      onClick: () => setConfirmReset(true),
      className: "flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-purple-50 hover:text-purple-600 transition-all",
    },
  ];

  const sidebarNavItems = cards.map((c, i) => ({
    id: c.id,
    label: c.question,
    status: results[String(c.id)],
    onClick: () => setCurrentIndex(i),
  }));

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">Cargando flashcards…</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <ConfirmModal open={confirmReset} title="¿Reiniciar?" message="Se perderá el progreso actual del grupo de tarjetas." onConfirm={handleReset} onCancel={() => setConfirmReset(false)} />

      <StudySidebar show={showSidebar} onToggle={() => setShowSidebar(v => !v)} title="Estudio" stats={stats} actions={sidebarActions} navTitle="Tarjetas" navItems={sidebarNavItems} activeId={cards[currentIndex]?.id} />

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? "pr-72" : "pr-0"}`}>
        <div className="max-w-3xl mx-auto p-12">

          <StudyHeader onBack={() => navigate(`/${id}/${subjectId}/post`)} backLabel="Volver a la asignatura" typeIcon={Square3Stack3DIcon} typeLabel="Sesión de Flashcards" title={flashData?.title} description={flashData?.description} />

          <StudyProgressBar current={currentIndex + 1} total={cards.length} correct={stats.correct} incorrect={stats.incorrect} unanswered={stats.total - stats.answered} />

          {cards.length > 0 && stats.answered < stats.total && (
            <CardCarousel onPrev={() => setCurrentIndex(i => Math.max(i - 1, 0))} onNext={() => setCurrentIndex(i => Math.min(i + 1, cards.length - 1))} canGoPrev={currentIndex > 0} canGoNext={currentIndex < cards.length - 1}>
              <FlashCardView key={String(cards[currentIndex].id)} card={cards[currentIndex]} onResult={handleResult} />
            </CardCarousel>
          )}

          {stats.answered === stats.total && stats.total > 0 && <CompletionBanner variant="flashcard" stats={stats} onRestart={() => setConfirmReset(true)} />}

          <hr className="mt-10 mb-5 border-gray-200"></hr>
          <div className="flex justify-end">
            <ReactionsContainer postId={Number(postId)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TakeFlashCard;
