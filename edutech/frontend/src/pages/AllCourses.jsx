import React from 'react';
import SearchBar from '../components/SearchBar';
import { WidgetCourse } from '../components/Course';
import NotebookFooter from '../components/Footer';
import { Link } from 'react-router-dom';

const Courses = () => {
  const dummyCourses = Array.from({ length: 4 }).map((_, index) => ({
    id: index + 1,
    courseName: `${index + 1}º CURSO`,
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">
      <div className="flex-grow overflow-y-auto custom-scrollbar px-8 pt-12 pb-10">
        <div className="mb-10 w-full">
          <SearchBar placeholder="Buscar curso..." color="bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">
          {dummyCourses.map((course) => (
            <Link 
              to={`/${course.id}/asignaturas`}
              key={course.id} 
              className="w-full flex justify-center hover:scale-[1.01] transition-transform"
            >
              <WidgetCourse 
                courseName={course.courseName}
                className="max-w-none w-full"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="shrink-0"> 
        <NotebookFooter />
      </div>
    </div>
  );
};

export default Courses;