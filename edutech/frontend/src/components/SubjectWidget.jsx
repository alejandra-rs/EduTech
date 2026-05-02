import { AcademicCapIcon } from "@heroicons/react/24/outline";
import BellButton from "./interactions/BellButton";

export const SubjectWidget = ({ subjectName, subjectId, degreeName, onNavigate}) => {
  return (
    <div
      onClick={onNavigate}
      className="group relative w-full h-[110px] bg-white rounded-[18px] border-2 border-solid border-black/20 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] overflow-hidden"
    >
      <div className="flex h-full p-4 items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <AcademicCapIcon className="w-7 h-7 text-gray-700" />
        </div>
        <div className="flex flex-col flex-grow min-w-0">
          <h3 className="text-lg font-bold text-black truncate">
            {subjectName}
          </h3>
          {degreeName && (
            <span className="text-xs font-medium text-gray-400 truncate">{degreeName}</span>
          )}
        </div>
        <BellButton subjectId={subjectId} />
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400 group-hover:w-2 transition-all" />
    </div>
  );
};

export default SubjectWidget;
