import { PostCard } from "./PostCard";

export default function PostGrid({ posts }) {
  return (
    <div className="w-full">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            title={post.title} 
            type={post.type} 
            fileUrl={post.fileUrl} 
            date={post.date} 
          />
        ))}
      </div>
    </div>
  );
}