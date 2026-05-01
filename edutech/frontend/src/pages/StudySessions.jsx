import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TitlePage } from "../components/TitlePage";
import BellButton from "../components/BellButton";
import CalendarWidget from "../components/CalendarWidget";
import SessionItem from "../components/SessionItem";
import UserAvatar from "../components/UserAvatar";

import { getStudySessions, createStudySession } from "@services/connections-study-sessions";
import { getCourses, getCourse } from "@services/connections"; 

const StudySessions = ({ currentUserId, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courseName, setCourseName] = useState("Cargando asignatura...");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", courseId: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        courseIds: selectedSubject ? [selectedSubject] : [id],
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
    const loadInitialData = async () => {
      try {
        const courseData = await getCourse(id);
        const name = courseData?.name || courseData?.title || "Asignatura";
        setCourseName(name);

        const subjectsData = await getCourses(id); 
        const formattedSubjects = Array.isArray(subjectsData) ? subjectsData : subjectsData?.results || [];
        setSubjects(formattedSubjects);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        setCourseName("Sesiones de Estudio");
      }
    };

    if (id) loadInitialData();
  }, [id]);

  useEffect(() => {
    loadData();
  }, [selectedSubject, currentUserId, id]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await createStudySession({
        title: newSession.title,
        course_id: newSession.courseId || id,
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
    <div className="min-h-screen w-full bg-white font-sans relative selection:bg-gray-100">
      
      <div className="shrink-0 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <TitlePage PageName={courseName.toUpperCase()} onBack={() => navigate(-1)}>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hover:scale-110 transition-transform active:scale-95"
            >
              <PlusCircleIcon className="w-9 h-9 text-gray-800" />
            </button>
            <BellButton />
          </div>
        </TitlePage>
      </div>

      <main className="px-8 md:px-20 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          
          <aside className="md:col-span-5 lg:col-span-4 space-y-8">
            <div className="sticky top-28">
              <CalendarWidget 
                daysWithSessions={daysWithSessions}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
              
              <div className="mt-8">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                  Filtrar por asignatura
                </label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full appearance-none border-2 border-gray-100 bg-white text-gray-800 font-bold rounded-2xl py-4 px-6 shadow-sm focus:ring-4 focus:ring-gray-50 outline-none cursor-pointer transition-all hover:border-gray-200"
                >
                  <option value="">Todas mis asignaturas</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name || s.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section className="md:col-span-7 lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                Próximas Sesiones
              </h2>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {sessions.length} programadas
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 w-full bg-gray-50 animate-pulse rounded-3xl" />
                  ))}
                </div>
              ) : sessions.length > 0 ? (
                sessions.map(session => (
                  <SessionItem key={session.id} session={session} currentUserId={currentUserId} />
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium">No hay sesiones planeadas aquí.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-300 hover:text-black">
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Nueva Sesión</h3>
            
            <div className="bg-[#dfdfdf] rounded-lg p-5 sm:p-6 flex gap-4 w-full font-sans mb-8">
              <div className="flex flex-row">
                <UserAvatar imageUrl={currentUser?.picture} />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentUser?.first_name} {currentUser?.last_name}
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase ml-1">Asignatura</label>
                <select 
                  required value={newSession.courseId}
                  onChange={(e) => setNewSession({...newSession, courseId: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name || s.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase ml-1">Título de la Sesión</label>
                <input 
                  type="text" required placeholder="¿Qué vas a estudiar?"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase ml-1">Descripción</label>
                <textarea 
                  required rows="3" placeholder="Añade una breve descripción..."
                  value={newSession.description}
                  onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase ml-1">Fecha y Hora</label>
                <input 
                  type="datetime-local" required
                  value={newSession.scheduledAt}
                  onChange={(e) => setNewSession({...newSession, scheduledAt: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">
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