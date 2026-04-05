import Layout from './components/Layout';
import Courses from './pages/AllCourses'; 
import Subject from './pages/AllSubjects';
import SubjectDetail from './pages/SubjectDetail';
import CargarPublicacionPDF from './pages/CargarPublicacionPDF';
import VistaPreviaDocumento from './pages/VistaPreviaDocumento';
import VistaPreviaVideo from './pages/VistaPreviaVideo';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/:id/asignaturas" element={<Subject />} />
          <Route path="/:id/:subjectId/post" element={<SubjectDetail />} />
          <Route path="/:id/:subjectId/upload" element={<CargarPublicacionPDF />} />
          <Route path="/:id/:subjectId/documento/:postId" element={<VistaPreviaDocumento />} />
          <Route path="/:id/:subjectId/video/:postId" element={<VistaPreviaVideo />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
