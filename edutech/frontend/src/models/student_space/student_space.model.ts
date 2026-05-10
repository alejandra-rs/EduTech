import type { PostPreview } from '../documents/post.model';

export interface FolderPath {
  id: number;
  name: string;
}

export interface Folder {
  id: number;
  name: string;
  depth: number;
  created_at: string;
}

export interface SavedPost {
  id: number;
  post: PostPreview;
  saved_at: string;
  is_pinned: boolean;
  pinned_at: string | null;
}

export interface FolderDetail extends Folder {
  path: FolderPath[];
  children: Folder[];
  saved_posts: SavedPost[];
}
