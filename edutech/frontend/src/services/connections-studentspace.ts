import type { Folder, FolderDetail, SavedPost } from '../models/student_space/student_space.model';
import { apiFetchJson, apiFetchVoid, JSON_HEADERS } from './api';

export const getRootFolder = (): Promise<FolderDetail | null> =>
  apiFetchJson<FolderDetail>(`/api/student-space/folders/root/`).catch(() => null);

export const getFolder = (folderId: number): Promise<FolderDetail | null> =>
  apiFetchJson<FolderDetail>(`/api/student-space/folders/${folderId}/`).catch(() => null);

export const createFolder = (name: string, parentId: number): Promise<Folder | null> =>
  apiFetchJson<Folder>(`/api/student-space/folders/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ name, parent_id: parentId }),
  }).catch(() => null);

export const renameFolder = (folderId: number, name: string): Promise<Folder | null> =>
  apiFetchJson<Folder>(`/api/student-space/folders/${folderId}/`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ name }),
  }).catch(() => null);

export const deleteFolder = (folderId: number): Promise<boolean> =>
  apiFetchVoid(`/api/student-space/folders/${folderId}/`, { method: 'DELETE' })
    .then(() => true).catch(() => false);

export const moveFolder = (folderId: number, targetId: number): Promise<Folder | null> =>
  apiFetchJson<Folder>(`/api/student-space/folders/${folderId}/move/`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ target_id: targetId }),
  }).catch(() => null);

export const savePost = (folderId: number, postId: number): Promise<SavedPost | null> =>
  apiFetchJson<SavedPost>(`/api/student-space/posts/`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ folder_id: folderId, post_id: postId }),
  }).catch(() => null);

export const deleteSavedPost = (savedPostId: number): Promise<boolean> =>
  apiFetchVoid(`/api/student-space/posts/${savedPostId}/`, { method: 'DELETE' })
    .then(() => true).catch(() => false);

export const moveSavedPost = (savedPostId: number, folderId: number): Promise<SavedPost | null> =>
  apiFetchJson<SavedPost>(`/api/student-space/posts/${savedPostId}/move/`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ folder_id: folderId }),
  }).catch(() => null);

export const setPinned = (savedPostId: number, isPinned: boolean): Promise<SavedPost | null> =>
  apiFetchJson<SavedPost>(`/api/student-space/posts/${savedPostId}/`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ is_pinned: isPinned }),
  }).catch(() => null);

export const getPinnedPosts = (): Promise<SavedPost[]> =>
  apiFetchJson<SavedPost[]>(`/api/student-space/pinned/`).catch(() => []);

export const getSpaceStats = (): Promise<{ folder_count: number; saved_post_count: number } | null> =>
  apiFetchJson<{ folder_count: number; saved_post_count: number }>(`/api/student-space/stats/`).catch(() => null);

export const batchDeleteItems = (folderIds: number[], savedPostIds: number[]): Promise<boolean> =>
  apiFetchVoid(`/api/student-space/items/`, {
    method: 'DELETE',
    headers: JSON_HEADERS,
    body: JSON.stringify({ folder_ids: folderIds, saved_post_ids: savedPostIds }),
  }).then(() => true).catch(() => false);

export const getSavedPostId = (postId: number): Promise<number | null> =>
  apiFetchJson<{ saved_post_id: number | null }>(`/api/student-space/posts/check/${postId}/`)
    .then(data => data.saved_post_id)
    .catch(() => null);
