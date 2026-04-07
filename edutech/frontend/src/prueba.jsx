import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Courses from "./pages/AllCourses";
import CargarPublicacionVideo from "./pages/CargarPublicacionVideo";
import VistaPreviaDocumento from "./pages/VistaPreviaDocumento";
import SubjectDetail from "./pages/SubjectDetail";
import CargarPublicacionPDF from "./pages/CargarPublicacionPDF";
import Subject from "./pages/AllSubjects";
import SignIn from "./pages/SignIn";
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
              </Routes>
            </Layout>
          ) : null}
        </AuthenticatedTemplate>
      </BrowserRouter>
    </>
  );
}
