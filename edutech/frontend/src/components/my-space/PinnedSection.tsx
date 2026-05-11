import PostGrid from '../PostGrid';
import type { PostPreview } from '../../models/documents/post.model';

interface PinnedSectionProps {
  posts: PostPreview[];
  onPostClick: (post: PostPreview) => void;
}

export const PinnedSection = ({ posts, onPostClick }: PinnedSectionProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Fijados
        </h2>
      </div>
      
      <PostGrid posts={posts} onPostClick={onPostClick} />
    </section>
  );
};