import React, { useState } from 'react';
import Question from '../components/Question';
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { EditorLayout } from '../components/quiz/EditorLayout';

const createAnswer = () => ({ id: crypto.randomUUID(), text: '', isCorrect: false });
const createQuestion = () => ({ id: crypto.randomUUID(), title: '', answers: [createAnswer(), createAnswer()] });

const CreateQuiz = () => {
  const [header, setHeader] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState([createQuestion()]);

  const addQuestion = () => setQuestions(prev => [...prev, createQuestion()]);
  const deleteQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));
  const updateQuestion = (id, updated) => setQuestions(prev => prev.map(q => q.id === id ? updated : q));

  // Validaciones
  const isHeaderValid = header.title.trim() !== "";
  const areQuestionsValid = questions.every(q => q.title.trim() !== "" && q.answers.some(a => a.isCorrect) && q.answers.every(a => a.text.trim() !== ""));
  const canPublish = isHeaderValid && areQuestionsValid;

  const requirements = [
    ...(!isHeaderValid ? ["Título del cuestionario"] : []),
    ...(questions.some(q => q.title.trim() === "") ? ["Títulos de pregunta vacíos"] : []),
    ...(questions.some(q => !q.answers.some(a => a.isCorrect)) ? ["Respuesta correcta sin marcar"] : []),
    ...(questions.some(q => q.answers.some(a => a.text.trim() === "")) ? ["Textos de respuesta vacíos"] : []),
  ];


  // TODO: enlazar con backend
  // Lógica de publicación y JSON
  const handlePublish = async () => {
    // Generar el formato JSON exacto que pediste
    const payloadJSON = questions.map(question => {
      const respuestasArray = question.answers.map(ans => {
        return { [ans.text]: ans.isCorrect };
      });
      return { [question.title]: respuestasArray };
    });

    console.log("JSON CUESTIONARIO LISTO PARA DJANGO:", JSON.stringify(payloadJSON, null, 2));
    
    // Aquí harás el await postQuiz(...) en el futuro
    return new Promise(resolve => setTimeout(resolve, 1000)); // Simulamos carga
  };

  return (
    <EditorLayout
      header={header} setHeader={setHeader}
      items={questions} onAdd={addQuestion}
      canPublish={canPublish} requirements={requirements}
      onPublish={handlePublish}
      publishIcon={<RocketLaunchIcon className="w-4 h-4" />}
      publishText="Publicar cuestionario"
      successMessage="¡Cuestionario publicado con éxito!"
      // Usamos el render prop para inyectarle el componente Question
      renderItem={(question) => (
        <Question
          question={question} canDelete={questions.length > 1}
          onUpdate={(updated) => updateQuestion(question.id, updated)}
          onDelete={() => deleteQuestion(question.id)} 
        />
      )}
    />
  );
};

export default CreateQuiz;