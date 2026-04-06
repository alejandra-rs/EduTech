import React, { use } from 'react';
import Comentario from '../components/Comentario';
import ModalComentario from './PopUp';
import { getComments } from '@services/connections';
import { useState, useEffect } from 'react';

export function CommentsSections({documentId}) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        getComments(documentId).then(setComments);
      } catch (error) {
        console.error("Error al cargar los comentarios", error);
      }
    };
    if (documentId) {
      cargarComentarios();
    }
  }, [documentId]);


  const handleRecargarComentarios = () => {
    console.log("El modal me ha avisado de que hay un nuevo comentario. Toca hacer un fetch().");
  };

  return (
    <section className="w-full pt-4 pb-24 bg-transparent">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-bold text-gray-800">Comentarios:</h2>
          
          <ModalComentario onCommentAdded={handleRecargarComentarios} />
          
        </div>
      </div>
      
      <div className="flex flex-col gap-6 w-full">
        {comments?.map((comment) => {
          return <Comentario key={comment.id} comment={comment} user={comment.user}/>;
        })}
      </div>
    </section>
  );
}