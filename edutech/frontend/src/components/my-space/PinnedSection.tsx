import PostGrid from '../PostGrid';
import type { PostPreview } from '../../models/documents/post.model';
import { SavedPost } from '../../models/student_space/student_space.model';
import { SectionTitle } from './SectionTitle';

interface PinnedSectionProps {
  posts: SavedPost[];
  onPostClick: (post: PostPreview) => void;
}

export const PinnedSection = ({ posts, onPostClick }: PinnedSectionProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionTitle title="Fijados" />
      <PostGrid posts={posts.map(post => (post.post))} onPostClick={onPostClick} />
    </section>
  );
};