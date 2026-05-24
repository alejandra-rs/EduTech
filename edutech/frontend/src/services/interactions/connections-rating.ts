import { useState, useEffect } from "react";
import { InteractionResponse } from "../../models/documents/interactions/rating.model";
import { apiFetchJson, apiFetchVoid, JSON_HEADERS } from "../api";

export const getLikes = (postId: number): Promise<InteractionResponse> =>
  apiFetchJson(`/api/documents/likes/?post=${postId}`);

export const addLike = (postId: number): Promise<InteractionResponse> =>
  apiFetchJson(`/api/documents/likes/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ post: postId }),
  });

export const removeLike = (likeId: number): Promise<void> =>
  apiFetchVoid(`/api/documents/likes/${likeId}`, { method: 'DELETE' });

export const getDislikes = (postId: number): Promise<InteractionResponse> =>
  apiFetchJson(`/api/documents/dislikes/?post=${postId}`);

export const addDislike = (postId: number): Promise<InteractionResponse> =>
  apiFetchJson(`/api/documents/dislikes/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ post: postId }),
  });

export const removeDislike = (dislikeId: number): Promise<void> =>
  apiFetchVoid(`/api/documents/dislikes/${dislikeId}`, { method: 'DELETE' });

export function useLikeDislike(postId: number | null) {
  const [likeId, setLikeId] = useState<number>(-1);
  const [dislikeId, setDislikeId] = useState<number>(-1);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);

  useEffect(() => {
    if (!postId) return;
    getLikes(postId).then(d => { setLikeId(d.id); setLikeCount(d.count); }).catch(() => {});
    getDislikes(postId).then(d => { setDislikeId(d.id); setDislikeCount(d.count); }).catch(() => {});
  }, [postId]);

  const toggleLike = async () => {
    if (!postId) return;
    try {
      if (likeId !== -1) {
        await removeLike(likeId);
        setLikeId(-1);
        setLikeCount(count => count - 1);
      } else {
        const res = await addLike(postId);
        setLikeId(res.id);
        setLikeCount(res.count);
        if (dislikeId !== -1) { setDislikeId(-1); setDislikeCount(c => c - 1); }
      }
    } catch (e) { console.error(e); }
  };

  const toggleDislike = async () => {
    if (!postId) return;
    try {
      if (dislikeId !== -1) {
        await removeDislike(dislikeId);
        setDislikeId(-1);
        setDislikeCount(c => c - 1);
      } else {
        const res = await addDislike(postId);
        setDislikeId(res.id);
        setDislikeCount(res.count);
        if (likeId !== -1) { setLikeId(-1); setLikeCount(c => c - 1); }
      }
    } catch (e) { console.error(e); }
  };

  return { likeId, dislikeId, likeCount, dislikeCount, toggleLike, toggleDislike };
}
