import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Quarter } from "../components/Quarter.jsx";
import { TitlePage } from "../components/TitlePage.jsx";
import { getYearById } from "@services/degree";
import { useEffect } from "react";
const Subject = () => {
  const [yearData, setYearData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getYearById(id)
      .then((year) => {
        if (!year) {
          navigate("/");
        }
        setYearData(year);
      })
      .catch((error) => {
        console.error("Error al cargar el año:", error);
        navigate("/");
      });
  }, [id, navigate]);
  return (
    <div className="h-[calc(100vh-2px)]">
      <div className="flex flex-col   w-full overflow-y-auto">
        <TitlePage
          PageName={`${yearData ? yearData.year : id}º Curso`}
          backLabel="Cursos"
          onBack={() => navigate("/")}
        />
        <div className="flex-grow px-12 py-8 flex flex-col lg:flex-row gap-8 justify-center items-start overflow-hidden ">
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
    </div>
  );
};
export default Subject;
