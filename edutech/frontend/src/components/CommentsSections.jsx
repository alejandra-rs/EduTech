import React, { useState, useEffect } from "react";
import Comentario from "../components/Comentario";
import ModalComentario from "./PopUp";
import { getComments } from "@services/connections";

export function CommentsSections({ documentId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const data = await getComments(documentId);
        setComments(data);
      } catch (error) {
        console.error("Error al cargar los comentarios", error);
      }
    };
    if (documentId) cargarComentarios();
  }, [documentId]);

  const handleRecargarComentarios = () => {
    // Aquí podrías volver a llamar a cargarComentarios() para refrescar la lista
    const cargarComentarios = async () => {
      try {
        const data = await getComments(documentId);
        setComments(data);
      } catch (error) {
        console.error("Error al cargar los comentarios", error);
      }
    };
    if (documentId) cargarComentarios();
  };

  return (
    // Limitamos la sección al 70% de la altura de la pantalla
    <section className="w-full max-h-[70vh] flex flex-col bg-transparent overflow-hidden">
      {/* CABECERA: Se mantiene fija arriba */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Comentarios:</h2>
          <ModalComentario
            onCommentAdded={handleRecargarComentarios}
            postId={documentId}
          />
        </div>
        <span className="text-lg text-gray-400">({comments.length})</span>
      </div>

      {/* LISTA: Es la que tiene el scroll independiente */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <Comentario comment={comment} user={comment.user} />
          ))
        ) : (
          <p className="text-gray-400 italic">
            No hay comentarios aún. ¡Sé el primero!
          </p>
        )}
      </div>
    </section>
  );
}
