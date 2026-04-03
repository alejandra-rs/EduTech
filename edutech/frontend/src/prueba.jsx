import Layout from './components/Layout';
import Courses from './pages/AllCourses'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Subject from './pages/AllSubjects';
import PostGrid from './components/PostGrid';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/:id/asignaturas" element={<Subject />} />
          <Route path="/:id/:subjectId/post" element={<PostGrid />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}