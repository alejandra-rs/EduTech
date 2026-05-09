import { CourseWidget } from "./CourseWidget";
import { Link } from "react-router-dom";
import { getCourses } from "../services/connections-courses";
import { useState, useEffect } from "react";
import { Course } from "../models/courses/course.model"; 

export interface QuarterProps {
  quarter: number;
  title: string;
  yearId: string;
}
export function Quarter({ quarter, title, yearId }: QuarterProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getCourses(Number(yearId), quarter)
      .then(setCourses)
      .catch((error) => console.error("Error al obtener los cursos del cuatrimestre:", error));
  }, [yearId, quarter] );

  return (
    <div className="bg-gray-200/70 rounded-[40px] p-6 w-full max-w-md h-full flex flex-col shadow-inner border border-black/5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center shrink-0">
        {title}
      </h2>

      <div className="flex-grow overflow-y-auto max-h-[75vh] pr-2 space-y-4 custom-scrollbar">
        {courses.map((course: Course) => (
          <Link 
            key={course.id} 
            to={`/${yearId}/${course.id}/post`} 
            className="block transition hover:opacity-80"
          >
            <CourseWidget
              key={course.id}
              courseName={course.name}
              courseId={course.id}
              />
          </Link>
        ))}
      </div>
    </div>
  );
}
