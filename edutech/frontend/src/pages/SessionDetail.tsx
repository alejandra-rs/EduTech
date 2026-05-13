import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useCurrentUser } from "../services/useCurrentUser";
import { 
  getStudySession, 
  starStudySession, 
  unstarStudySession 
} from "../services/connections-studysessions"; //
import { 
  getTwitchStatus, 
  connectTwitch, 
  startStream 
} from "../services/connections-streaming"; //
import { TwitchConnectButton } from "../components/TwitchConnectButton"; //
import type { StudySession } from "../models/studysessions/studysession.model";

const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { userData: currentUser } = useCurrentUser();
  
  const [session, setSession] = useState<StudySession | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [twitchData, setTwitchData] = useState({ connected: false, login: null as string | null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id || !sessionId) return;
    
    const loadData = async () => {
      try {
        const sessionData = await getStudySession(Number(sessionId), currentUser.id); //
        setSession(sessionData);
        setIsStarred(sessionData.is_starred); //

        const status = await getTwitchStatus(currentUser.id); //
        setTwitchData({ connected: status.connected, login: status.login });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sessionId, currentUser?.id]);

  // Manejador para marcar y desenmarcar la estrella
  const handleToggleStar = async () => {
    if (!currentUser?.id || !session) return;
    try {
      if (isStarred) {
        await unstarStudySession(session.id, currentUser.id);
        setIsStarred(false);
      } else {
        await starStudySession(session.id, currentUser.id);
        setIsStarred(true);
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  const handleStartStream = async () => {
    if (!currentUser?.id || !session) return;
    try {
      await startStream(session.id, currentUser.id); //
      navigate(`/stream/live/${session.id}`);
    } catch (error) {
      console.error("Error al iniciar el stream:", error);
    }
  };

  if (loading) return <div className="p-10 text-center italic">Cargando detalles de la sesión...</div>;
  if (!session) return <div className="p-10 text-center">No se encontró la sesión.</div>;

  const isCreator = currentUser?.id === session.creator.id;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-sm p-8 border border-gray-100">
        
        {/* Header con Estrella (Marcar/Desenmarcar) */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
          <button onClick={handleToggleStar} className="p-2 hover:scale-110 transition-transform active:scale-90">
            {isStarred ? (
              <StarSolid className="w-9 h-9 text-yellow-400" />
            ) : (
              <StarOutline className="w-9 h-9 text-gray-300 hover:text-gray-400" />
            )}
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-center">
            {session.description || "Esta sesión no tiene descripción."}
          </p>
        </div>

        {/* Botón de Inicio o Conexión de Twitch */}
        <div className="max-w-sm mx-auto mb-12 space-y-4">
          {isCreator && (
            <>
              {!twitchData.connected ? (
                <TwitchConnectButton 
                  userId={currentUser!.id}
                  twitchData={twitchData}
                  setTwitchData={setTwitchData}
                  connectTwitch={connectTwitch}
                />
              ) : (
                <button 
                  onClick={handleStartStream}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  INICIAR DIRECTO
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">@{twitchData.login}</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Placeholder para contenido adicional (Boceto Izquierdo) */}
        <div className="min-h-[250px] bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 italic">
          Zona de interacción y comentarios de la sesión
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;