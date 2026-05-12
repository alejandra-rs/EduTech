export interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function HamburgerButton({ isOpen, onClick, className = '' }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`select-none flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none cursor-pointer transition-all duration-300 ${className}`}
    >
      <span className={`pointer-events-none bg-white h-1 w-8 rounded-sm transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
      <span className={`pointer-events-none bg-white h-1 w-8 rounded-sm transition-all duration-300 ease-out ${isOpen ? 'opacity-0' : ''}`}></span>
      <span className={`pointer-events-none bg-white h-1 w-8 rounded-sm transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
    </button>
  );
}
