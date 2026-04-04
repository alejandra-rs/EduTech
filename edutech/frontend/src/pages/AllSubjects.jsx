import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotebookFooter from "../components/Footer";
import { Quarter } from "../components/Quarter.jsx";
import { TitlePage } from "../components/TitlePage.jsx";
const Subject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">
      <TitlePage PageName="Cursos" onBack={() => navigate(-1)} />
      <div className="flex-grow px-12 py-8 flex flex-col lg:flex-row gap-8 justify-center items-start overflow-hidden">
        <Quarter
          quarter={1}
          title="1º Cuatrimestre"
          navigate={navigate}
          yearId={id}
        />
        <Quarter
          quarter={2}
          title="2º Cuatrimestre"
          navigate={navigate}
          yearId={id}
        />
      </div>
    </div>
  );
};
export default Subject;
