import { PostCard } from "./PostCard";

const getFileUrl = (post) => {
  if (post.post_type === "PDF") return post.pdf?.file;
  if (post.post_type === "VID") return post.vid?.vid;
  return null;
};

const getMeta = (post) => {
  if (post.post_type === "QUI") return post.qui;
  if (post.post_type === "FLC") return post.flc;
  return null;
};

export default function PostGrid({ posts, onPostClick }) {
  return (
    <div className="w-full mb-20">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 bg-gray-50 p-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            type={post.post_type}
            fileUrl={getFileUrl(post)}
            date={post.created_at}
            onClick={() => onPostClick(post)}
            stats={{ views: post.views || 0, likes: post.likes || 0, dislikes: post.dislikes || 0 }}
            meta={getMeta(post)}
          />
        ))}
      </div>
    </div>
  );
}
