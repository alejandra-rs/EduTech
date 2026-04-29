import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationGuardProvider } from "./context/NavigationGuardContext";
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
import ReportsPage from "./pages/ReportsPage";
import ReportFormPage from "./pages/ReportFormPage";
import Drafts from "./pages/Drafts";
import { syncUser } from "@services/connections";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

export default function App() {
  const { accounts, instance } = useMsal();

  const isDomainValid = accounts.length > 0;
  useEffect(() => {
    if (accounts.length > 0) {
      syncUser(instance, accounts[0]);
    }
  }, [accounts, instance]);
  return (
    <>
      <BrowserRouter>
        <NavigationGuardProvider>
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
                <Route
                  path="/:id/:subjectId/quiz/:postId"
                  element={<TakeQuiz />}
                />
                <Route
                  path="/:id/:subjectId/flashcard/:postId"
                  element={<TakeFlashCard />}
                />
                <Route path="/borradores" element={<Drafts />} />
                <Route path="/borradores/flashcard/:draftId" element={<CreateFlashCard />} />
                <Route path="/borradores/quiz/:draftId" element={<CreateQuiz />} />
                <Route
                  path="/reports"
                  element={<ReportsPage />}
                />
                <Route
                  path="/admin/report-form/:id"
                  element={<ReportFormPage />}
                />
              </Routes>
            </Layout>
          ) : null}
        </AuthenticatedTemplate>
        </NavigationGuardProvider>
      </BrowserRouter>
    </>
  );
}
