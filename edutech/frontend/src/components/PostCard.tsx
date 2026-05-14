import { HandThumbUpIcon, HandThumbDownIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ReactionButton } from "./interactions/ReactionButton";
import { useState } from 'react';
import { PostPreview } from "../models/documents/post.model";
import { PostPreviewVisual } from "./post-preview/preview";
import { PostLabel } from "./post-preview/labels";
import { IALabel } from "./IALabel";

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export interface PostCardProps {
  post: PostPreview;
  onClick: () => void;
  onDelete?: () => void;
  IA:boolean;
}

export function PostCard({ post, onClick, onDelete, IA }: PostCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const onClickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfirming && onDelete) {
      onDelete();
      setIsConfirming(false);
    } else setIsConfirming(true);
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer"
    >
      <PostPreviewVisual post={post} />

      <div className="absolute top-2 right-2">
        <PostLabel type={post.post_type} />
      </div>

      {onDelete && (
        <button
          onClick={(e) => onClickDelete(e)} onMouseLeave={() => setIsConfirming(false)}
          className="absolute top-2 left-2 flex items-center gap-2 rounded-full p-1.5 transition-all duration-200 shadow text-white bg-red-500 hover:bg-red-600"
          title={isConfirming ? "Confirmar eliminación" : "Eliminar"}
        >
          {isConfirming ? (<>
                            <span className="text-xs font-bold uppercase tracking-wider">Eliminar</span>
                            <TrashIcon className="w-6 h-6" />
                           </>)
                        : (<TrashIcon className="w-6 h-6" />)}
        </button>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h5 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
          {post.title}
        </h5>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-400">
            {formatDate(post.created_at)}
          </span>
          {IA && <IALabel />}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          
          <ReactionButton type="views" count={post.views}>
            <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </ReactionButton>
          <ReactionButton type="like" count={post.likes}>
            <HandThumbUpIcon className="w-4 h-4 text-gray-400" />
          </ReactionButton>
          <ReactionButton type="dislike" count={post.dislikes}>
            <HandThumbDownIcon className="w-4 h-4 text-gray-400" />
          </ReactionButton>
        </div>
      </div>
    </div>
  );
}
