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
    <div className="h-[calc(100vh-2px)]">
      <div className="flex flex-col w-full overflow-y-auto">
        <TitlePage
          PageName={`${yearData ? yearData.year : id}º Curso - ${degreeInfo?.name}`}
          subtitle={degreeInfo?.universityName}
          backLabel="Cursos"
          onBack={() => navigate("/")}
        />
        <div className="flex-grow px-12 py-8 flex flex-col lg:flex-row gap-8 justify-center items-start overflow-hidden">
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
    </div>
  );
};
export default CoursesPage;
