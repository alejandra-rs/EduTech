import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import { CourseWidget } from '../components/CourseWidget';
import SearchBar from '../components/SearchBar';
import PostGrid from '../components/PostGrid';
import { getSubscriptions } from '../services/connections-courses';
import { UserSubscription } from '../models/courses/course.model';
import { POST_TYPE_LABELS, PostPreview } from '../models/documents/post.model';

const MyCourses = () => {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [searchResults, setSearchResults] = useState<PostPreview[]| null> (null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getSubscriptions()
      .then(setSubscriptions)
      .catch((err) => console.error("Error cargando suscripciones:", err))
      .finally(() => setLoading(false));
  }, []);

  const subscribedCourseIds = new Set(subscriptions.flatMap((sub) => sub.course?.id ? [sub.course.id] : []));

  const handleSearch = (results: PostPreview[]| null) => {
    if (!results) { setSearchResults(null); return; }
    setSearchResults(results.filter((doc) => subscribedCourseIds.has(doc.course)));
  };

  const handlePostClick = (post: PostPreview) => {
    navigate(`/${post.year}/${post.course}/${POST_TYPE_LABELS[post.post_type]}/${post.id}`);
  };
  
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
            {loading ? (
              <p className="text-gray-500 italic text-center py-12">Cargando…</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-gray-400 italic text-center py-12">No estás suscrito a ninguna asignatura.</p>
            ) : (
              subscriptions.map((subscription) => (
                <Link 
                    key={subscription.course.id} 
                    to={`/${subscription.course.year?.id}/${subscription.course.id}/post`}
                    className="block w-full transition hover:opacity-80"
                  >
                <CourseWidget
                  courseName={subscription.course?.name ?? "Asignatura"}
                  courseId={subscription.course?.id}
                  />
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
