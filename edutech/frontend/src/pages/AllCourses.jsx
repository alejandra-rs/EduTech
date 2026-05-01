import SearchBar from "../components/SearchBar";
import { CourseWidget } from "../components/CourseWidget";
import PostGrid from "../components/PostGrid";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getYears } from "@services/connections";
import { useCurrentUser } from "@services/useCurrentUser";
import { getDegreeName } from "@services/degree";

const Courses = () => {
  const [groupedDegrees, setGroupedDegrees] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  useEffect(() => {
    if (!userData?.id) return;
    const fetchCoursesAndDegrees = async () => {
      try {
        const yearsData = await getYears(userData.id);
        if (!yearsData || yearsData.length === 0) return;

        const uniqueDegreeIds = [
          ...new Set(yearsData.map((year) => year.degree)),
        ];
        const degreesData = await Promise.all(
          uniqueDegreeIds.map(async (degreeId) => {
            if (!degreeId) return { id: degreeId, name: "Carrera desconocida" };
            try {
              const name = await getDegreeName(degreeId);
              return { id: degreeId, name: name };
            } catch (error) {
              console.error(`Error al cargar la carrera ${degreeId}:`, error);
              return { id: degreeId, name: "Carrera no encontrada" };
            }
          }),
        );
        const structuredData = degreesData.map((degree) => ({
          ...degree,
          years: yearsData.filter((year) => year.degree === degree.id),
        }));

        setGroupedDegrees(structuredData);
      } catch (error) {
        console.error("Error al cargar cursos y carreras:", error);
      }
    };
    fetchCoursesAndDegrees();
  }, [userData?.id]);

  const handlePostClick = (post) => {
    const route = post.post_type === "PDF" ? "documento" : "video";
    navigate(`/${post.course}/${post.year}/${route}/${post.id}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2px)] w-full overflow-hidden">
      <div className="flex-grow overflow-y-auto custom-scrollbar px-8 pt-12 pb-10">
        <div className="mb-10 w-full">
          <SearchBar
            placeholder="Buscar documento..."
            color="bg-slate-800"
            onSearch={setSearchResults}
          />
        </div>

        {searchResults !== null ? (
          <PostGrid posts={searchResults} onPostClick={handlePostClick} />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6 w-full max-w-7xl mx-auto">
            {groupedDegrees.map((degree) => (
              <>
                <h1
                  key={degree.id}
                  className="text-3xl font-bold text-gray-800 mb-6 col-span-full"
                >
                  {degree.name}
                </h1>
                {degree.years.map((year) => (
                  <Link
                    to={`/${year.id}/asignaturas`}
                    key={year.id}
                    className="block transition-transform hover:scale-[1.02]"
                  >
                    <CourseWidget
                      courseName={year.year + "º Curso"}
                      className="max-w-none w-full"
                    />
                  </Link>
                ))}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
