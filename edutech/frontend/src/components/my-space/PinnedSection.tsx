import { MapPinIcon } from '@heroicons/react/24/solid';
import { PostCard } from '../PostCard';
import type { PostPreview } from '../../models/documents/post.model';
import type { SavedPost } from '../../models/student_space/student_space.model';
import { SectionTitle } from './SectionTitle';
import { setPinned } from '../../services/connections-studentspace';

interface PinnedSectionProps {
  posts: SavedPost[];
  onPostClick: (post: PostPreview) => void;
  onUnpin: (savedPost: SavedPost) => void;
}

export const PinnedSection = ({ posts, onPostClick, onUnpin }: PinnedSectionProps) => {
  if (!posts || posts.length === 0) return null;

  const handleUnpin = async (e: React.MouseEvent, savedPost: SavedPost) => {
    e.stopPropagation();
    try {
      await setPinned(savedPost.id, false);
      onUnpin(savedPost);
    } catch (error) {
      console.error("Error al desfijar", error);
    }
  };

  return (
    <section className="mb-10">
      <SectionTitle title="Fijados" />
      <div className="w-full mb-20">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 bg-gray-50 p-3">
          {posts.map((savedPost) => (
            <div key={savedPost.id} className="relative">
              <PostCard
                post={savedPost.post}
                onClick={() => onPostClick(savedPost.post)}
              />
              <button type="button"
                onClick={(e) => handleUnpin(e, savedPost)}
                title="Desfijar"
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full shadow transition-all hover:scale-110 active:scale-95"
              >
                <MapPinIcon className="size-4 text-black" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
