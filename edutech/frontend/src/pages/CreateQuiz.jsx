import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizSidebar from '../components/quiz/QuizSidebar';
import Question from '../components/Question';
import SuccessToast from '../components/SuccessToast';
import { PlusCircleIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import { postQuiz } from '@services/connections';
import { useCurrentUser } from '@services/useCurrentUser';

const createAnswer = () => ({ id: crypto.randomUUID(), text: '', isCorrect: false });
const createQuestion = () => ({ id: crypto.randomUUID(), title: '', answers: [createAnswer(), createAnswer()] });

const CreateQuiz = () => {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  const [header, setHeader] = useState({ title: '', description: '' });
  const [showSidebar, setShowSidebar] = useState(true);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [questions, setQuestions] = useState([createQuestion()]);

  const addQuestion = () => setQuestions(prev => [...prev, createQuestion()]);
  const deleteQuestion = (id) => setQuestions(prev => prev.filter(question => question.id !== id));
  const updateQuestion = (id, updated) => setQuestions(prev => prev.map(question => question.id === id ? updated : question));

  const isHeaderValid = header.title.trim() !== "";
  const areQuestionsValid = questions.every(question =>
    question.title.trim() !== "" &&
    question.answers.some(answer => answer.isCorrect) &&
    question.answers.every(answer => answer.text.trim() !== "")
  );
  const canPublish = isHeaderValid && areQuestionsValid;

  const requirements = [
    ...(!isHeaderValid ? ["Título del cuestionario"] : []),
    ...(questions.some(q => q.title.trim() === "") ? ["Títulos de pregunta vacíos"] : []),
    ...(questions.some(q => !q.answers.some(a => a.isCorrect)) ? ["Respuesta correcta sin marcar"] : []),
    ...(questions.some(q => q.answers.some(a => a.text.trim() === "")) ? ["Textos de respuesta vacíos"] : []),
  ];

  const handlePublish = async () => {
    if (!canPublish || publishing) return;
    setPublishing(true);
    try {
      const post = await postQuiz(subjectId, userData?.id, header.title, header.description, questions);
      setPublished(true);
      setTimeout(() => navigate(`/${id}/${subjectId}/quiz/${post.id}`), 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  const scrollToQuestion = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <div className="flex min-h-screen bg-white">
      {published && <SuccessToast message="Cuestionario publicado" onClose={() => setPublished(false)} />}

      <QuizSidebar
        items={questions} canPublish={canPublish && !publishing}
        showSidebar={showSidebar}
        onToggle={() => setShowSidebar(visible => !visible)}
        onPublish={handlePublish}
        onScrollTo={scrollToQuestion}
        requirements={requirements}
      >
        <RocketLaunchIcon className="w-4 h-4" />
        {publishing ? "Publicando…" : "Publicar cuestionario"}
      </QuizSidebar>

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'pr-72' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto p-12">
          <QuizHeader
            title={header.title}
            description={header.description}
            onTitleChange={(val) => setHeader(header => ({ ...header, title: val }))}
            onDescChange={(val) => setHeader(header => ({ ...header, description: val }))}
          />

          <div className="space-y-6 mt-10">
            {questions.map((question) => (
              <div id={question.id} key={question.id} className="scroll-mt-24">
                <Question
                  question={question}
                  canDelete={questions.length > 1}
                  onUpdate={(updated) => updateQuestion(question.id, updated)}
                  onDelete={() => deleteQuestion(question.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <button
        onClick={addQuestion}
        className={`fixed bottom-8 p-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 z-50
          ${showSidebar ? 'right-[312px]' : 'right-8'}`}
      >
        <PlusCircleIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default CreateQuiz;
