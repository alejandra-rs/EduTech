import { AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/solid'

export const WidgetCourse = ({ courseName = "Curso", semester = "Semestre", className = "" }) => {
  return (
    <div className={`flex flex-col w-144 h-26 items-center justify-center gap-4 p-5 bg-gray-300 rounded-xl ${className}`}>
      <div className="inline-flex items-center gap-2.5">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <AcademicCapIcon className="w-8 h-8 text-black" />
        </div>
        <div className="flex items-center text-black font-medium italic text-xl">
          {courseName}
        </div>
      </div>
      <div className="inline-flex items-center gap-2.5">
        <UserGroupIcon className="w-6 h-6 text-gray-700" />
        <div className="flex items-center text-black font-medium italic text-xl">
          {semester}
        </div>
      </div>
    </div>
  )
}