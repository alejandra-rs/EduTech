import React, { useState } from 'react';
import FlashCardItem from '../components/FlashCardItem';
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/quiz/EditorLayout';

const CreateFlashCard = () => {
  const [header, setHeader] = useState({ title: '', description: '' });
  const [cards, setCards] = useState([{ id: `c-${crypto.randomUUID()}`, front: '', back: '' }]);

  const addCard = () => setCards(prev => [...prev, { id: `c-${crypto.randomUUID()}`, front: '', back: '' }]);
  const deleteCard = (id) => { if (cards.length > 1) setCards(cards.filter(c => c.id !== id)); };
  const updateCard = (id, updatedCard) => setCards(cards.map(c => c.id === id ? updatedCard : c));

  // Validaciones
  const isHeaderValid = header.title.trim() !== "";
  const emptyFronts = cards.some(c => c.front.trim() === "");
  const emptyBacks = cards.some(c => c.back.trim() === "");
  const canPublish = isHeaderValid && !emptyFronts && !emptyBacks;

  const requirements = [
    ...(!isHeaderValid ? ["Título del mazo"] : []),
    ...(emptyFronts ? ["Preguntas vacías"] : []),
    ...(emptyBacks ? ["Respuestas vacías"] : []),
  ];

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

  return (
    <EditorLayout
      header={header} setHeader={setHeader}
      items={cards} onAdd={addCard}
      canPublish={canPublish} requirements={requirements}
      onPublish={handlePublish}
      publishIcon={<Square3Stack3DIcon className="w-4 h-4" />}
      publishText="Publicar Flashcards"
      successMessage="¡Mazo de Flashcards publicado!"
      itemLabel={(c, i) => c.front || `Tarjeta ${i + 1}`}
      // Usamos el render prop para inyectarle el componente FlashCardItem
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