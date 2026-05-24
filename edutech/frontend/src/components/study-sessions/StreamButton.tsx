import { useNavigate } from 'react-router-dom';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { startStream, connectTwitch } from '../../services/connections-streaming';
import { TwitchConnectButton } from '../TwitchConnectButton';
import type { StudySession } from '../../models/studysessions/studysession.model';

interface StreamButtonProps {
  session: StudySession;
  isCreator: boolean;
  twitchData: { connected: boolean; login: string | null };
  setTwitchData: (data: { connected: boolean; login: string | null }) => void;
}

function extractLogin(twitchLink: string): string | null {
  if (!twitchLink) return null;
  return twitchLink.replace(/\/$/, '').split('/').pop()?.toLowerCase() ?? null;
}

export function StreamButton({ session, isCreator, twitchData, setTwitchData }: StreamButtonProps) {
  const navigate = useNavigate();

  if (session.status === 'finalizada') {
    return (
      <button type="button"
        disabled
        className="py-3 px-10 bg-gray-200 text-gray-400 font-bold rounded-lg shadow cursor-not-allowed flex items-center justify-center gap-2"
      >
        Sesión finalizada
      </button>
    );
  }

  const channelLogin = extractLogin(session.twitch_link);
  const isStreamRunning = session.status === 'en_directo';
  const isCorrectUser = twitchData.connected && twitchData.login?.toLowerCase() === channelLogin;

  const goToStream = () => navigate(`/stream/live/${session.id}`);

  if (!isCreator) {
    return isStreamRunning ? (
      <button type="button"
        onClick={goToStream}
        className="py-3 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <PlayCircleIcon className="size-5" />
        Ir al directo
      </button>
    ) : (
      <button type="button"
        disabled
        className="py-3 px-10 bg-gray-200 text-gray-400 font-bold rounded-lg shadow cursor-not-allowed flex items-center justify-center gap-2"
      >
        El directo no ha comenzado
      </button>
    );
  }

  if (isStreamRunning) {
    return (
      <button type="button"
        onClick={goToStream}
        className="py-3 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <PlayCircleIcon className="size-5" />
        Ir al directo
      </button>
    );
  }
  if (!twitchData.connected) {
    return (
      <TwitchConnectButton
        twitchData={twitchData}
        setTwitchData={setTwitchData}
        connectTwitch={connectTwitch}
      />
    );
  }
  if (!isCorrectUser) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 space-y-3">
        <p className="text-sm text-amber-800 font-medium">
          Tu cuenta vinculada{' '}
          <span className="font-bold">@{twitchData.login}</span> no es la del canal de esta sesión{' '}
          <span className="font-bold">@{channelLogin}</span>. Vincula la cuenta correcta para iniciar el directo.
        </p>
        <TwitchConnectButton
          twitchData={twitchData}
          setTwitchData={setTwitchData}
          connectTwitch={connectTwitch}
        />
      </div>
    );
  }
  return (
    <button type="button"
      onClick={async () => {
        try {
          await startStream(session.id);
          navigate(`/stream/live/${session.id}`);
        } catch (error) {
          console.error("Error al iniciar el stream:", error);
        }
      }}
      className="py-3 px-10 bg-[#9146FF] hover:bg-[#7d33eb] text-white font-bold rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
    >
      Iniciar directo
      <span className="text-xs bg-white/20 px-2 py-0.5 rounded">@{twitchData.login}</span>
    </button>
  );
}
