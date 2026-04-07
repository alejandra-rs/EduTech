import { PostCard } from "./PostCard";

export default function PostGrid({ posts, onPostClick }) {
  return (
    <div className="w-full">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 bg-gray-50 p-3">
        {posts.map((post) => {
          const urlFile = post.post_type === "PDF" ? post.pdf?.file : post.vid?.vid;
          return (<PostCard 
            key={post.id} 
            title={post.title} 
            type={post.post_type} 
            fileUrl={urlFile} 
            date={post.created_at} 
            onClick={() => onPostClick(post)}
            stats={{
                views: post.views || 0,
                likes: post.likes || 0,
                dislikes: post.dislikes || 0
            }}
          />
        )})}
      </div>
    </div>
  );
}