import ParticipateButton from "./ParticipateButton";
import type { StudySession } from '../../models/studysessions/studysession.model';

export interface SessionHeaderProps {
  session: StudySession;
  currentUserId?: number;
  isStarred: boolean;
  onStarChange: (starred: boolean) => void;
}

export function SessionHeader({ session, currentUserId, isStarred, onStarChange }: SessionHeaderProps) {
  const isCreator = session.creator?.id === currentUserId;

  return (
    <section className="flex w-full justify-between items-start border-b border-gray-100 pb-4">
      <div className="space-y-6 w-full">
        <div className="flex justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900"> {session.title} </h1>
          <ParticipateButton
            sessionId={session.id}
            currentUserId={currentUserId}
            isStarred={isStarred}
            isCreator={isCreator}
            onStarChange={onStarChange}
            size="w-8 h-8"
          />
        </div>
        <div className="flex w-full text-sm justify-between items-center">
          <div className="flex items-center gap-2 text-gray-500 font-bold italic">
            {new Date(session.scheduled_at).toLocaleString('es-ES', {
              day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
            })}
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            {session.creator.picture && (
              <img src={session.creator.picture} alt={session.creator.first_name} className="w-5 h-5 rounded-full object-cover" />
            )}
            {isCreator ? "Creador: Tú" : `Creador: ${session.creator.first_name} ${session.creator.last_name}`}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SessionHeader;
