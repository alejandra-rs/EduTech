import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { ReactionButton } from "./ReactionButton";
import { useLikeDislike } from "@services/useLikeDislike";

const ReactionBar = ({ userId, postId }) => {
  const { likeId, dislikeId, likeCount, dislikeCount, toggleLike, toggleDislike } = useLikeDislike(userId, postId);

  if (!userId || !postId) return null;

  return (
    <div className="flex items-center gap-6 py-4 border-t border-gray-100 mt-6">
      <ReactionButton active={likeId !== -1} count={likeCount} onClick={toggleLike}>
        <HandThumbUpIcon className="w-5 h-5" />
      </ReactionButton>
      <ReactionButton active={dislikeId !== -1} count={dislikeCount} onClick={toggleDislike}>
        <HandThumbDownIcon className="w-5 h-5" />
      </ReactionButton>
    </div>
  );
};

export default ReactionBar;
