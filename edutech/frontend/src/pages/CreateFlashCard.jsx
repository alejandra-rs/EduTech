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

  /*
  // Lógica de publicación y JSON
  const handlePublish = async () => {
    // Generar el formato JSON exacto que pediste
    const payloadJSON = cards.map(card => {
      return { [card.front]: card.back };
    });

    console.log("JSON FLASHCARDS LISTO PARA DJANGO:", JSON.stringify(payloadJSON, null, 2));

    // Aquí harás el await postFlashCardDeck(...) en el futuro
    return new Promise(resolve => setTimeout(resolve, 1000)); // Simulamos carga
  };
  */

  const handlePublish = async (header) => {
    await postFlashCardDeck(subjectId, userData?.id, header.title, header.description, cards);
  };

  return (
    <EditorLayout
      items={cards} onAdd={addCard}
      canPublish={!emptyQuestions && !emptyAnswers}
      requirements={requirements}
      titleLabel="Título del grupo de tarjetas"
      onPublish={handlePublish}
      publishIcon={<Square3Stack3DIcon className="w-4 h-4" />}
      publishText="Publicar Flashcards"
      successMessage="Grupo de flashcards publicado!"
      itemLabel={(card) => card.answer || "Tarjeta sin título"}
      renderItem={(card) => (
        <FlashCardItem
          card={card}
          onUpdate={(updated) => updateCard(card.id, updated)}
          onDelete={() => deleteCard(card.id)}
        />
      )}
    />
  );
};

export default CreateFlashCard;
