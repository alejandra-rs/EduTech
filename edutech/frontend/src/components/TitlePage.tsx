import { ReactNode } from 'react';

interface TitlePageProps {
  PageName: string;
  subtitle: string;
  backLabel: string;
  onBack: () => void;
  children?: ReactNode;
}

export const TitlePage = ({ PageName, subtitle, onBack, backLabel = "Volver", children }: TitlePageProps) => {
  return (
    <div className="relative px-12 pt-10 pb-4 shrink-0 flex items-center min-h-[100px]">
      <div
        onClick={onBack}
        className="group flex items-center gap-2 cursor-pointer z-20"
      >
        <span className="flex items-center text-2xl leading-none font-light text-gray-400 group-hover:text-black group-hover:-translate-x-1 transition-all duration-200 -mt-[3px]">
          {"<"}
        </span>

        <span className="text-sm leading-none font-medium text-gray-400 group-hover:text-black transition-colors uppercase tracking-wider">
          {backLabel}
        </span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-[60%]">
        <h1 className="text-3xl font-bold text-gray-800 text-center leading-tight whitespace-normal line-clamp-3">
          {PageName}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-gray-400 text-center mt-0.5">{subtitle}</p>
        )}
        <div className="h-1 w-12 bg-indigo-500 rounded-full mt-1"></div>
      </div>

      <div className="ml-auto flex items-center gap-4 z-20">
        {children}
      </div>
    </div>
  );
}