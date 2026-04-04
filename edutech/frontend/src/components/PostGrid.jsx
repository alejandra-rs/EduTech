import { PostCard } from "./PostCard";

export default function PostGrid({ posts }) {
  return (
    <div className="w-full">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 bg-gray-50 p-3">
        {posts.map((post) => {
          const urlFile = post.post_type === "PDF" 
            ? post.PDF?.file 
            : post.VID?.vid;
          return (<PostCard 
            key={post.id} 
            title={post.title} 
            type={post.post_type} 
            fileUrl={urlFile} 
            date={post.created_at} 
          />
        )})}
      </div>
    </div>
  );
}