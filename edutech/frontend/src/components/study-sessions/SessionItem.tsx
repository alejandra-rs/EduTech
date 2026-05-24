import { useState } from "react";
import { Link } from "react-router-dom";
import ParticipateButton from "./ParticipateButton";
import SessionStatusBadge from "./SessionStatusBadge";
import type { StudySession } from '../../models/studysessions/studysession.model';

export interface SessionItemProps {
  session: StudySession;
  currentUserId?: number;
}

const SessionItem = ({ session, currentUserId }: SessionItemProps) => {
  const [isStarred, setIsStarred] = useState(session.is_starred || false);

  const sessionDate = new Date(session.scheduled_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  const creatorName = `${session.creator?.first_name} ${session.creator?.last_name}` || session.creator?.email || "Anónimo";
  const isCreator = session.creator?.id === currentUserId;

  return (
    <div className="group flex items-center justify-between p-4 bg-gray-100 last:border-none transition-all rounded-2xl gap-4">
      <Link
        to={`/sesiones/${session.id}`}
        className="flex flex-col flex-grow min-w-0 gap-2"
      >
        <div className="flex items-center justify-between">
          <div className="text-md font-semibold italic mb-1"> {session.course?.name || "Divulgativa"} </div>
          <ParticipateButton
            sessionId={session.id}
            isStarred={isStarred}
            isCreator={isCreator}
            onStarChange={setIsStarred}
            size="size-7"
          />
        </div>

        <h4 className="text-base text-gray-800 font-semibold truncate group-hover:text-black transition-colors">
          {session.title || "Sesión sin título"}
        </h4>

        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium justify-between">
          <span>{sessionDate}</span>
          <div className="flex items-center gap-2">
            {session.status && <SessionStatusBadge status={session.status} />}
            <div className={isCreator ? "font-semibold text-gray-700" : ""}>
              {creatorName} {isCreator ? "(tú)" : ""}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SessionItem;
