import { apiFetch, getCurrentUserId } from './api';
import type { RevisionItem } from '../models/documents/revision.model';

export async function getRevisionQueue(): Promise<RevisionItem[]> {
  try {
    const response = await apiFetch(`/api/documents/revision/?admin_id=${getCurrentUserId()}`);
    if (!response.ok) throw new Error("Error fetching revision queue");
    return await response.json() as RevisionItem[];
  } catch (error) {
    console.error("Error in getRevisionQueue:", error);
    throw error;
  }
}

export async function publishRevision(noteId: number): Promise<void> {
  try {
    const response = await apiFetch(`/api/documents/revision/publish/${noteId}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: getCurrentUserId() }),
    });
    if (!response.ok) throw new Error("Error publishing revision");
  } catch (error) {
    console.error("Error in publishRevision:", error);
    throw error;
  }
}

export async function discardRevision(noteId: number): Promise<void> {
  try {
    const response = await apiFetch(`/api/documents/revision/${noteId}/?admin_id=${getCurrentUserId()}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error discarding revision");
  } catch (error) {
    console.error("Error in discardRevision:", error);
    throw error;
  }
}
