import { useState, useEffect } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon, FlagIcon } from '@heroicons/react/24/solid';
import { ReactionButton } from './ReactionButton';
import ReportPopup from '../reports/ReportPopup';
import { getLikes, addLike, removeLike, getDislikes, addDislike, removeDislike } from '../../services/interactions/connections-rating';
import { createReport, checkUserReport } from '../../services/interactions/connections-reports';
import type { ReportSubmitData } from '../reports/ReportPopup';

export interface ReactionsContainerProps {
  postId: number;
  children?: React.ReactNode;
}

type ReactionSide = {
  recordId: number | string | null;
  count: number;
  setRecordId: (v: number | string | null) => void;
  setCount: (v: number) => void;
};

async function toggleReaction(
  postId: number,
  self: ReactionSide,
  isActive: boolean,
  other: ReactionSide & { isActive: boolean; remove: (id: number) => Promise<void> },
  add: (postId: number) => Promise<{ id: number }>,
  remove: (id: number) => Promise<void>,
) {
  const prev = {
    selfId: self.recordId, selfCount: self.count,
    otherId: other.recordId, otherCount: other.count,
  };
  try {
    if (isActive) {
      self.setRecordId(null);
      self.setCount(self.count - 1);
      await remove(Number(self.recordId));
    } else {
      self.setRecordId('temp');
      self.setCount(self.count + 1);
      if (other.isActive) {
        other.setRecordId(null);
        other.setCount(other.count - 1);
        await other.remove(Number(other.recordId));
      }
      const rec = await add(postId);
      self.setRecordId(rec.id);
    }
  } catch {
    self.setRecordId(prev.selfId);
    self.setCount(prev.selfCount);
    other.setRecordId(prev.otherId);
    other.setCount(prev.otherCount);
  }
}

const ReactionsContainer = ({ postId, children }: ReactionsContainerProps) => {
  const [likes, setLikes] = useState(0);
  const [likeRecordId, setLikeRecordId] = useState<number | string | null>(null);
  const [dislikes, setDislikes] = useState(0);
  const [dislikeRecordId, setDislikeRecordId] = useState<number | string | null>(null);
  const [isReported, setIsReported] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportAnimate, setReportAnimate] = useState(false);

  const isLiked = likeRecordId !== null;
  const isDisliked = dislikeRecordId !== null;

  useEffect(() => {
    if (!postId) return;
    const load = async () => {
      try {
        const [likeData, dislikeData, reportData] = await Promise.all([
          getLikes(postId),
          getDislikes(postId),
          checkUserReport(postId),
        ]);
        setLikes(likeData.count);
        setLikeRecordId(likeData.id > -1 ? likeData.id : null);
        setDislikes(dislikeData.count);
        setDislikeRecordId(dislikeData.id > -1 ? dislikeData.id : null);
        setIsReported(reportData.reported);
      } catch (error) {
        console.error('Error al cargar reacciones:', error);
      }
    };
    load();
  }, [postId]);

  const handleLike = () => {
    if (!postId) return;
    toggleReaction(
      postId,
      { recordId: likeRecordId, count: likes, setRecordId: setLikeRecordId, setCount: setLikes },
      isLiked,
      { recordId: dislikeRecordId, count: dislikes, setRecordId: setDislikeRecordId, setCount: setDislikes, isActive: isDisliked, remove: removeDislike },
      addLike,
      removeLike,
    );
  };

  const handleDislike = () => {
    if (!postId) return;
    toggleReaction(
      postId,
      { recordId: dislikeRecordId, count: dislikes, setRecordId: setDislikeRecordId, setCount: setDislikes },
      isDisliked,
      { recordId: likeRecordId, count: likes, setRecordId: setLikeRecordId, setCount: setLikes, isActive: isLiked, remove: removeLike },
      addDislike,
      removeDislike,
    );
  };

  const handleFlagClick = () => {
    if (isReported) return;
    setReportAnimate(true);
    setTimeout(() => setReportAnimate(false), 200);
    setReportOpen(true);
  };

  const handleReportSubmit = async ({ reasonId, description }: ReportSubmitData) => {
    await createReport(postId, Number(reasonId), description);
    setIsReported(true);
  };

  if (!postId) return null;

  const reactions = (
    <div className="flex items-center gap-6">
      <ReactionButton active={isLiked} count={likes} onClick={handleLike}>
        <HandThumbUpIcon className="size-7" />
      </ReactionButton>

      <ReactionButton active={isDisliked} count={dislikes} onClick={handleDislike}>
        <HandThumbDownIcon className="size-7" />
      </ReactionButton>

      <div className="flex items-center gap-2 select-none">
        <button type="button"
          onClick={handleFlagClick}
          title={isReported ? 'Ya has reportado este contenido' : 'Reportar publicación'}
          className={`
            transition-all duration-200 p-1.5 rounded-full
            ${reportAnimate ? 'scale-125' : 'scale-100'}
            ${isReported
              ? 'text-red-600 cursor-default'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer'}
          `}
        >
          <FlagIcon className="size-7" />
        </button>
      </div>

      <ReportPopup
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        entity="Publicación"
        onSubmit={handleReportSubmit}
      />
    </div>
  );

  if (children) {
    return (
      <div className="flex items-center justify-between w-full">
        {children}
        {reactions}
      </div>
    );
  }

  return reactions;
};

export default ReactionsContainer;
