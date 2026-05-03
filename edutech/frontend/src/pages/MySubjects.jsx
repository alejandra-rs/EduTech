import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import { SubjectWidget } from '../components/SubjectWidget';
import SearchBar from '../components/SearchBar';
import PostGrid from '../components/PostGrid';
import { useCurrentUser } from '../services/useCurrentUser';
import { getSubscriptions } from '@services/connections-courses';

const TYPE_TO_ROUTE = { PDF: 'documento', VID: 'video', QUI: 'quiz', FLA: 'flashcard' };

const MySubjects = () => {
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  const [subscriptions, setSubscriptions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    if (!userData?.id) return;
    getSubscriptions(userData.id)
      .then(setSubscriptions)
      .catch((err) => console.error("Error cargando suscripciones:", err));
  }, [userData?.id]);

  const subscribedCourseIds = new Set(subscriptions.map((sub) => sub.course?.id).filter(Boolean));

  const handleSearch = (results) => {
    if (!results) { setSearchResults(null); return; }
    setSearchResults(results.filter((doc) => subscribedCourseIds.has(doc.course)));
  };

  const handlePostClick = (post) =>
    navigate(`/${post.year}/${post.course}/${TYPE_TO_ROUTE[post.post_type]}/${post.id}`);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white">
        <TitlePage PageName="Mis Asignaturas" backLabel="Inicio" onBack={() => navigate('/')} />
        <div className='p-4'>
          <SearchBar
            placeholder="Buscar documento en mis asignaturas..."
            color="bg-slate-800"
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar px-6 py-4">
        {searchResults !== null ? (
          searchResults.length > 0
            ? <PostGrid posts={searchResults} onPostClick={handlePostClick} />
            : <p className="text-gray-400 italic text-center py-12">Sin resultados en mis asignaturas.</p>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {subscriptions.length === 0 ? (
              <p className="text-gray-400 italic text-center py-12">No estás suscrito a ninguna asignatura.</p>
            ) : (
              subscriptions.map((sub) => (
                <SubjectWidget
                  key={sub.course?.id}
                  subjectName={sub.course?.name ?? "Asignatura"}
                  subjectId={sub.course?.id}
                  onNavigate={() => navigate(`/${sub.course?.year?.id}/${sub.course?.id}/post`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubjects;
