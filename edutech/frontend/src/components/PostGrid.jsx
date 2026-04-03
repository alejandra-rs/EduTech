import { PostCard } from "./PostCard";
export default function PostGrid({ posts }) {
  return posts.length > 0 ? (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
  ) : (
    <div className="text-center py-20 text-gray-400 italic">
      No hay recursos que coincidan con los filtros seleccionados.
    </div>
  );
}
