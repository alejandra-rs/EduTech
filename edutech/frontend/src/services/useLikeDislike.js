import { useState, useEffect } from "react";

export const getLikes = async (userId, postId) => {
  const res = await fetch(`/api/documents/likes/?user=${userId}&post=${postId}`);
  if (!res.ok) throw new Error("Error al obtener likes");
  return res.json();
};

export const addLike = async (userId, postId) => {
  const res = await fetch(`/api/documents/likes/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: userId, post: postId }) });
  if (!res.ok) throw new Error("Error al añadir like");
  return res.json();
};

export const removeLike = async (likeId) => {
  const res = await fetch(`/api/documents/likes/${likeId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Error al eliminar like");
};

export const getDislikes = async (userId, postId) => {
  const res = await fetch(`/api/documents/dislikes/?user=${userId}&post=${postId}`);
  if (!res.ok) throw new Error("Error al obtener dislikes");
  return res.json();
};

export const addDislike = async (userId, postId) => {
  const res = await fetch(`/api/documents/dislikes/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: userId, post: postId }) });
  if (!res.ok) throw new Error("Error al añadir dislike");
  return res.json();
};

export const removeDislike = async (dislikeId) => {
  const res = await fetch(`/api/documents/dislikes/${dislikeId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Error al eliminar dislike");
};

export function useLikeDislike(userId, postId) {
  const [likeId, setLikeId] = useState(-1);
  const [dislikeId, setDislikeId] = useState(-1);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  useEffect(() => {
    if (!userId || !postId) return;
    getLikes(userId, postId).then(d => { setLikeId(d.id); setLikeCount(d.count); }).catch(() => {});
    getDislikes(userId, postId).then(d => { setDislikeId(d.id); setDislikeCount(d.count); }).catch(() => {});
  }, [userId, postId]);

  const toggleLike = async () => {
    try {
      if (likeId !== -1) {
        await removeLike(likeId);
        setLikeId(-1);
        setLikeCount(c => c - 1);
      } else {
        const res = await addLike(userId, postId);
        setLikeId(res.id);
        setLikeCount(res.count);
        if (dislikeId !== -1) { setDislikeId(-1); setDislikeCount(c => c - 1); }
      }
    } catch (e) { console.error(e); }
  };

  const toggleDislike = async () => {
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
