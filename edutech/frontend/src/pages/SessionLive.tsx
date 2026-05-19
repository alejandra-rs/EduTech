import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, PhoneXMarkIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "../services/useCurrentUser";
import {
  connectToSessionChat,
  connectTwitch,
  getTwitchStatus,
  stopStream,
} from "../services/connections-streaming";
import { getStudySession } from "../services/connections-studysessions";
import type { TwitchChatMessage } from "../models/studysessions/twitch.model";
import type { StudySession } from "../models/studysessions/studysession.model";
import ConfirmModal from "../components/study-material/ConfirmModal";
import StreamPlayer from "../components/study-sessions/live/StreamPlayer";
import LiveChatPanel from "../components/study-sessions/live/LiveChatPanel";
import SessionStatusBadge from "../components/study-sessions/SessionStatusBadge";

const SessionLive = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { userData: currentUser } = useCurrentUser();

  const [session, setSession] = useState<StudySession | null>(null);
  const [messages, setMessages] = useState<TwitchChatMessage[]>([]);
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const [isTwitchConnected, setIsTwitchConnected] = useState(false);

  useEffect(() => {
    if (!sessionId || !currentUser?.id) return;

    Promise.all([
      getStudySession(Number(sessionId), currentUser.id),
      getTwitchStatus(currentUser.id),
    ]).then(([s, twitchStatus]) => {
        if (s.status !== "en_directo") { navigate(-1); return; }
        setSession(s);
        setIsTwitchConnected(twitchStatus.connected);
      })
      .catch(console.error);
  }, [sessionId, currentUser?.id]);

  useEffect(() => {
    if (!sessionId || !session) return;

    const socket = connectToSessionChat(
      Number(sessionId),
      (msg) => setMessages((prev) => [...prev, msg]),
      () => navigate(-1),
    );

    return () => socket.close();
  }, [sessionId, session]);

  const handleStopStream = async () => {
    if (!sessionId) return;
    setShowConfirmStop(false);
    try {
      await stopStream(Number(sessionId));
      navigate(-1);
    } catch (error) {
      console.error("Error al detener el stream:", error);
    }
  };

  const handleConnectTwitch = async () => {
    if (!currentUser?.id) return;
    try {
      await connectTwitch(currentUser.id);
      setIsTwitchConnected(true);
    } catch (error) {
      console.error("Error al conectar Twitch:", error);
    }
  };

  const isCreator = session?.creator?.id === currentUser?.id;

  return (
    <div className="min-h-screen w-full bg-gray-900 p-6 flex flex-col font-sans">
      <ConfirmModal
        open={showConfirmStop}
        title="¿Finalizar sesión?"
        message="Esta acción no se puede deshacer. Todos los espectadores serán desconectados."
        confirmLabel="Finalizar"
        Icon={PhoneXMarkIcon}
        onConfirm={handleStopStream}
        onCancel={() => setShowConfirmStop(false)}
      />

      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 font-bold transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          VOLVER
        </button>
        {session && <SessionStatusBadge status={session.status} />}
      </div>

      <div className="flex-1 grid gap-6 lg:grid-cols-[7.5fr_2.5fr] mb-6 min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          {session && <StreamPlayer twitchLink={session.twitch_link} />}
          {isCreator && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowConfirmStop(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow transition-all active:scale-95"
              >
                <PhoneXMarkIcon className="w-5 h-5" />
                Finalizar sesión
              </button>
            </div>
          )}
        </div>

        {session && currentUser && (
          <LiveChatPanel
            sessionId={session.id}
            currentUserId={currentUser.id}
            messages={messages}
            isTwitchConnected={isTwitchConnected}
            onConnectTwitch={handleConnectTwitch}
          />
        )}
      </div>
    </div>
  );
};

export default SessionLive;
