import { SavedPost } from '../../models/student_space/student_space.model';
import { PostLabel } from '../post-preview/labels';
import { PinnedButton } from './PinnedButton';

export interface SavedPreviewProps {
  savedPost: SavedPost;
  onClick: () => void;
  onPinToggle?: (savedPost: SavedPost, isPinned: boolean) => void;
}

export function SavedPreview({ savedPost, onClick, onPinToggle}: SavedPreviewProps) {
    return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
    >
      <div className="w-10 flex-shrink-0 flex justify-center items-center scale-75 origin-left">
        <PostLabel type={savedPost.post.post_type} />
      </div>
      
      <div className="flex flex-col overflow-hidden w-full">
        <span className="font-semibold text-gray-800 truncate" title={savedPost.post.title}>
          {savedPost.post.title}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(savedPost.saved_at).toLocaleDateString('es-ES')}
        </span>
      </div>
      <PinnedButton savedPostId={savedPost.id} onPinToggle={(isPinned) => onPinToggle && onPinToggle(savedPost, isPinned)} />
    </div>
  );
}