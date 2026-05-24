import { Comment } from "../../models/documents/interactions/comment.model";
import { apiFetchJson, JSON_HEADERS } from "../api";

export const getComments = (documentId: number): Promise<Comment[]> =>
  apiFetchJson(`/api/documents/comments/?post=${documentId}`);

export const postComment = (postId: number, message: string): Promise<Comment> =>
  apiFetchJson(`/api/documents/comments/?post=${postId}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ message }),
  });
