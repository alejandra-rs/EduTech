import { PostCard } from "./PostCard";
import { PostPreview } from "../models/documents/post.model";

export interface PostGridProps {
  posts: PostPreview[];
  onPostClick: (post: PostPreview) => void;
  onDelete?: (post: PostPreview) => void;
  emptyMessage?: string;
}

export default function PostGrid({ posts, onPostClick, onDelete, emptyMessage = "No hay publicaciones disponibles." }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-gray-400 italic text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-20">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 bg-gray-50 p-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post)}
            onDelete={onDelete ? () => onDelete(post) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
