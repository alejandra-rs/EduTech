import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDegreeInfo } from "@services/degree";
import { getYears } from "@services/connections";
import { useCurrentUser } from "@services/useCurrentUser";
import SearchBar from "../components/SearchBar";
import PostGrid from "../components/PostGrid";
import YearWidget from "../components/core-structure/YearWidget";
import {CalendarDaysIcon} from "@heroicons/react/24/outline/index.d.ts";

const AllYears = () => {
  const [groupedDegrees, setGroupedDegrees] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();
  const { userData } = useCurrentUser();

  useEffect(() => {
    if (!userData?.id) return;
    (async () => {
      try {
        const years = await getYears(userData.id);
        const degreeIds = [...new Set(years.map(y => y.degree))];

        const data = await Promise.all(degreeIds.map(async (id) => {
          const info = await getDegreeInfo(id).catch(() => ({ name: "Carrera desconocida" }));
          return { ...info, id, years: years.filter(y => y.degree === id) };
        }));
        setGroupedDegrees(data);
      } catch (e) { console.error(e); }
    })();
  }, [userData?.id]);

  const handlePostClick = (p) => {
    const type = p.post_type === "PDF" ? "documento" : "video";
    navigate(`/${p.course}/${p.year}/${type}/${p.id}`);
  };

  return (
    <main className="h-screen overflow-y-auto p-6 md:p-12 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="mb-10 w-full flex justify-between items-center gap-4">
          <div className="flex-1">
            <SearchBar
                placeholder="Buscar documento..."
                color="bg-slate-800"
                onSearch={setSearchResults}
            />
          </div>

          <button
              onClick={() => navigate('/sesiones')}
              className="p-2 rounded-lg bg-slate-400 hover:bg-slate-700 transition-colors shrink-0"
          >
            <CalendarDaysIcon className="w-8 h-8 text-white" />
          </button>
        </div>

        {searchResults ? (
          <PostGrid posts={searchResults} onPostClick={handlePostClick} />
        ) : (
          groupedDegrees.map(({ id, name, universityName, years }) => (
            <section key={id} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 pb-2">
                {name} <span className="text-gray-400 font-normal">({universityName})</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {years.map((y) => (
                  <Link key={y.id} to={`/${y.id}/asignaturas`} className="block w-full transition hover:opacity-80" >
                    <YearWidget 
                      courseName={`${y.year}º Curso (${name})`} 
                      className="w-full h-full max-w-none" 
                    />
                  </Link> ))}
              </div>
            </section>
          )))}
      </div>
    </main>
  );
};


export default AllYears;
