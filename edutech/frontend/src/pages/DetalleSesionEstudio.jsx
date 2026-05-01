import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import { CommentsSections } from '../components/CommentsSections.jsx';
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { 
  getStudySessions, 
  starStudySession, 
  unstarStudySession 
} from '@services/connections-study-sessions';

export default function DetalleSesionEstudio({ currentUserId }) {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    const cargarDatosSesion = async () => {
      try {
        setIsLoading(true);
        const sessionsData = await getStudySessions({ studentId: currentUserId });
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

    if (sessionId) cargarDatosSesion();
  }, [sessionId, currentUserId]);

  const handleToggleStar = async () => {
    try {
      const previousState = isStarred;
      setIsStarred(!previousState);
      if (previousState) {
        await unstarStudySession(session.id, currentUserId);
      } else {
        await starStudySession(session.id, currentUserId);
      }
    } catch (error) {
      setIsStarred(!isStarred);
      console.error("Error al actualizar favorito", error);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-bold animate-pulse">Cargando sesión...</div>;
  if (!session) return <div className="p-20 text-center font-bold">Sesión no encontrada</div>;

  return (
    /* Eliminamos overflow-hidden del padre para permitir el scroll de página */
    <div className="min-h-screen w-full bg-white font-sans selection:bg-gray-100">
      <div className="flex flex-col min-h-screen">
        
        {/* HEADER - Sticky para que siempre esté a mano al scrollear */}
        <div className="w-full shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <TitlePage 
            PageName={session.course_details?.name || "Detalle de Sesión"} 
            onBack={() => navigate(-1)} 
          />
        </div>

        {/* CONTENIDO PRINCIPAL - Sin scroll interno, usa el de la página */}
        <main className="flex-grow px-6 md:px-20 py-10">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* CABECERA DE SESIÓN */}
            <section className="flex justify-between items-start border-b border-gray-100 pb-10">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">
                  {session.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 w-fit px-4 py-1.5 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {new Date(session.scheduled_at).toLocaleString('es-ES', {
                    day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
              <button 
                onClick={handleToggleStar}
                className="group p-4 rounded-3xl bg-gray-50 hover:bg-yellow-50 transition-all active:scale-90"
              >
                {isStarred ? (
                  <StarSolid className="w-8 h-8 text-yellow-400 drop-shadow-sm" />
                ) : (
                  <StarOutline className="w-8 h-8 text-gray-300 group-hover:text-yellow-400 transition-colors" />
                )}
              </button>
            </section>

            {/* DESCRIPCIÓN */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Descripción:</h3>
              <div className="bg-gray-50/50 border border-gray-100 p-8 rounded-[40px] text-gray-800 leading-relaxed text-lg shadow-sm">
                {session.description || "No hay descripción disponible para esta sesión."}
              </div>
            </section>

            {/* COMENTARIOS */}
            <section className="pt-6 pb-20">
              <CommentsSections documentId={sessionId} isStudySession={true} />
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}