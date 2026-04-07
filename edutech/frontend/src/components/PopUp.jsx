import React, { useState } from "react";
import Input from "./Input";
import { postComment } from "@services/connections";
import { useCurrentUser } from "@services/useCurrentUser";

export default function ModalComentario({ onCommentAdded, postId }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const { userData } = useCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.elements[0].value;
    if (!message.trim()) return;
    postComment(userData.id, postId, message).then(() => {
      if (onCommentAdded) onCommentAdded();
    });
    handleClose();
  };

  return (
    <>
      <span
        onClick={handleOpen}
        className="text-4xl font-light text-gray-400 hover:text-black hover:scale-125 transition-all p-2 cursor-pointer select-none"
      >
        +
      </span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Nuevo Comentario
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-black text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <Input
                  label="Tu mensaje"
                  placeholder="Escribe lo que piensas..."
                  rows={5}
                  required={true}
                />
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2d2d2d] text-white font-semibold hover:bg-black transition-colors shadow-lg"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
