import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCardItem from '../components/study-material/flashcards/FlashCardItem';
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/study-material/EditorLayout';
import { postFlashCardDeck, saveDraft, updateDraft, deleteDraft, getDraft } from '@services/connections-documents';
import { useCurrentUser } from '@services/useCurrentUser';

const CreateFlashCard = () => {
  const { subjectId, draftId } = useParams();
  const { userData } = useCurrentUser();

  const [cards, setCards] = useState([{ id: `c-${crypto.randomUUID()}`, question: '', answer: '' }]);
  const [draftPostId, setDraftPostId] = useState(draftId ? parseInt(draftId) : null);
  const [courseId, setCourseId] = useState(subjectId);
  const [initialHeader, setInitialHeader] = useState(null);
  const [loading, setLoading] = useState(!!draftId);

  useEffect(() => {
    if (!draftId) return;
    getDraft(draftId).then(draft => {
      setInitialHeader({ title: draft.title, description: draft.description });
      setCourseId(draft.course.id);
      if (draft.fla?.cards?.length) {
        setCards(draft.fla.cards.map(c => ({ id: `c-${crypto.randomUUID()}`, question: c.question, answer: c.answer })));
      }
      setLoading(false);
    });
  }, [draftId]);

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
    await postFlashCardDeck({post_type: 'FLA', title: header.title, description: header.description, courseId: courseId, studentId: userData?.id, flashcards: cards});
    if (draftPostId) await deleteDraft(draftPostId);
  };

  const handleSaveDraft = async (header) => {
    if (draftPostId) {
      await updateDraft(draftPostId, header.title, header.description, "FLA", cards);
    } else {
      const draft = await saveDraft(userData?.id, courseId, "FLA", header.title, header.description, cards);
      setDraftPostId(draft.id);
    }
  };

  const isCardsDirty = cards.some(c => c.question.trim() !== '' || c.answer.trim() !== '');

  if (loading) return null;

  return (
    <EditorLayout
      items={cards} onAdd={addCard}
      isDirty={isCardsDirty}
      canPublish={!emptyQuestions && !emptyAnswers}
      requirements={requirements}
      pageTitle="Crear flashcards"
      titleLabel="Título del grupo de tarjetas"
      onPublish={handlePublish}
      onSaveDraft={handleSaveDraft}
      publishIcon={<Square3Stack3DIcon className="w-4 h-4" />}
      publishText="Publicar Flashcards"
      successMessage="Grupo de flashcards publicado!"
      itemLabel={(card) => card.question || "Tarjeta sin título"}
      initialHeader={initialHeader}
      backPath={draftId ? '/borradores' : undefined}
      publishSuccessPath={draftId ? '/borradores' : undefined}
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
