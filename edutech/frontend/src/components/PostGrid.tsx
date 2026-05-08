import { PostCard } from "./PostCard";
import { PostPreview } from "../models/documents/post.model";

export interface PostGridProps {
  posts: PostPreview[];
  onPostClick: (post: PostPreview) => void;
  onDelete?: (post: PostPreview) => void;
}

export default function PostGrid({ posts, onPostClick, onDelete }: PostGridProps) {  return (
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
