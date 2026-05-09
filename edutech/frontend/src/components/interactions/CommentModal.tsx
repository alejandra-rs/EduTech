import { useState } from "react";
import Input from "../Input";
import { postComment } from "../../services/interactions/connections-comments";
import { useCurrentUser } from "../../services/useCurrentUser";
import { addStudySessionComment } from "../../services/connections-studysessions";

export interface CommentModalProps {
  entityId?: string | number;
  onCommentAdded?: () => void;
  isSession?: boolean;
}

export default function CommentModal({ entityId, onCommentAdded, isSession = false }: CommentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const { userData } = useCurrentUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = msg.trim();
    if (!message || !userData?.id) return;

    const submitFn = isSession
      ? addStudySessionComment(Number(entityId), userData.id, message)
      : postComment(userData.id, Number(entityId), message);

    submitFn.then(() => {
      onCommentAdded?.();
      setMsg("");
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-4xl text-gray-400 hover:text-black p-2">+</button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Nuevo Comentario</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-2xl">&times;</button>
            </div>

            <Input
              label="Tu mensaje"
              placeholder="Escribe lo que piensas..."
              textarea
              required
              value={msg}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMsg(e.target.value)}
            />

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200">
                Cancelar
              </button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-zinc-800 text-white shadow-lg">
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
