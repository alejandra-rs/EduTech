import UserAvatar from "./UserAvatar";

export default function Comentario({ comment, user }) {
  return (
    <div className="bg-[#dfdfdf] rounded-lg p-5 sm:p-6 flex gap-4 w-full font-sans">
      <div className="flex flex-row">
        <UserAvatar imageUrl={user?.picture} />
        <date className="text-sm text-gray-500 mb-2">
          {comment?.created_at &&
            new Date(comment.created_at).toLocaleDateString()}
        </date>
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {user?.first_name} {user?.last_name}
        </h3>
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-6">
          {comment?.message}
        </p>
      </div>
    </div>
  );
}
