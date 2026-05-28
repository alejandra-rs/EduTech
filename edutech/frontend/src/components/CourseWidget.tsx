import { AcademicCapIcon } from "@heroicons/react/24/outline";
import BellButton from "./interactions/BellButton";


export interface CourseWidgetProps {
  courseName: string;
  courseId: number;
}

export const CourseWidget = ({ courseName, courseId}: CourseWidgetProps) => {
  return (
    <div
      className="group relative w-full h-fit bg-white rounded-2xl border-2 border-black/20 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] overflow-hidden"
    >
      <div className="flex p-4 items-center gap-4">
        <div className="flex-shrink-0 size-12 bg-gray-100 rounded-full flex items-center justify-center">
          <AcademicCapIcon className="size-7 text-gray-700" />
        </div>
          <h3 className="text-lg font-semibold text-black flex-grow min-w-0 truncate">
            {courseName}
          </h3>
        <BellButton courseId={courseId} />
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-400 group-hover:w-2 transition-all" />
    </div>
  );
};

export default CourseWidget;
