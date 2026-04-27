import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Courses from "./pages/AllCourses";
import CargarPublicacionVideo from "./pages/CargarPublicacionVideo";
import VistaPreviaDocumento from "./pages/VistaPreviaDocumento";
import VistaPreviaVideo from "./pages/VistaPreviaVideo";
import SubjectDetail from "./pages/SubjectDetail";
import CargarPublicacionPDF from "./pages/CargarPublicacionPDF";
import Subject from "./pages/AllSubjects";
import SignIn from "./pages/SignIn";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import CreateFlashCard from "./pages/CreateFlashCard";
import TakeFlashCard from "./pages/TakeFlashCard";
import { syncUser } from "@services/connections";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

export default function App() {
  const { accounts, instance } = useMsal();

  const testFlashData = {
    title: "Fundamentos de React",
    description: "Repasa los conceptos clave para dominar la librería.",
    items: [
      { id: "c1", front: "¿Qué es el Virtual DOM?", back: "Es una representación en memoria de la UI real que se sincroniza con el DOM de forma eficiente." },
      { id: "c2", front: "¿Para qué sirve el Hook useEffect?", back: "Permite ejecutar efectos secundarios en componentes funcionales (peticiones, suscripciones, etc)." },
      { id: "c3", front: "¿Qué es el Virtual DOM?", back: "Es una representación en memoria de la UI real que se sincroniza con el DOM de forma eficiente." },
      { id: "c4", front: "¿Para qué sirve el Hook useEffect?", back: "Permite ejecutar efectos secundarios en componentes funcionales (peticiones, suscripciones, etc)." },
      { id: "c5", front: "¿Qué es el Virtual DOM?", back: "Es una representación en memoria de la UI real que se sincroniza con el DOM de forma eficiente." },
      { id: "c6", front: "¿Para qué sirve el Hook useEffect?", back: "Permite ejecutar efectos secundarios en componentes funcionales (peticiones, suscripciones, etc)." },
    ]
  };

  const testData = {
    title: "Certificación React 2026",
    description: "Este cuestionario evalúa tus conocimientos en el ecosistema moderno de React, incluyendo Server Components, Hooks avanzados y optimización con Tailwind CSS.",
    questions: [
      { 
        id: "q1", 
        title: "¿Qué hooks se introdujeron en React 16.8?", 
        answers: [
          { id: "a1", text: "useState", isCorrect: true },
          { id: "a2", text: "useEffect", isCorrect: true },
          { id: "a3", text: "useHistory", isCorrect: false },
          { id: "a4", text: "useTransition", isCorrect: false }
        ] 
      },
      { 
        id: "q2", 
        title: "¿React es un Framework o una Librería?", 
        answers: [
          { id: "b1", text: "Librería", isCorrect: true },
          { id: "b2", text: "Framework", isCorrect: false }
        ] 
      },
      { 
        id: "q3", 
        title: "Clases de Tailwind para un padding lateral de 16px:", 
        answers: [
          { id: "c1", text: "p-4", isCorrect: false },
          { id: "c2", text: "px-4", isCorrect: true },
          { id: "c3", text: "py-4", isCorrect: false }
        ] 
      }
    ]
  };

  const isDomainValid = accounts.length > 0;
  useEffect(() => {
    if (accounts.length > 0) {
      syncUser(instance, accounts[0]);
    }
  }, [accounts, instance]);
  return (
    <>
      <BrowserRouter>
        <UnauthenticatedTemplate>
          <SignIn />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          {isDomainValid ? (
            <Layout accounts={accounts} instance={instance}>
              <Routes>
                <Route path="/" element={<Courses />} />
                <Route path="/:id/asignaturas" element={<Subject />} />
                <Route
                  path="/:id/:subjectId/post"
                  element={<SubjectDetail />}
                />
                <Route
                  path="/:id/:subjectId/upload"
                  element={<Navigate to="PDF" replace />}
                />
                <Route
                  path="/:id/:subjectId/upload/PDF"
                  element={<CargarPublicacionPDF />}
                />
                <Route
                  path="/:id/:subjectId/upload/Video"
                  element={<CargarPublicacionVideo />}
                />
                <Route
                  path="/:id/:subjectId/documento/:postId"
                  element={<VistaPreviaDocumento />}
                />
                <Route
                  path="/:id/:subjectId/video/:postId"
                  element={<VistaPreviaVideo />}
                />
                <Route 
                  path="/:id/:subjectId/upload/quiz" 
                  element={<CreateQuiz />} 
                />
                <Route 
                  path="/:id/:subjectId/upload/flashcard" 
                  element={<CreateFlashCard />} 
                />
                <Route path="/prueba2" element={<TakeQuiz quizData={testData} />} />
                <Route path="/prueba4" element={<TakeFlashCard flashData={testFlashData} />} />
              </Routes>
            </Layout>
          ) : null}
        </AuthenticatedTemplate>
      </BrowserRouter>
    </>
  );
}
