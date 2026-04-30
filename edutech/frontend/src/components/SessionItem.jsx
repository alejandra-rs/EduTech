import { useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { starStudySession, unstarStudySession } from "@services/connections-study-sessions";

const SessionItem = ({ session, currentUserId }) => {
  const [isStarred, setIsStarred] = useState(session.is_starred || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStar = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isStarred) {
        await unstarStudySession(session.id, currentUserId);
        setIsStarred(false);
      } else {
        await starStudySession(session.id, currentUserId);
        setIsStarred(true);
      }
    } catch (error) {
      console.error("Error al actualizar el destacado:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sessionDate = new Date(session.scheduled_at).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="group flex items-center justify-between py-4 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-all px-4 rounded-2xl">
      <Link 
        to={`/sesiones/${session.id}`} 
        className="flex flex-col flex-grow min-w-0"
      >
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {session.course_details?.name || "Asignatura"}
        </span>
        <h4 className="text-base text-gray-800 font-bold truncate group-hover:text-black transition-colors">
          {session.title || "Sesión sin título"}
        </h4>
        <span className="text-xs text-gray-500 font-medium mt-1">
          {sessionDate}
        </span>
      </Link>

      <button 
        onClick={handleToggleStar} 
        disabled={isLoading}
        className={`ml-4 flex-shrink-0 focus:outline-none transition-all active:scale-75 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      >
        {isStarred ? (
          <StarSolid className="w-7 h-7 text-yellow-400 drop-shadow-sm" />
        ) : (
          <StarOutline className="w-7 h-7 text-gray-300 hover:text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default SessionItem;