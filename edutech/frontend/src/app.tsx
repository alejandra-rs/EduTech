import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationGuardProvider } from "./context/NavigationGuardContext";
import Layout from "./components/Layout";
import YearsPage from "./pages/YearsPage";
import CargarPublicacionVideo from "./pages/CargarPublicacionVideo";
import VistaPreviaDocumento from "./pages/VistaPreviaDocumento";
import VistaPreviaVideo from "./pages/VistaPreviaVideo";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import SignIn from "./pages/SignIn";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import CreateFlashCard from "./pages/CreateFlashCard";
import TakeFlashCard from "./pages/TakeFlashCard";
import ReportsPage from "./pages/ReportsPage";
import ReportFormPage from "./pages/ReportFormPage";
import SelectDegree from "./pages/SelectDegree";
import ChangeDegree from "./pages/ChangeDegree";
import Drafts from "./pages/Drafts";
import { syncUser } from "./services/connections-students";
import { useCurrentUser } from "./services/useCurrentUser";
import { initializeAuth } from "./services/api";
import { loginRequest } from "./services/authConfig";
import StudySessions from "./pages/StudySessions";
import MyCoursesPage from "./pages/MyCoursesPage";
import StudySessionDetail from "./pages/StudySessionDetail";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, } from "@azure/msal-react";
import UploadWizard from "./pages/UploadDocument";
import MyDocuments from "./pages/MyDocuments";

export default function App() {
  const { accounts, instance } = useMsal();
  const { userData, isLoading, refetch } = useCurrentUser();
  const isDomainValid = accounts.length > 0;

  const refetchRef = useRef(refetch);
  useEffect(() => { refetchRef.current = refetch; });

  useEffect(() => {
    if (!isDomainValid) return;
    initializeAuth(() =>
      instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
        .then(r => r.accessToken)
    );

    const init = async () => {
      try {
        await syncUser(instance, accounts[0]);
      } catch (e) {
        console.error("syncUser failed:", e);
      }
      await refetchRef.current();
    };

    init().catch(console.error);
  }, [accounts, instance, isDomainValid]);

  return (
    <>
      <BrowserRouter>
        <NavigationGuardProvider>
        <UnauthenticatedTemplate>
          <SignIn />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
            {isLoading || !userData ? (
                <h1>Cargando datos del usuario...</h1>
            ) : userData?.degree !== null &&
            userData?.degree !== undefined &&
            userData?.degree.length !== 0 ? (
            <Layout accounts={accounts} instance={instance}>
              <Routes>
                <Route path="/" element={<YearsPage />} />
                <Route path="/:id/asignaturas" element={<CoursesPage />} />
                <Route
                    path="/degrees/"
                    element={<ChangeDegree userData={userData} />}
                />
                <Route
                  path="/:id/:subjectId/post"
                  element={<CourseDetail />}
                />
                <Route
                  path="/:id/:subjectId/upload"
                  element={<Navigate to="PDF" replace />}
                />
                <Route
                  path="/:id/:subjectId/upload/PDF"
                  element={<UploadWizard />}
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
                <Route
                    path="/borradores"
                    element={<Drafts />}
                />
                <Route
                    path="/borradores/flashcard/:draftId"
                    element={<CreateFlashCard />}
                />
                <Route
                    path="/borradores/quiz/:draftId"
                    element={<CreateQuiz />}
                />
                <Route
                  path="/reports"
                  element={<ReportsPage />}
                />
                <Route
                  path="/admin/report-form/:id"
                  element={<ReportFormPage />}
                />
                <Route
                    path="/sesiones"
                    element={<StudySessions />}
                />
                <Route
                    path="/sesiones/:sessionId"
                    element={<StudySessionDetail />}
                />
                <Route path="/mis-publicaciones/" element={<MyDocuments/>}/>
                <Route path="/suscripciones" element={<MyCoursesPage/>}/>
              </Routes>
            </Layout>
          ) : (
                <SelectDegree userId={userData.id} />
         )}
        </AuthenticatedTemplate>
        </NavigationGuardProvider>
      </BrowserRouter>
    </>
  );
}
