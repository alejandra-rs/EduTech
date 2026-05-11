import { useState } from 'react';
import { SaveButton } from './SaveButton';
import { PinnedButton } from './PinnedButton';

interface PostActionButtonsProps {
  postId: number;
}

export const PostActionButtons = ({ postId }: PostActionButtonsProps) => {
  const [savedId, setSavedId] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-2">
      {savedId !== null && (
        <PinnedButton savedPostId={savedId} />
      )}

      <SaveButton 
        postId={postId} 
        onSavedStatusChange={(id) => setSavedId(id)} 
      />
    </div>
  );
};