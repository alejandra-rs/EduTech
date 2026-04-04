import Layout from "./components/Layout";
import Courses from "./pages/AllCourses";
import Subject from "./pages/AllSubjects";
import SubjectDetail from "./pages/SubjectDetail";
import CargarPublicacionVideo from "./pages/CargarPublicacionVideo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/:id/asignaturas" element={<Subject />} />
          <Route path="/:id/:subjectId/post" element={<SubjectDetail />} />
          <Route
            path="/:id/:subjectId/cargarPublicacion"
            element={<CargarPublicacionVideo />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
