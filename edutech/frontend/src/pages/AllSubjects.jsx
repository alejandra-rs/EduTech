import React from 'react';
import Layout from '../components/Layout';
import WidgetSubject from '../components/Subject';
import NotebookFooter from '../components/Footer';

const Subject = () => {
  const cuatri1 = Array(10).fill({ subjectName: "Asignatura", courseName: "Curso" });
  const cuatri2 = Array(10).fill({ subjectName: "Asignatura", courseName: "Curso" });

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">

        <div className="px-12 pt-10 flex items-center gap-4 shrink-0">
          <button className="text-4xl font-light hover:scale-110 transition-transform">{'<'}</button>
          <h1 className="text-5xl font-bold text-gray-800">Asignatura</h1>
        </div>

        <div className="flex-grow px-12 py-8 flex flex-col lg:flex-row gap-8 justify-center items-start overflow-hidden">

          <div className="bg-gray-200/70 rounded-[40px] p-6 w-full max-w-md h-full flex flex-col shadow-inner border border-black/5">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center shrink-0">1º Cuatrimestre</h2>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {cuatri1.map((sub, index) => (
                <WidgetSubject 
                  key={index}
                  subjectName={`${sub.subjectName} ${index + 1}`}
                  courseName={sub.courseName}
                  className="w-full shadow-sm"
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-200/70 rounded-[40px] p-6 w-full max-w-md h-full flex flex-col shadow-inner border border-black/5">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center shrink-0">2º Cuatrimestre</h2>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {cuatri2.map((sub, index) => (
                <WidgetSubject 
                  key={index}
                  subjectName={`${sub.subjectName} ${index + 1}`}
                  courseName={sub.courseName}
                  className="w-full shadow-sm"
                />
              ))}
            </div>
          </div>

        </div>

        <div className="shrink-0">
          <NotebookFooter />
        </div>
      </div>
    </Layout>
  );
};

export default Subject;