import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import CommentModal from "./CommentModal";
import { getComments, postComment } from "@services/connections";
import { getStudySessionComments, addStudySessionComment } from "@services/connections-study-sessions";
import { useCurrentUser } from "@services/useCurrentUser";

export function CommentsSection({ id, isSession = false }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useCurrentUser();

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = isSession ? await getStudySessionComments(id) : await getComments(id);
      setComments(data);
    } catch (error) {
      console.error("Error al cargar los comentarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) loadComments(); }, [id, isSession]);

  return (
    <section className="w-full max-h-[70vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Comentarios:</h2>
          <CommentModal entityId={id} onCommentAdded={loadComments} isSession/>
        </div>
        <span className="text-lg text-gray-400">({comments.length})</span>
      </div>
      
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {loading ? (
          <p className="text-gray-400 italic">Cargando comentarios...</p>
        ) : comments?.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              user={comment.user || comment.student}
              currentUser={userData}
            />
          ))
        ) : (
          <p className="text-gray-400 italic"> Aún no hay comentarios. </p>
        )}
      </div>
    </section>
  );
}
