import Layout from './components/Layout';
import Courses from './pages/AllCourses'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Subject from './pages/AllSubjects';
import SearchBar from './components/SearchBar';
import PostGrid from './components/PostGrid';

export default function App() {
  return (
    <Layout>
    {/* TODO: fusionar SearchBar con este div */}
    <div className="mb-10 w-full">
        <SearchBar />
    </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path=":id/asignaturas/" element={<Subject />} />
        <Route path=":id/:subjectId/post" element={<PostGrid />} />
      </Routes>
    </BrowserRouter>
  </Layout>
  );
}