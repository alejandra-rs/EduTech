import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FlashCardItem from '../components/study-material/flashcards/FlashCardItem';
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/study-material/EditorLayout';
import { postFlashCardDeck } from '@services/connections';
import { useCurrentUser } from '@services/useCurrentUser';

const CreateFlashCard = () => {
  const { subjectId } = useParams();
  const { userData } = useCurrentUser();
  const [cards, setCards] = useState([{ id: `c-${crypto.randomUUID()}`, question: '', answer: '' }]);

  const addCard = () => setCards(prev => [...prev, { id: `c-${crypto.randomUUID()}`, question: '', answer: '' }]);
  const deleteCard = (id) => { if (cards.length > 1) setCards(cards.filter(c => c.id !== id)); };
  const updateCard = (id, updatedCard) => setCards(cards.map(c => c.id === id ? updatedCard : c));

  const emptyQuestions = cards.some(c => c.question.trim() === "");
  const emptyAnswers = cards.some(c => c.answer.trim() === "");

  const requirements = [
    ...(emptyQuestions ? ["Preguntas vacías"] : []),
    ...(emptyAnswers ? ["Respuestas vacías"] : []),
  ];

  
  const handlePublish = async (header) => {
    await postFlashCardDeck(subjectId, userData?.id, header.title, header.description, cards);
  };

  const isCardsDirty = cards.some(c => c.question.trim() !== '' || c.answer.trim() !== '');

  return (
    <EditorLayout
      items={cards} onAdd={addCard}
      isDirty={isCardsDirty}
      canPublish={!emptyQuestions && !emptyAnswers}
      requirements={requirements}
      pageTitle="Crear flashcards"
      titleLabel="Título del grupo de tarjetas"
      onPublish={handlePublish}
      publishIcon={<Square3Stack3DIcon className="w-4 h-4" />}
      publishText="Publicar Flashcards"
      successMessage="Grupo de flashcards publicado!"
      itemLabel={(card) => card.question || "Tarjeta sin título"}
      renderItem={(card) => (
        <FlashCardItem
          card={card}
          canDelete={cards.length > 1}
          onUpdate={(updated) => updateCard(card.id, updated)}
          onDelete={() => deleteCard(card.id)}
        />
      )}
    />
  );
};

export default CreateFlashCard;
