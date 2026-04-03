import React from 'react';
import SearchBar from '../components/SearchBar';
import { WidgetCourse } from '../components/Course';
import NotebookFooter from '../components/Footer';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import  { getYears } from '../services/connections';
const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getYears()
      .then(data => {
        setCourses(data);
      })
      .catch(error => {
        //TODO show error message to user
      });
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">
      <div className="flex-grow overflow-y-auto custom-scrollbar px-8 pt-12 pb-10">
        <div className="mb-10 w-full">
          <SearchBar placeholder="Buscar curso..." color="bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">
           {courses.map((course) => (
            <Link 
                to={`/${course.id}/asignaturas`} 
                key={course.id}
                className="block transition-transform hover:scale-[1.02]" 
              >
              <WidgetCourse 
                courseName={course.year}
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