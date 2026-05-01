import SearchBar from '../components/SearchBar';
import { CourseWidget } from '../components/CourseWidget';
import PostGrid from '../components/PostGrid';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import  { getYears } from '@services/connections';
import { useCurrentUser } from '../services/useCurrentUser';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const Courses = () => {
  const [years, setYears] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();
  const { userData } = useCurrentUser();
  const userId = userData?.id;
  
  useEffect(() => {
    if (!userId) return;
    getYears(userId)
      .then(setYears)
      .catch((error) => {console.error("Error al cargar los cursos:", error)});
  }, [userId]);

  const handlePostClick = (post) => {
    if (post.post_type === "PDF") navigate(`/${post.course}/${post.year}/documento/${post.id}`);
    else if (post.post_type === "VID") navigate(`/${post.course}/${post.year}/video/${post.id}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">
      <div className="flex-grow overflow-y-auto custom-scrollbar px-8 pt-12 pb-10">
        <div className="mb-10 w-full flex justify-between items-center gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Buscar documento..."
              color="bg-slate-800"
              onSearch={setSearchResults}
            />
          </div>
          
          <button 
            onClick={() => navigate('/sesiones')}
            className="p-2 rounded-lg bg-slate-400 hover:bg-slate-700 transition-colors shrink-0"
          >
            <CalendarDaysIcon className="w-8 h-8 text-white" />
          </button>
        </div>

        {searchResults !== null ? (
          <PostGrid posts={searchResults} onPostClick={handlePostClick} />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">
            {years.map((year) => (
              <Link
                to={`/${year.id}/asignaturas`}
                key={year.id}
                className="block transition-transform hover:scale-[1.02]"
              >
                <CourseWidget
                  courseName={year.year + "º Curso"}
                  className="max-w-none w-full"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
