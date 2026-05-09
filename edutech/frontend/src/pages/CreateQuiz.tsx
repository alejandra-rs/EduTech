import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizQuestion from '../components/study-material/quiz/QuizQuestion';
import { DocumentCheckIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/study-material/EditorLayout';
import { postQuiz, saveDraft, updateDraft, deleteDraft, getDraft } from '../services/connections-documents';
import { useCurrentUser } from '../services/useCurrentUser';
import { QuizEditorQuestion } from '../models/documents/postsTypesModels/quiz.models';
import { EditorHeaderData } from '../models/documents/post.model';

const createAnswer = () => ({ id: crypto.randomUUID(), text: '', is_correct: false });
const createQuestion = () => ({ id: crypto.randomUUID(), title: '', answers: [createAnswer(), createAnswer()]});

const CreateQuiz = () => {
  const { subjectId, draftId } = useParams<{ subjectId: string; draftId: string }>();
  const { userData } = useCurrentUser();

  const [questions, setQuestions] = useState<QuizEditorQuestion[]>([createQuestion()]); 
  const [draftPostId, setDraftPostId] = useState(draftId ? parseInt(draftId) : null);
  const [courseId, setCourseId] = useState(subjectId ? parseInt(subjectId): null);
  const [initialHeader, setInitialHeader] = useState<EditorHeaderData | null>(null);
  const [loading, setLoading] = useState(!!draftId);

  useEffect(() => {
    if (!draftId) return;
   getDraft(Number(draftId)).then(draft => {
      setInitialHeader({ title: draft.title, description: draft.description });
      setCourseId(Number(draft.course.id));
     if (draft.post_type === 'QUI' && draft.qui?.questions) {
        setQuestions(draft.qui.questions.map(q => ({
          id: crypto.randomUUID(),
          title: q.title,
          answers: q.answers.map(a => ({ id: crypto.randomUUID(), text: a.text, is_correct: a.is_correct })),
        })));
      }
      setLoading(false);
    });
  }, [draftId]);

  const addQuestion = () => setQuestions(prev => [...prev, createQuestion()]);
  const deleteQuestion = (id: string | number) => setQuestions(prev => prev.filter(question => question.id !== id));
  const updateQuestion = (id: string | number, updated: QuizEditorQuestion) => setQuestions(prev => prev.map(question => question.id === id ? updated : question));

  const areQuestionsValid = questions.every(q =>
    q.title.trim() !== "" && q.answers.some(a => a.is_correct) && q.answers.every(a => a.text.trim() !== "")
  );

  const requirements = [
    ...(questions.some(q => q.title.trim() === "") ? ["Títulos de pregunta vacíos"] : []),
    ...(questions.some(q => !q.answers.some(a => a.is_correct)) ? ["Respuesta correcta sin marcar"] : []),
    ...(questions.some(q => q.answers.some(a => a.text.trim() === "")) ? ["Textos de respuesta vacíos"] : []),
  ];

  const handlePublish = async (header: EditorHeaderData) => {
    await postQuiz({post_type: 'QUI', title: header.title, description: header.description, courseId: courseId!, studentId: userData!.id, questions: castQuestions()});
    if (draftPostId) await deleteDraft(draftPostId);
  };


  const castQuestions = () => {
    return questions.map(question => ({
      title: question.title,
      answers: question.answers.map(answer => ({
        text: answer.text,
        is_correct: answer.is_correct
      }))
    }));
  };
  const handleSaveDraft = async (header: EditorHeaderData) => {
    const questionsBackend = castQuestions();

    if (draftPostId) {
      await updateDraft({
        draftId: draftPostId,
        post_type: 'QUI',
        title: header.title,
        description: header.description,
        courseId: courseId!,
        studentId: userData!.id,
        questions: questionsBackend
      });
    } else {
      const draft = await saveDraft({
        post_type: 'QUI',
        title: header.title,
        description: header.description,
        courseId: courseId!,
        studentId: userData!.id,
        questions: questionsBackend
      });
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
      itemLabel={(q: QuizEditorQuestion) => q.title || "Pregunta sin título"}
      onPublish={handlePublish}
      onSaveDraft={handleSaveDraft}
      publishIcon={<DocumentCheckIcon className="w-4 h-4" />}
      publishText="Publicar cuestionario"
      successMessage="¡Cuestionario publicado con éxito!"
      initialHeader={initialHeader}
      backPath={draftId ? '/borradores' : undefined}
      publishSuccessPath={draftId ? '/borradores' : undefined}
      renderItem={(question: QuizEditorQuestion) => (
        <QuizQuestion
          question={question} canDelete={questions.length > 1}
          onUpdate={(updated: QuizEditorQuestion) => updateQuestion(String(question.id), updated)}
          onDelete={() => deleteQuestion(String(question.id))}
        />
      )}
    />
  );
};

export default CreateQuiz;