import Layout from './components/Layout';
import Courses from './pages/AllCourses'; 
import Subject from './pages/AllSubjects';
import SubjectDetail from './pages/SubjectDetail';
import CargarPublicacionPDF from './pages/CargarPublicacionPDF';
import CargarPublicacionVideo from './pages/CargarPublicacionVideo';
import VistaPreviaDocumento from './pages/VistaPreviaDocumento';
import VistaPreviaVideo from './pages/VistaPreviaDocumentocopy';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/:id/asignaturas" element={<Subject />} />
          <Route path="/:id/:subjectId/post" element={<SubjectDetail />} />
          <Route path="/:id/:subjectId/upload" element={<Navigate to="PDF" replace />} />
          <Route path="/:id/:subjectId/upload/PDF" element={<CargarPublicacionPDF />} />
          <Route path="/:id/:subjectId/upload/Video" element={<CargarPublicacionVideo />} />
          <Route path="/:id/:subjectId/documento/:postId" element={<VistaPreviaDocumento />} />
          <Route path="/:id/:subjectId/video/:postId" element={<VistaPreviaVideo />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
