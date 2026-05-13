import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationGuardProvider } from "./context/NavigationGuardContext";
import Layout from "./components/Layout";
import YearsPage from "./pages/YearsPage";
import LoadVideoPost from "./pages/LoadVideoPost";
import DocumentPreview from "./pages/DocumentPreview";
import VideoPreview from "./pages/VideoPreview";
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
import { initializeAuth, initializeCurrentUser } from "./services/api";
import { loginRequest } from "./services/authConfig";
import StudySessions from "./pages/StudySessions";
import MyCourses from "./pages/MyCourses";
import StudySessionDetail from "./pages/StudySessionDetail";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, } from "@azure/msal-react";
import UploadWizard from "./pages/UploadDocument";
import MyDocuments from "./pages/MyDocuments";
import RevisionPage from "./pages/RevisionPage";

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

  useEffect(() => {
    if (userData?.id) initializeCurrentUser(userData.id);
  }, [userData?.id]);

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
                <Route path="/degrees/" element={<ChangeDegree userData={userData} />} />
                <Route path="/:id/:subjectId/post" element={<CourseDetail />}  />
                <Route path="/:id/:subjectId/upload" element={<Navigate to="PDF" replace />} />
                <Route path="/:id/:subjectId/upload/PDF" element={<UploadWizard />} />
                <Route path="/:id/:subjectId/upload/Video" element={<LoadVideoPost />} />
                <Route path="/:id/:subjectId/documento/:postId" element={<DocumentPreview />} />
                <Route path="/:id/:subjectId/video/:postId" element={<VideoPreview />} />
                <Route path="/:id/:subjectId/upload/quiz" element={<CreateQuiz />} />
                <Route path="/:id/:subjectId/upload/flashcard" element={<CreateFlashCard />} />
                <Route path="/:id/:subjectId/quiz/:postId" element={<TakeQuiz />} />
                <Route path="/:id/:subjectId/flashcard/:postId" element={<TakeFlashCard />} />
                <Route path="/borradores" element={<Drafts />} />
                <Route path="/borradores/flashcard/:draftId" element={<CreateFlashCard />} />
                <Route path="/borradores/quiz/:draftId" element={<CreateQuiz />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/admin/report-form/:id" element={<ReportFormPage />} />
                <Route path="/sesiones" element={<StudySessions />} />
                <Route path="/sesiones/:sessionId" element={<StudySessionDetail />} />
                <Route path="/mis-publicaciones/" element={<MyDocuments/>} />
                <Route path="/suscripciones" element={<MyCourses/>} />
                <Route path="/revisiones" element={<RevisionPage />} />
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
