import React from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import WidgetCourse from '../components/Course';
import NotebookFooter from '../components/Footer';

const Courses = () => {
  const dummyCourses = Array(8).fill({
    courseName: "Curso",
    semester: "Semestre"
  });

  return (
    <Layout>
      <div className="flex flex-col flex-grow w-full">
        <div className="px-8 pt-8 pb-10"> 
          <div className="mb-10 w-full">
            <SearchBar placeholder="Search..." color="bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">
            {dummyCourses.map((course, index) => (
              <div key={index} className="w-full flex justify-center">
                <WidgetCourse 
                  courseName={course.courseName}
                  semester={course.semester}
                  className="max-w-none w-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <NotebookFooter />
        </div>
      </div>
    </Layout>
  );
};

export default Courses;