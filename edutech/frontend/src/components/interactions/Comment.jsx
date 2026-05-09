import UserAvatar from "../UserAvatar";
import ReportButton from "../reports/ReportButton";
import { createCommentReport } from "@services/interactions/connections-reports";

function formatDate(raw) {
  if (!raw) return null;
  const d = raw instanceof Date ? raw : new Date(raw);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export default function Comment({ comment, user, currentUser }) {
  const handleReport = async ({ reasonId, description }) => {
    await createCommentReport(comment.id, currentUser.id, reasonId, description);
  };

  return (
    <div className="bg-gray-200 rounded-lg p-5 sm:p-6 flex gap-4 w-full font-sans">
      <div className="flex flex-row"> <UserAvatar imageUrl={user?.picture} /> </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{user?.first_name} {user?.last_name}</h3>
          {formatDate(comment?.created_at) && (
            <span className="text-xs text-gray-400">{formatDate(comment?.created_at)}</span>
          )}
        </div>
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-6"> {comment?.message} </p>
      </div>
      {currentUser && (
        <div className="flex-shrink-0 self-start">
          <ReportButton
            entity="Comentario"
            postId={comment?.id}
            onSubmit={handleReport}
          />
        </div>
      )}
    </div>
  );
}
