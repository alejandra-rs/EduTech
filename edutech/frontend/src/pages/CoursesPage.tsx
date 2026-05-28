import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Quarter } from "../components/Quarter.js";
import { TitlePage } from "../components/TitlePage.js";
import { getYearById, getDegreeInfo } from "../services/connections-degrees.js";
import { DegreeInfo, Year } from "../models/courses/course.model.js";


const CoursesPage = () => {
  const [yearData, setYearData] = useState<Year>();
  const [degreeInfo, setDegreeInfo] = useState<DegreeInfo>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getYearById(Number(id))
      .then(async (year) => {
        if (!year) { navigate("/"); return; }
        setYearData(year);
        if (year.degree) {
          const info = await getDegreeInfo(year.degree);
          setDegreeInfo(info);
        }
      })
      .catch((error) => {
        console.error("Error al cargar el año:", error);
        navigate("/");
      });
  }, [id, navigate]);



  return (
      <div className="w-full h-auto min-h-screen overflow-y-auto lg:h-[calc(100vh-2px)] flex flex-col lg:overflow-hidden bg-slate-50">  
      <TitlePage
          PageName={`${yearData ? yearData.year : id}º Curso - ${degreeInfo?.name}`}
          subtitle={degreeInfo?.universityName}
          backLabel="Cursos"
          onBack={() => navigate("/")}
        />
        <div className="w-full h-auto flex flex-col gap-8 justify-center items-center p-6 lg:flex-row lg:h-0 lg:flex-grow lg:overflow-y-auto lg:items-start lg:gap-10 lg:px-20 lg:pt-5 lg:pb-5">
          <Quarter
            quarter={1}
            title="1º Cuatrimestre"
            yearId={id!}
          />
          <Quarter
            quarter={2}
            title="2º Cuatrimestre"
            yearId={id!}
          />
        </div>
      </div>
  );
};
export default CoursesPage;
