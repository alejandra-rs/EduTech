import { Comment } from "../../models/documents/interactions/comment.model";

export const getComments = async (documentId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`/api/documents/comments/?post=${documentId}`);
    if (!response.ok) throw new Error("Error al obtener los comentarios");
    return await response.json() as Comment[];
  } catch (error) {
    console.error("Error en getComments:", error);
    throw error;
  }
};

export const postComment = async (userId: number, postId: number, message: string): Promise<Comment> => {
  try {
    const response = await fetch(`/api/documents/comments/?user=${userId}&post=${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId, message }),
    });
    if (!response.ok) throw new Error("Error al agregar el comentario");
    return await response.json() as Comment;
  } catch (error) {
    console.error("Error en postComment:", error);
    throw error;
  }
};

