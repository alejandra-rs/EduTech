import { useState, useEffect } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { ReactionButton } from './ReactionButton';
import { 
  getUserId, 
  getLikes, addLike, removeLike,
  getDislikes, addDislike, removeDislike 
} from '@services/connections';

const ReactionsContainer = ({ PostId }) => {
  const [userId, setUserId] = useState(null);

  const [likes, setLikes] = useState(0);
  const [likeRecordId, setLikeRecordId] = useState(null);
  
  const [dislikes, setDislikes] = useState(0);
  const [dislikeRecordId, setDislikeRecordId] = useState(null);

  const isLiked = likeRecordId !== null;
  const isDisliked = dislikeRecordId !== null;

  useEffect(() => {
    const cargarReacciones = async () => {
      try {
        const user = await getUserId();
        setUserId(user);
        
        const [likeData, dislikeData] = await Promise.all([
          getLikes(user, PostId),
          getDislikes(user, PostId)
        ]);
        
        setLikes(likeData.count);
        setLikeRecordId(likeData.id > -1 ? likeData.id : null); 

        setDislikes(dislikeData.count);
        setDislikeRecordId(dislikeData.id > -1 ? dislikeData.id : null);
      } catch (error) {
        console.error('Error al cargar las reacciones:', error);
      }
    };

    if (PostId) {
      cargarReacciones();
    }
  }, [PostId]);

  const handleLike = async () => {
    if (!userId) return;

    const prevLikes = likes;
    const prevLikeId = likeRecordId;
    const prevDislikes = dislikes;
    const prevDislikeId = dislikeRecordId;

    try {
      if (isLiked) {
        setLikeRecordId(null);
        setLikes(prevLikes - 1);
        await removeLike(prevLikeId); 
      } else {
        setLikeRecordId("temp");
        setLikes(prevLikes + 1);

        if (isDisliked) {
          setDislikeRecordId(null); 
          setDislikes(prevDislikes - 1);
          await removeDislike(prevDislikeId); 
        }
        
        const newLike = await addLike(userId, PostId); 
        setLikeRecordId(newLike.id);
      }
    } catch (error) {
      setLikeRecordId(prevLikeId);
      setLikes(prevLikes);
      setDislikeRecordId(prevDislikeId);
      setDislikes(prevDislikes);
    }
  };

  const handleDislike = async () => {
    if (!userId) return;

    const prevDislikes = dislikes;
    const prevDislikeId = dislikeRecordId;
    const prevLikes = likes;
    const prevLikeId = likeRecordId;

    try {
      if (isDisliked) {
        setDislikeRecordId(null);
        setDislikes(prevDislikes - 1);
        await removeDislike(prevDislikeId); 
      } else {
        setDislikeRecordId("temp");
        setDislikes(prevDislikes + 1);

        if (isLiked) {
          setLikeRecordId(null); 
          setLikes(prevLikes - 1);
          await removeLike(prevLikeId); 
        }
        
        const newDislike = await addDislike(userId, PostId); 
        setDislikeRecordId(newDislike.id);
      }
    } catch (error) {
      setDislikeRecordId(prevDislikeId);
      setDislikes(prevDislikes);
      setLikeRecordId(prevLikeId);
      setLikes(prevLikes);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <ReactionButton 
        active={isLiked} 
        count={likes} 
        onClick={handleLike}
      >
        <HandThumbUpIcon className="w-7 h-7" />
      </ReactionButton>

      <ReactionButton 
        active={isDisliked} 
        count={dislikes} 
        onClick={handleDislike}
      >
        <HandThumbDownIcon className="w-7 h-7" />
      </ReactionButton>
    </div>
  );
};

export default ReactionsContainer;