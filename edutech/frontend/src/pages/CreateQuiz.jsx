import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizQuestion from '../components/study-material/quiz/QuizQuestion';
import { DocumentCheckIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/study-material/EditorLayout';
import { postQuiz, saveDraft, updateDraft, deleteDraft, getDraft } from '@services/connections-documents';
import { useCurrentUser } from '@services/useCurrentUser';

const createAnswer = () => ({ id: crypto.randomUUID(), text: '', isCorrect: false });
const createQuestion = () => ({ id: crypto.randomUUID(), title: '', answers: [createAnswer(), createAnswer()] });

const CreateQuiz = () => {
  const { subjectId, draftId } = useParams();
  const { userData } = useCurrentUser();

  const [questions, setQuestions] = useState([createQuestion()]);
  const [draftPostId, setDraftPostId] = useState(draftId ? parseInt(draftId) : null);
  const [courseId, setCourseId] = useState(subjectId);
  const [initialHeader, setInitialHeader] = useState(null);
  const [loading, setLoading] = useState(!!draftId);

  useEffect(() => {
    if (!draftId) return;
    getDraft(draftId).then(draft => {
      setInitialHeader({ title: draft.title, description: draft.description });
      setCourseId(draft.course.id);
      if (draft.qui?.questions?.length) {
        setQuestions(draft.qui.questions.map(q => ({
          id: crypto.randomUUID(),
          title: q.title,
          answers: q.answers.map(a => ({ id: crypto.randomUUID(), text: a.text, isCorrect: a.is_correct })),
        })));
      }
      setLoading(false);
    });
  }, [draftId]);

  const addQuestion = () => setQuestions(prev => [...prev, createQuestion()]);
  const deleteQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));
  const updateQuestion = (id, updated) => setQuestions(prev => prev.map(q => q.id === id ? updated : q));

  const areQuestionsValid = questions.every(q =>
    q.title.trim() !== "" && q.answers.some(a => a.isCorrect) && q.answers.every(a => a.text.trim() !== "")
  );

  const requirements = [
    ...(questions.some(q => q.title.trim() === "") ? ["Títulos de pregunta vacíos"] : []),
    ...(questions.some(q => !q.answers.some(a => a.isCorrect)) ? ["Respuesta correcta sin marcar"] : []),
    ...(questions.some(q => q.answers.some(a => a.text.trim() === "")) ? ["Textos de respuesta vacíos"] : []),
  ];

  const handlePublish = async (header) => {
    await postQuiz(courseId, userData?.id, header.title, header.description, questions);
    if (draftPostId) await deleteDraft(draftPostId);
  };

  const handleSaveDraft = async (header) => {
    if (draftPostId) {
      await updateDraft(draftPostId, header.title, header.description, "QUI", questions);
    } else {
      const draft = await saveDraft(userData?.id, courseId, "QUI", header.title, header.description, questions);
      setDraftPostId(draft.id);
    }
  };

  const isQuestionsDirty = questions.some(q => q.title.trim() !== '' || q.answers.some(a => a.text.trim() !== ''));

  if (loading) return null;

  return (
    <EditorLayout
      items={questions} onAdd={addQuestion}
      isDirty={isQuestionsDirty}
      pageTitle="Crear cuestionario"
      canPublish={areQuestionsValid}
      requirements={requirements}
      titleLabel="Título del cuestionario"
      onPublish={handlePublish}
      onSaveDraft={handleSaveDraft}
      publishIcon={<DocumentCheckIcon className="w-4 h-4" />}
      publishText="Publicar cuestionario"
      successMessage="¡Cuestionario publicado con éxito!"
      initialHeader={initialHeader}
      backPath={draftId ? '/borradores' : undefined}
      publishSuccessPath={draftId ? '/borradores' : undefined}
      renderItem={(question) => (
        <QuizQuestion
          question={question} canDelete={questions.length > 1}
          onUpdate={(updated) => updateQuestion(question.id, updated)}
          onDelete={() => deleteQuestion(question.id)}
        />
      )}
    />
  );
};

export default CreateQuiz;
