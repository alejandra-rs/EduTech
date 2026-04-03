import Layout from '../components/Layout';
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
      <div className="flex flex-col flex-grow w-full">
        <div className="px-8 pt-8 pb-10"> 
      
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">

            {courses.map((course) => (
              
              <Link 
                to={`/${course.id}/asignaturas`} 
                key={course.id}
                className="block transition-transform hover:scale-[1.02]" 
              >
                <WidgetCourse 
                  courseName={course.year}
                  className="max-w-none w-full h-full"
                />
                
              </Link>
                ))}
          </div>
        </div>
          <NotebookFooter />
      </div>
  );
};

export default Courses;