import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import SessionHeader from '../components/study-sessions/SessionHeader';
import SessionDescription from '../components/study-sessions/SessionDescription';
import { getStudySessions, starStudySession, unstarStudySession } from '../services/connections-studysessions';
import { getTwitchStatus } from '../services/connections-streaming';
import { useCurrentUser } from '../services/useCurrentUser';
import { StreamButton } from '../components/study-sessions/StreamButton';
import { CommentsSection } from '../components/interactions/CommentsSection';
import type { StudySession } from '../models/studysessions/studysession.model';

export default function StudySessionDetail() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { userData: currentUser } = useCurrentUser();

  const [session, setSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [twitchData, setTwitchData] = useState({ connected: false, login: null as string | null });
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setIsLoading(true);
        const sessionsData: StudySession[] = await getStudySessions({ studentId: currentUser?.id });
        const foundSession = sessionsData.find(s => s.id.toString() === sessionId);

        if (foundSession) {
          setSession(foundSession);
          setIsStarred(foundSession.is_starred);

          if (currentUser?.id) {
            const status = await getTwitchStatus(currentUser.id);
            setTwitchData({ connected: status.connected, login: status.login });
          }
        }
      } catch (error) {
        console.error("Error al cargar la sesión", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && currentUser?.id) loadSessionData();
  }, [sessionId, currentUser?.id]);

  const handleToggleStar = async () => {
    if (!currentUser?.id || !session) return;
    try {
      if (isStarred) {
        setIsStarred(false);
        await unstarStudySession(session.id, currentUser.id);
      } else {
        setIsStarred(true);
        await starStudySession(session.id, currentUser.id);
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  const isCreator = currentUser?.id === session?.creator.id;

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
              onStarChange={handleToggleStar}
            />
            <SessionDescription session={session} />
            <div className="flex align-items-center justify-center">
              <StreamButton
                session={session}
                isCreator={isCreator}
                currentUserId={currentUser!.id}
                twitchData={twitchData}
                setTwitchData={setTwitchData}
              />
            </div>
            <CommentsSection id={sessionId} isSession />
          </div>
        </main>
      </div>
    </div>
  );
}
