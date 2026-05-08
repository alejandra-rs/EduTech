import { AcademicCapIcon } from "@heroicons/react/24/solid";
export interface YearWidgetProps {
  courseName?: string;
  onNavigate?: () => void;
  className?: string;
}

export const YearWidget = ({
  courseName,
  onNavigate,
  className,
}: YearWidgetProps) => {
  return (
    <div
      onClick={onNavigate}
      className={`
        group relative flex items-center w-full max-w-none p-5 h-full
        bg-gray-200 border-2 border-black/5 rounded-[18px] 
        shadow-sm hover:shadow-md hover:bg-gray-300/50
        transition-all duration-200 cursor-pointer 
        active:scale-95 overflow-hidden
        ${className}
      `}
    >
      <div className="flex items-center gap-5 w-full">
        <div className="flex-shrink-0 w-14 h-14 bg-black/10 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
          <AcademicCapIcon className="w-8 h-8 text-black" />
        </div>

          <h3 className="text-xl font-black text-black italic leading-tight truncate tracking-tight">
            {courseName}
          </h3>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/10 group-hover:bg-black/30 transition-all" />
    </div>
  );
};

export default YearWidget;
