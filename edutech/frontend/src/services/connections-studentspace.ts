import type { Folder, FolderDetail, SavedPost } from '../models/student_space/student_space.model';
import { apiFetch } from './api';


export const getRootFolder = async (studentId: number): Promise<FolderDetail | null> => {
  try {
    const response = await apiFetch(`/api/student-space/folders/root/?student=${studentId}`);
    if (!response.ok) throw new Error(`Error al obtener la carpeta raíz: ${response.status}`);
    return await response.json() as FolderDetail;
  } catch (error) {
    console.error('Error en getRootFolder:', error);
    return null;
  }
};

export const getFolder = async (folderId: number, studentId: number): Promise<FolderDetail | null> => {
  try {
    const response = await apiFetch(`/api/student-space/folders/${folderId}/?student=${studentId}`);
    if (!response.ok) throw new Error(`Error al obtener la carpeta: ${response.status}`);
    return await response.json() as FolderDetail;
  } catch (error) {
    console.error(`Error en getFolder con id ${folderId}:`, error);
    return null;
  }
};

export const createFolder = async (name: string, parentId: number, studentId: number): Promise<Folder | null> => {
  try {
    const response = await apiFetch('/api/student-space/folders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parent_id: parentId, student_id: studentId }),
    });
    if (!response.ok) throw new Error(`Error al crear la carpeta: ${response.status}`);
    return await response.json() as Folder;
  } catch (error) {
    console.error('Error en createFolder:', error);
    return null;
  }
};

export const renameFolder = async (folderId: number, name: string, studentId: number): Promise<Folder | null> => {
  try {
    const response = await apiFetch(`/api/student-space/folders/${folderId}/?student=${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error(`Error al renombrar la carpeta: ${response.status}`);
    return await response.json() as Folder;
  } catch (error) {
    console.error(`Error en renameFolder con id ${folderId}:`, error);
    return null;
  }
};

export const deleteFolder = async (folderId: number, studentId: number): Promise<boolean> => {
  try {
    const response = await apiFetch(`/api/student-space/folders/${folderId}/?student=${studentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar la carpeta: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`Error en deleteFolder con id ${folderId}:`, error);
    return false;
  }
};

export const moveFolder = async (folderId: number, targetId: number, studentId: number): Promise<Folder | null> => {
  try {
    const response = await apiFetch(`/api/student-space/folders/${folderId}/move/?student=${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_id: targetId }),
    });
    if (!response.ok) throw new Error(`Error al mover la carpeta: ${response.status}`);
    return await response.json() as Folder;
  } catch (error) {
    console.error(`Error en moveFolder con id ${folderId}:`, error);
    return null;
  }
};

export const savePost = async (folderId: number, postId: number, studentId: number): Promise<SavedPost | null> => {
  try {
    const response = await apiFetch('/api/student-space/posts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder_id: folderId, post_id: postId, student_id: studentId }),
    });
    if (!response.ok) throw new Error(`Error al guardar la publicación: ${response.status}`);
    return await response.json() as SavedPost;
  } catch (error) {
    console.error('Error en savePost:', error);
    return null;
  }
};

export const deleteSavedPost = async (savedPostId: number, studentId: number): Promise<boolean> => {
  try {
    const response = await apiFetch(`/api/student-space/posts/${savedPostId}/?student=${studentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar la publicación guardada: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`Error en deleteSavedPost con id ${savedPostId}:`, error);
    return false;
  }
};

export const moveSavedPost = async (savedPostId: number, folderId: number, studentId: number): Promise<SavedPost | null> => {
  try {
    const response = await apiFetch(`/api/student-space/posts/${savedPostId}/move/?student=${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder_id: folderId }),
    });
    if (!response.ok) throw new Error(`Error al mover la publicación guardada: ${response.status}`);
    return await response.json() as SavedPost;
  } catch (error) {
    console.error(`Error en moveSavedPost con id ${savedPostId}:`, error);
    return null;
  }
};

export const setPinned = async (savedPostId: number, isPinned: boolean, studentId: number): Promise<SavedPost | null> => {
  try {
    const response = await apiFetch(`/api/student-space/posts/${savedPostId}/?student=${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: isPinned }),
    });
    if (!response.ok) throw new Error(`Error al ${isPinned ? 'fijar' : 'desfijar'} la publicación: ${response.status}`);
    return await response.json() as SavedPost;
  } catch (error) {
    console.error(`Error en setPinned con id ${savedPostId}:`, error);
    return null;
  }
};

export const getPinnedPosts = async (studentId: number): Promise<SavedPost[]> => {
  try {
    const response = await apiFetch(`/api/student-space/pinned/?student=${studentId}`);
    if (!response.ok) throw new Error(`Error al obtener las publicaciones fijadas: ${response.status}`);
    return await response.json() as SavedPost[];
  } catch (error) {
    console.error('Error en getPinnedPosts:', error);
    return [];
  }
};


export const getPinned = async (savedPostId: number, studentId: number): Promise<number | null> => {
  try {
    const response = await apiFetch(`/api/student-space/posts/${savedPostId}/?student=${studentId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.is_pinned ? data.id : null; 
  } catch (error) {
    console.error('Error en getPinned:', error);
    return null;
  }
};

export const getSpaceStats = async (studentId: number): Promise<{ folder_count: number; saved_post_count: number } | null> => {
  try {
    const response = await apiFetch(`/api/student-space/stats/?student=${studentId}`);
    if (!response.ok) throw new Error(`Error al obtener estadísticas: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error en getSpaceStats:', error);
    return null;
  }
};

export const batchDeleteItems = async (
  folderIds: number[],
  savedPostIds: number[],
  studentId: number,
): Promise<boolean> => {
  try {
    const response = await apiFetch(`/api/student-space/items/?student=${studentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder_ids: folderIds, saved_post_ids: savedPostIds }),
    });
    if (!response.ok) throw new Error(`Error al eliminar elementos: ${response.status}`);
    return true;
  } catch (error) {
    console.error('Error en batchDeleteItems:', error);
    return false;
  }
};

export const getSavedPostId = async (postId: number): Promise<number | null> => {
  try {
    const response = await apiFetch(`/api/student-space/posts/check/${postId}/`);
    const data = await response.json();
    return data.saved_post_id;
  } catch (error) {
    console.error("Error al comprobar si el post está guardado:", error);
    return null;
  }
};