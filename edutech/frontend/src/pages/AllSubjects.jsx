import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WidgetSubject from '../components/Subject';
import NotebookFooter from '../components/Footer';

const Subject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const cuatri1 = Array(10).fill({ subjectName: "Asignatura", courseName: `Curso ${id}` });
  const cuatri2 = Array(10).fill({ subjectName: "Asignatura", courseName: `Curso ${id}` });

  return (
    <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">
      <div className="px-12 pt-10 shrink-0">
        <div 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-4 cursor-pointer w-fit"
        >
          <span className="text-4xl font-light group-hover:scale-125 group-hover:-translate-x-1 transition-all duration-200 text-gray-600">
            {'<'}
          </span>
          
          <h1 className="text-5xl font-bold text-gray-800 group-hover:text-black transition-colors group-hover:scale-105 group-hover:-translate-x-1 duration-300">
            Curso {id}
          </h1>
        </div>
      </div>

      <div className="flex-grow px-12 py-8 flex flex-col lg:flex-row gap-8 justify-center items-start overflow-hidden">
        
        <div className="bg-gray-200/70 rounded-[40px] p-6 w-full max-w-md h-full flex flex-col shadow-inner border border-black/5">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center shrink-0">1º Cuatrimestre</h2>
          <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {cuatri1.map((sub, index) => {
              const currentSubjectName = `${sub.subjectName} ${index + 1}`;
              
              return (
                <WidgetSubject 
                  key={index}
                  subjectName={currentSubjectName}
                  courseName={sub.courseName}
                  className="w-full shadow-sm"
                  onNavigate={() => navigate(`/${id}/${currentSubjectName}/post`)}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-gray-200/70 rounded-[40px] p-6 w-full max-w-md h-full flex flex-col shadow-inner border border-black/5">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center shrink-0">2º Cuatrimestre</h2>
          <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {cuatri2.map((sub, index) => {
              const currentSubjectName = `${sub.subjectName} ${index + 11}`;
              
              return (
                <WidgetSubject 
                  key={index}
                  subjectName={currentSubjectName}
                  courseName={sub.courseName}
                  className="w-full shadow-sm"
                  onNavigate={() => navigate(`/${id}/${currentSubjectName}/post`)}
                />
              );
            })}
          </div>
        </div>

      </div>

      <div className="shrink-0">
        <NotebookFooter />
      </div>
    </div>
  );
};

export default Subject;