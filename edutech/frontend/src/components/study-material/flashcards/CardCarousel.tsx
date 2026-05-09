import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface NavArrowProps {
  onClick: () => void;
  disabled: boolean;
  flip?: boolean;
}

const NavArrow = ({ onClick, disabled, flip }: NavArrowProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
  >
    <ChevronLeftIcon className={`w-5 h-5 text-gray-600 ${flip ? "rotate-180" : ""}`} />
  </button>
);

export interface CardCarouselProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  children: React.ReactNode;
}

const CardCarousel = ({ onPrev, onNext, canGoPrev, canGoNext, children }: CardCarouselProps) => (
  <div className="flex items-center gap-4">
    <NavArrow onClick={onPrev} disabled={!canGoPrev} />
    <div className="flex-1">{children}</div>
    <NavArrow onClick={onNext} disabled={!canGoNext} flip />
  </div>
);

export default CardCarousel;
