import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TitlePage } from "../components/TitlePage";
import BellButton from "../components/BellButton";
import CalendarWidget from "../components/CalendarWidget";
import SessionItem from "../components/SessionItem";

import { getStudySessions, createStudySession } from "@services/connections-study-sessions";
import { getCourses } from "@services/connections"; 

const StudySessions = ({ currentUserId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([
    {
        id: "mock-1",
        title: "Sesión de Prueba Manual",
        description: "Esta es una descripción para ver cómo queda el diseño.",
        scheduled_at: new Date().toISOString(),
        course_details: { name: "Matemáticas Avanzadas",},
        creator_details: { first_name: "Usuario", last_name: "Demo"},
        is_starred: false,
        stars_count: 5
    },
    {
      id: "mock-2",
      title: "Repaso de Álgebra Lineal y Geometría Analítica",
      description: "Revisión de subespacios vectoriales.",
      scheduled_at: new Date(Date.now() + 886400000).toISOString(),
      course_details: { name: "Álgebra" },
      creator_details: { first_name: "Ana", last_name: "García" },
      is_starred: true,
      stars_count: 12
    },
]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", courseId: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        courseIds: selectedSubject ? [selectedSubject] : [],
        studentId: currentUserId
      };
      const sessionsData = await getStudySessions(filters);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error cargando sesiones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const coursesData = await getCourses(id);
        setSubjects(Array.isArray(coursesData) ? coursesData : coursesData?.results || []);
      } catch (error) {
        console.error("Error cargando asignaturas:", error);
      }
    };
    if (id) loadSubjects();
  }, [id]);

  useEffect(() => {
    //loadData();
  }, [selectedSubject, currentUserId]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await createStudySession({
        title: newSession.title,
        course_id: newSession.courseId,
        student_id: currentUserId,
        scheduled_at: new Date().toISOString()
      });
      
      setIsModalOpen(false);
      setNewSession({ title: "", courseId: "" });
      loadData();
    } catch (error) {
      alert("Error al crear la sesión");
    }
  };

  const daysWithSessions = sessions.map(s => new Date(s.scheduled_at).getDate());

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden font-sans relative">
      <div className="shrink-0">
        <TitlePage PageName="SESIONES DE ESTUDIO" onBack={() => navigate(-1)}>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsModalOpen(true)}>
              <PlusCircleIcon className="w-9 h-9 text-gray-800 hover:text-black transition-colors" />
            </button>
            <BellButton />
          </div>
        </TitlePage>
      </div>

      <div className="flex-grow overflow-y-auto px-8 md:px-20 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <CalendarWidget 
              daysWithSessions={daysWithSessions}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full appearance-none border-2 border-gray-100 bg-white text-gray-800 font-bold text-center rounded-2xl py-4 px-6 shadow-sm focus:ring-4 focus:ring-gray-50 outline-none cursor-pointer transition-all"
            >
              <option value="">Todas las Asignaturas</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name || s.title}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-7 lg:col-span-8">
            <h2 className="text-xl font-black text-gray-900 mb-8 uppercase">Próximas Sesiones</h2>
            <div className="space-y-1">
              {loading ? <p className="animate-pulse">Cargando...</p> : 
               sessions.map(session => <SessionItem key={session.id} session={session} currentUserId={currentUserId} />)}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 transform transition-all">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tighter">
              Nueva Sesión
            </h3>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase ml-1">Nombre de la Sesión</label>
                <input 
                  type="text"
                  required
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  placeholder="Ej: Repaso examen final"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase ml-1">Asignatura</label>
                <select 
                  required
                  value={newSession.courseId}
                  onChange={(e) => setNewSession({...newSession, courseId: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gray-200 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Selecciona una opción</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name || s.title}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-black transition-colors shadow-lg shadow-gray-200"
              >
                Crear Sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessions;