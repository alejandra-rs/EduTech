import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizQuestion from '../components/study-material/quiz/QuizQuestion';
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/study-material/EditorLayout';
import { postQuiz } from '@services/connections';
import { useCurrentUser } from '@services/useCurrentUser';

const createAnswer = () => ({ id: crypto.randomUUID(), text: '', isCorrect: false });
const createQuestion = () => ({ id: crypto.randomUUID(), title: '', answers: [createAnswer(), createAnswer()] });

const CreateQuiz = () => {
  const { subjectId } = useParams();
  const { userData } = useCurrentUser();
  const [questions, setQuestions] = useState([createQuestion()]);

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
    await postQuiz(subjectId, userData?.id, header.title, header.description, questions);
  };

  const isQuestionsDirty = questions.some(q => q.title.trim() !== '' || q.answers.some(a => a.text.trim() !== ''));

  return (
    <EditorLayout
      items={questions} onAdd={addQuestion}
      isDirty={isQuestionsDirty}
      pageTitle="Crear cuestionario"
      canPublish={areQuestionsValid}
      requirements={requirements}
      titleLabel="Título del cuestionario"
      onPublish={handlePublish}
      publishIcon={<RocketLaunchIcon className="w-4 h-4" />}
      publishText="Publicar cuestionario"
      successMessage="¡Cuestionario publicado con éxito!"
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
