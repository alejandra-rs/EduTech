import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCardItem from '../components/study-material/flashcards/FlashCardItem';
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/study-material/EditorLayout';
import { postFlashCardDeck, saveDraft, updateDraft, deleteDraft, getDraft } from '../services/connections-documents';
import { useCurrentUser } from '../services/useCurrentUser';
import { Deck, FlashCardEditorItem } from '../models/documents/postsTypesModels/flashcard.model';
import { EditorHeaderData } from '../models/documents/post.model';
import { CreateFlashcardPayload } from '../models/documents/payload.model';

const CreateFlashCard = () => {
  const { subjectId, draftId } = useParams<{ subjectId: string; draftId: string }>();
  const { userData } = useCurrentUser();

  const [cards, setCards] = useState<FlashCardEditorItem[]>([{ id: `c-${crypto.randomUUID()}`, question: '', answer: '' }]);
  const [draftPostId, setDraftPostId] = useState<number | null>(draftId ? parseInt(draftId) : null);
  const [courseId, setCourseId] = useState<number | undefined>(subjectId ? parseInt(subjectId) : undefined);
  const [initialHeader, setInitialHeader] = useState<EditorHeaderData | null>(null);
  const [loading, setLoading] = useState(!!draftId);

  useEffect(() => {
    if (!draftId) return;
    getDraft(Number(draftId)).then(draft => {
      setInitialHeader({ title: draft.title, description: draft.description });
      setCourseId(draft.course.id);
      if (draft.post_type === 'FLA' && draft.fla?.cards?.length) {
        setCards(draft.fla.cards.map(card => ({ id: `c-${crypto.randomUUID()}`, question: card.question, answer: card.answer })));
      }
      setLoading(false);
    });
  }, [draftId]);

  const addCard = () => setCards(prev => [...prev, { id: `c-${crypto.randomUUID()}`, question: '', answer: '' }]);
  const deleteCard = (id: string) => { if (cards.length > 1) setCards(cards.filter(card => card.id !== id)); };
  const updateCard = (id: string, updatedCard: FlashCardEditorItem) => setCards(cards.map(card => card.id === id ? updatedCard : card));

  const emptyQuestions = cards.some(c => c.question.trim() === "");
  const emptyAnswers = cards.some(c => c.answer.trim() === "");

  const requirements = [
    ...(emptyQuestions ? ["Preguntas vacías"] : []),
    ...(emptyAnswers ? ["Respuestas vacías"] : []),
  ];
  const getDeckParaBackend = (): Deck => {
    return cards.map(({ question, answer }) => ({ question, answer }));
  };

  const handlePublish = async (header: EditorHeaderData) => {
    await postFlashCardDeck({post_type: 'FLA', title: header.title, description: header.description, courseId: courseId!, studentId: userData!.id, flashcards: getDeckParaBackend(), isDraft:false, publish: true} as CreateFlashcardPayload);
    if (draftPostId) await deleteDraft(draftPostId);
  };

  const handleSaveDraft = async (header: EditorHeaderData) => {
    if (!courseId || !userData?.id) return;
    if (draftPostId) {
      await updateDraft({draftId: draftPostId, post_type: 'FLA', title: header.title, description: header.description, courseId: courseId!, studentId: userData!.id, flashcards: getDeckParaBackend()});

    } else {
      const draft = await saveDraft({post_type: 'FLA', title: header.title, description: header.description, courseId: courseId!, studentId: userData!.id, flashcards: getDeckParaBackend()});
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
      itemLabel={(card: FlashCardEditorItem) => card.question || "Tarjeta sin título"}
      initialHeader={initialHeader}
      backPath={draftId ? '/borradores' : undefined}
      publishSuccessPath={draftId ? '/borradores' : undefined}
      renderItem={(card: FlashCardEditorItem) => (
        <FlashCardItem
          card={card}
          canDelete={cards.length > 1}
          onUpdate={(updated: FlashCardEditorItem) => updateCard(card.id, updated)}
          onDelete={() => deleteCard(card.id)}
        />
      )}
    />
  );
};

export default CreateFlashCard;
