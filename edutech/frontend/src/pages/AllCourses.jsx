import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import { WidgetCourse } from '../components/Course';
import NotebookFooter from '../components/Footer';
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



const Courses = () => {
const dummyCourses = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    courseName: `Curso ${index + 1}`,
    semester: `Semestre ${index % 2 === 0 ? '1' : '2'}`
  }));

  return (
      <div className="flex flex-col flex-grow w-full">
        <div className="px-8 pt-8 pb-10"> 
      
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">

            {dummyCourses.map((course) => (
              
              <Link 
                to={`/${course.id}/asignaturas`} 
                key={course.id}
                className="block transition-transform hover:scale-[1.02]" // Pequeño efecto de zoom al pasar el ratón
              >
                <WidgetCourse 
                  courseName={course.courseName}
                  semester={course.semester}
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