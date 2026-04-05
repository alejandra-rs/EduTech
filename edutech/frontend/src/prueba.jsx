import React, { useEffect } from "react";
import Layout from "./components/Layout";
import Courses from "./pages/AllCourses";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            <Layout accounts={accounts}>
              <Routes>
                <Route path="/" element={<Courses />} />
                <Route path="/:id/asignaturas" element={<Subject />} />
                <Route
                  path="/:id/:subjectId/post"
                  element={<SubjectDetail />}
                />
                <Route
                  path="/:id/:subjectId/upload"
                  element={<CargarPublicacionPDF />}
                />
              </Routes>
            </Layout>
          ) : null}
        </AuthenticatedTemplate>
      </BrowserRouter>
    </>
  );
}
