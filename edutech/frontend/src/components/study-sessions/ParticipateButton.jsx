import { useState } from "react";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { starStudySession, unstarStudySession } from "@services/connections-study-sessions";

const ParticipateButton = ({ sessionId, currentUserId, isStarred = false, isCreator = false, onStarChange, size = "w-6 h-6" }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || isCreator) return;
    setLoading(true);
    try {
      if (isStarred) {
        await unstarStudySession(sessionId, currentUserId);
        onStarChange?.(false);
      } else {
        await starStudySession(sessionId, currentUserId);
        onStarChange?.(true);
      }
    } catch (err) {
      console.error("Error al actualizar participación:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isCreator) {
    return (
      <div className="flex p-1 bg-blue-100 rounded-lg">
        <button disabled title="Eres el creador" className="cursor-default focus:outline-none">
          <StarSolid className={`${size} text-blue-500`} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex p-1 bg-${isStarred ? "green-100" : "gray-100"} rounded-lg`}>
      <button
        onClick={handleToggle}
        disabled={loading}
        title={isStarred ? "Dejar de participar" : "Participar"}
        className={`focus:outline-none transition-all active:scale-75 ${loading ? "opacity-50" : ""}`}
      >
        {isStarred
          ? <StarSolid className={`${size} text-green-800`} />
          : <StarOutline className={`${size} text-gray-300 hover:text-gray-400`} />
        }
      </button>
    </div>
  );
};

export default ParticipateButton;
