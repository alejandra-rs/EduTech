import { useState, useEffect } from "react";
import { InteractionResponse } from "../../models/documents/interactions/rating.model";
import { apiFetch } from "../api";

export const getLikes = async (userId: number, postId: number): Promise<InteractionResponse> => {
  const res = await apiFetch(`/api/documents/likes/?user=${userId}&post=${postId}`);
  if (!res.ok) throw new Error("Error al obtener likes");
  return res.json() as Promise<InteractionResponse>;
};

export const addLike = async (userId: number, postId: number): Promise<InteractionResponse> => {
  const res = await apiFetch(`/api/documents/likes/`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ user: userId, post: postId }) 
  });
  if (!res.ok) throw new Error("Error al añadir like");
  return res.json() as Promise<InteractionResponse>;
};

export const removeLike = async (likeId: number): Promise<void> => {
  const res = await apiFetch(`/api/documents/likes/${likeId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Error al eliminar like");
};

export const getDislikes = async (userId: number, postId: number): Promise<InteractionResponse> => {
  const res = await apiFetch(`/api/documents/dislikes/?user=${userId}&post=${postId}`);
  if (!res.ok) throw new Error("Error al obtener dislikes");
  return res.json() as Promise<InteractionResponse>;
};

export const addDislike = async (userId: number, postId: number): Promise<InteractionResponse> => {
  const res = await apiFetch(`/api/documents/dislikes/`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ user: userId, post: postId }) 
  });
  if (!res.ok) throw new Error("Error al añadir dislike");
  return res.json() as Promise<InteractionResponse>;
};

export const removeDislike = async (dislikeId: number): Promise<void> => {
  const res = await apiFetch(`/api/documents/dislikes/${dislikeId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Error al eliminar dislike");
};

export function useLikeDislike(userId: number | null, postId: number | null) {
  const [likeId, setLikeId] = useState<number>(-1);
  const [dislikeId, setDislikeId] = useState<number>(-1);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);

  useEffect(() => {
    if (!userId || !postId) return;
    getLikes(userId, postId).then(d => { setLikeId(d.id); setLikeCount(d.count); }).catch(() => {});
    getDislikes(userId, postId).then(d => { setDislikeId(d.id); setDislikeCount(d.count); }).catch(() => {});
  }, [userId, postId]);

  const toggleLike = async () => {
    if (!userId || !postId) return;
    try {
      if (likeId !== -1) {
        await removeLike(likeId);
        setLikeId(-1);
        setLikeCount(count => count - 1);
      } else {
        const res = await addLike(userId, postId);
        setLikeId(res.id);
        setLikeCount(res.count);
        if (dislikeId !== -1) { setDislikeId(-1); setDislikeCount(c => c - 1); }
      }
    } catch (e) { console.error(e); }
  };

  const toggleDislike = async () => {
    if (!userId || !postId) return;
    try {
      if (dislikeId !== -1) {
        await removeDislike(dislikeId);
        setDislikeId(-1);
        setDislikeCount(c => c - 1);
      } else {
        const res = await addDislike(userId, postId);
        setDislikeId(res.id);
        setDislikeCount(res.count);
        if (likeId !== -1) { setLikeId(-1); setLikeCount(c => c - 1); }
      }
    } catch (e) { console.error(e); }
  };

  return { likeId, dislikeId, likeCount, dislikeCount, toggleLike, toggleDislike };
}