import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import SessionHeader from '../components/study-sessions/SessionHeader';
import SessionDescription from '../components/study-sessions/SessionDescription';
import { getStudySessions } from '../services/connections-studysessions';
import { useCurrentUser } from '../services/useCurrentUser';
import { CommentsSection } from '../components/interactions/CommentsSection';
import type { StudySession } from '../models/studysessions/studysession.model';

export default function StudySessionDetail() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { userData: currentUser } = useCurrentUser();

  const [session, setSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const cargarDatosSesion = async () => {
      try {
        setIsLoading(true);
        const sessionsData: StudySession[] = await getStudySessions({ studentId: currentUser?.id });
        const foundSession = sessionsData.find(s => s.id.toString() === sessionId);

        if (foundSession) {
          setSession(foundSession);
          setIsStarred(foundSession.is_starred);
        }
      } catch (error) {
        console.error("Error al cargar la sesión", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && currentUser?.id) cargarDatosSesion();
  }, [sessionId, currentUser?.id]);

  if (isLoading) return <div className="p-20 text-center font-bold animate-pulse">Cargando sesión...</div>;
  if (!session) return <div className="p-20 text-center font-bold">Sesión no encontrada</div>;

  return (
    <div className="min-h-screen w-full bg-white font-sans selection:bg-gray-100">
      <div className="flex flex-col min-h-screen">

        <div className="w-full shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <TitlePage
            PageName={"Detalle de Sesión"}
            onBack={() => navigate(-1)}
          />
        </div>

        <main className="flex-grow px-6 md:px-20 py-10">
          <div className="mx-auto space-y-12">
            <SessionHeader
              session={session}
              currentUserId={currentUser?.id}
              isStarred={isStarred}
              onStarChange={setIsStarred}
            />
            <SessionDescription session={session} />
            <section className="pt-6 pb-20"> <CommentsSection id={sessionId} isSession /> </section>
          </div>
        </main>
      </div>
    </div>
  );
}
