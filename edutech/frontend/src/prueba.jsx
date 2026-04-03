// prueba.jsx
import Layout from './components/Layout';
import Courses from './pages/AllCourses'; 
import Subject from './pages/AllSubjects';
import SubjectDetail from './pages/SubjectDetail'; // Asegúrate de que la ruta del archivo sea correcta
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 1. Vista de todos los cursos */}
          <Route path="/" element={<Courses />} />
          
          {/* 2. Vista de las asignaturas de un curso (ej: /1/asignaturas) */}
          <Route path="/:id/asignaturas" element={<Subject />} />
          
          {/* 3. Vista de los documentos de una asignatura (ej: /1/Matematicas/post) */}
          <Route path="/:id/:subjectId/post" element={<SubjectDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}