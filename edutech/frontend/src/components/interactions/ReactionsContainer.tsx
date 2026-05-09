import { useState, useEffect } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon, FlagIcon } from '@heroicons/react/24/solid';
import { useCurrentUser } from '../../services/useCurrentUser';
import { ReactionButton } from './ReactionButton';
import ReportPopup from '../reports/ReportPopup';
import { getLikes, addLike, removeLike, getDislikes, addDislike, removeDislike } from '../../services/interactions/connections-rating';
import { createReport, checkUserReport } from '../../services/interactions/connections-reports';
import type { ReportSubmitData } from '../reports/ReportPopup';

export interface ReactionsContainerProps {
  postId: number;
}

const ReactionsContainer = ({ postId }: ReactionsContainerProps) => {
  const { userData } = useCurrentUser();

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
    if (!postId || !userData) return;
    const load = async () => {
      try {
        const [likeData, dislikeData, reportData] = await Promise.all([
          getLikes(userData.id, postId),
          getDislikes(userData.id, postId),
          checkUserReport(userData.id, postId),
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
  }, [postId, userData]);

  const handleLike = async () => {
    if (!userData?.id) return;
    const prev = { likes, likeRecordId, dislikes, dislikeRecordId };
    try {
      if (isLiked) {
        setLikeRecordId(null);
        setLikes(prev.likes - 1);
        await removeLike(Number(prev.likeRecordId));
      } else {
        setLikeRecordId('temp');
        setLikes(prev.likes + 1);
        if (isDisliked) {
          setDislikeRecordId(null);
          setDislikes(prev.dislikes - 1);
          await removeDislike(Number(prev.dislikeRecordId));
        }
        const newLike = await addLike(userData.id, postId);
        setLikeRecordId(newLike.id);
      }
    } catch {
      setLikeRecordId(prev.likeRecordId);
      setLikes(prev.likes);
      setDislikeRecordId(prev.dislikeRecordId);
      setDislikes(prev.dislikes);
    }
  };

  const handleDislike = async () => {
    if (!userData?.id) return;
    const prev = { likes, likeRecordId, dislikes, dislikeRecordId };
    try {
      if (isDisliked) {
        setDislikeRecordId(null);
        setDislikes(prev.dislikes - 1);
        await removeDislike(Number(prev.dislikeRecordId));
      } else {
        setDislikeRecordId('temp');
        setDislikes(prev.dislikes + 1);
        if (isLiked) {
          setLikeRecordId(null);
          setLikes(prev.likes - 1);
          await removeLike(Number(prev.likeRecordId));
        }
        const newDislike = await addDislike(userData.id, postId);
        setDislikeRecordId(newDislike.id);
      }
    } catch {
      setDislikeRecordId(prev.dislikeRecordId);
      setDislikes(prev.dislikes);
      setLikeRecordId(prev.likeRecordId);
      setLikes(prev.likes);
    }
  };

  const handleFlagClick = () => {
    if (isReported) return;
    setReportAnimate(true);
    setTimeout(() => setReportAnimate(false), 200);
    setReportOpen(true);
  };

  const handleReportSubmit = async ({ reasonId, description }: ReportSubmitData) => {
    await createReport(postId, userData!.id, Number(reasonId), description);
    setIsReported(true);
  };

  if (!userData || !postId) return null;

  return (
    <div className="flex items-center gap-6">
      <ReactionButton active={isLiked} count={likes} onClick={handleLike}>
        <HandThumbUpIcon className="w-7 h-7" />
      </ReactionButton>

      <ReactionButton active={isDisliked} count={dislikes} onClick={handleDislike}>
        <HandThumbDownIcon className="w-7 h-7" />
      </ReactionButton>

      <div className="flex items-center gap-2 select-none">
        <button
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
          <FlagIcon className="w-7 h-7" />
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
};

export default ReactionsContainer;
