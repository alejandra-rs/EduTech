import { useState } from 'react';export interface ReactionButtonProps {
  children: React.ReactNode;
  count?: number;
  type?: "like" | "dislike" | "views";
  active?: boolean;
  onClick?: () => void;
}

export function ReactionButton({ children, count, type, active = false, onClick }: ReactionButtonProps) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
    onClick?.();
  };

  return (
    <div className="flex items-center gap-2 select-none group">
      <button
        onClick={handleClick}
        className={`
          transition-all duration-200 p-1.5 rounded-full hover:bg-gray-100/50
          ${animate ? 'scale-125' : 'scale-100'}
          ${active ? 'text-black' : 'text-gray-400 hover:text-black/80'}
        `}
      >
        {children}
      </button>
      
      <span className={`font-bold text-xl transition-colors ${active ? 'text-black' : 'text-gray-600'}`}>
        {count}
      </span>
    </div>
  );
};