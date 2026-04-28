import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizSidebar from '../components/quiz/QuizSidebar';
import FlashCardItem from '../components/FlashCardItem';
import SuccessToast from '../components/SuccessToast';
import { AddQuestionButton } from '../components/quiz/AddQuestionButton';
import { PlusCircleIcon, Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { postFlashCardDeck } from '@services/connections';
import { useCurrentUser } from '@services/useCurrentUser';
import { ItemsGrid } from '../components/quiz/ItemsGrid';

const CreateFlashCard = () => {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  const [header, setHeader] = useState({ title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState(true);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [cards, setCards] = useState([
    { id: 'c-1', front: '', back: '' }
  ]);

  const addCard = () => setCards(prev => [...prev, { id: `c-${crypto.randomUUID()}`, front: '', back: '' }]);
  const deleteCard = (id) => {
    if (cards.length > 1) setCards(cards.filter(c => c.id !== id));
  };
  const updateCard = (id, updatedCard) => setCards(cards.map(c => c.id === id ? updatedCard : c));
  const scrollToCard = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const isHeaderValid = header.title.trim() !== "";
  const emptyFronts = cards.some(c => c.front.trim() === "");
  const emptyBacks = cards.some(c => c.back.trim() === "");
  const canPublish = isHeaderValid && !emptyFronts && !emptyBacks;

  const requirements = [
    ...(!isHeaderValid ? ["Título del mazo"] : []),
    ...(emptyFronts ? ["Preguntas vacías"] : []),
    ...(emptyBacks ? ["Respuestas vacías"] : []),
  ];

  const handlePublish = async () => {
    if (!canPublish || publishing) return;
    setPublishing(true);
    try {
      const post = await postFlashCardDeck(subjectId, userData?.id, header.title, header.description, cards);
      setPublished(true);
      setTimeout(() => navigate(`/${id}/${subjectId}/flashcard/${post.id}`), 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      {published && <SuccessToast message="Flashcards publicadas" onClose={() => setPublished(false)} />}

      <QuizSidebar
        items={cards}
        canPublish={canPublish && !publishing}
        showSidebar={showSidebar}
        onToggle={() => setShowSidebar(visible => !visible)}
        onPublish={handlePublish}
        onScrollTo={scrollToCard}
        itemLabel={(c, i) => c.front || `Tarjeta ${i + 1}`}
        requirements={requirements}
      >
        <Square3Stack3DIcon className="w-4 h-4" />
        {publishing ? "Publicando…" : "Publicar Flashcards"}
      </QuizSidebar>

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <div className="max-w-4xl mx-auto p-12 pb-32">
          <QuizHeader
            title={header.title}
            description={header.description}
            onTitleChange={(v) => setHeader(h => ({ ...h, title: v }))}
            onDescChange={(v) => setHeader(h => ({ ...h, description: v }))}
          />

          <ItemsGrid items={cards} renderItem={(card) => (
            <FlashCardItem
              card={card}
              onUpdate={(updatedCard) => updateCard(card.id, updatedCard)}
              onDelete={() => deleteCard(card.id)}
              />
            )}
          />

        </div>
      </main>

      <AddQuestionButton addQuestion={addCard} showSidebar={showSidebar} />
    </>
  );
};

export default CreateFlashCard;
