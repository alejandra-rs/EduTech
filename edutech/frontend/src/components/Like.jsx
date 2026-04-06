import { useState } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { getLikes, getUserId, addLike, removeLike} from '@services/connections';
import { useEffect } from 'react';

const LikeButton = ({PostId}) => {
  const [likes, setLikes] = useState(0);
  const [animate, setAnimate] = useState(false);
  
  const [userId, setUserId] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const active = recordId !== null;

  useEffect(() => {
    const cargarLikes = async () => {
      try {
        const user = await getUserId();
        setUserId(user);
        const data = await getLikes(user, PostId);
        
        setLikes(data.count);
        setRecordId(data.self ? data.recordId : null); 

      } catch (error) {
        console.error('Error al cargar los likes:', error);
      }
    };

    if (PostId) {
      cargarLikes();
    }
  }, [PostId]);

  const handleLike = async () => {
    if (!userId) return;

    const likesAnteriores = likes;
    const recordIdAnterior = recordId;

    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);

    try {
      if (active) {
        setRecordId(null);
        setLikes(likesAnteriores - 1);
        if (recordIdAnterior) await removeLike(recordIdAnterior); 

      } else {
        setRecordId("temp");
        setLikes(likesAnteriores + 1);
        
        const newLike = await addLike(userId, PostId); 
        setRecordId(newLike.id);
      }
    } catch (error) {
      console.error("Error al procesar el like", error);
      setRecordId(recordIdAnterior);
      setLikes(likesAnteriores);
    }
  };

  return (
    <div className="flex items-center gap-2 select-none group">
      <button
        onClick={handleLike}
        className={`
          transition-all duration-200 
          ${animate ? 'scale-125' : 'scale-100'}
          ${active ? 'text-black' : 'text-gray-400 hover:text-black/80'}
          p-1.5 rounded-full
          hover:bg-gray-100/50
        `}
      >
        <HandThumbUpIcon className="w-7 h-7" />
      </button>
      <span className={`font-bold text-xl transition-colors ${active ? 'text-black' : 'text-gray-600'}`}>
        {likes}
      </span>
    </div>
  );
};

export default LikeButton;