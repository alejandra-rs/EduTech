import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import CalendarWidget from "../components/study-sessions/CalendarWidget";
import CreateSessionModal from "../components/study-sessions/CreateSessionModal";
import SessionItem from "../components/study-sessions/SessionItem";
import { useCurrentUser } from "../services/useCurrentUser";
import { getStudySessions, createStudySession } from "../services/connections-studysessions";
import { getYears, getCourses, getCourse } from "../services/connections-courses";
import { SubjectDropdown } from "../components/study-sessions/SubjectDropdown";
import type { Course } from "../models/courses/course.model";
import type { StudySession } from "../models/studysessions/studysession.model";
import type { NewSessionData } from "../components/study-sessions/CreateSessionModal";

const StudySessions = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { userData: currentUser } = useCurrentUser();

  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState(id ? "Cargando..." : "Sesiones de Estudio");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState<NewSessionData>({ title: "", courseId: id || "", description: "", scheduledAt: "" });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!currentUser?.id) return;
    const loadInitial = async () => {
      try {
        if (id) {
          const courseData = await getCourse(id);
          setCourseName(courseData?.name || "Asignatura");
        }
        const years = await getYears(currentUser.id);
        const nested = await Promise.all(years.map((y: { id: number }) => getCourses(y.id)));
        setSubjects(nested.flat());
      } catch (err) {
        console.error("Error cargando asignaturas:", err);
      }
    };
    loadInitial();
  }, [currentUser?.id, id]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const loadSessions = async () => {
      setLoading(true);
      try {
        const courseIds = selectedSubjects.length > 0 ? selectedSubjects : (id ? [id] : []);
        setSessions(await getStudySessions({ courseIds, studentId: currentUser.id }));
      } catch (err) {
        console.error("Error cargando sesiones:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, [selectedSubjects, currentUser?.id, id, refresh]);

  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { courseId, title, description, scheduledAt } = newSession;
    if (!courseId) { console.error("No course selected"); return; }
    try {
      await createStudySession({
        courseId: courseId === "divulgativa" ? null : courseId,
        creatorId: currentUser!.id,
        title,
        description,
        scheduledAt,
        twitchLink: "ejemplo" //TODO: twitchlink para crear sesiones de estudio
      });
      setIsModalOpen(false);
      setNewSession({ title: "", courseId: id || "", description: "", scheduledAt: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
      console.error("Error al crear la sesión", err);
    }
  };

  const handleDateChange = (day: string) => setSelectedDate((d) => (d === day ? null : day));

  const toLocalDateStr = (dateStr: string | Date): string => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const daysWithSessions = sessions.map((s) => toLocalDateStr(s.scheduled_at));
  const displayedSessions = selectedDate
    ? sessions.filter((s) => toLocalDateStr(s.scheduled_at) === selectedDate)
    : sessions;

  return (
    <div className="min-h-screen w-full bg-white font-sans relative selection:bg-gray-100">
      <div className="px-8 pt-12 w-full flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{courseName}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsModalOpen(true)} className="hover:scale-110 active:scale-95 transition-all">
            <PlusCircleIcon className="w-9 h-9 text-gray-800" />
          </button>
          <button onClick={() => navigate("/")} className="p-2 rounded-lg bg-slate-400 hover:bg-slate-700 transition-colors shrink-0">
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4 space-y-8 h-fit">
          <SubjectDropdown
            label="Filtrar por asignatura"
            value={selectedSubjects}
            onChange={(v) => setSelectedSubjects(Array.isArray(v) ? v : [v])}
            subjects={subjects}
            placeholder="Todas mis asignaturas"
            multiple
          />
          <CalendarWidget
            daysWithSessions={daysWithSessions}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </aside>

        <section className="md:col-span-8 flex flex-col gap-6 max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Próximas Sesiones</h2>
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors underline">
                Quitar filtro de fecha
              </button>
            )}
          </div>
          <div className="space-y-3">
            {loading ? (<p className="text-gray-500 italic">Cargando sesiones...</p>)
              : displayedSessions.length === 0 ? (<p className="text-gray-500 italic">No hay sesiones planeadas.</p>)
                : (displayedSessions.map((session) => (
                  <SessionItem key={session.id} session={session} currentUserId={currentUser?.id} />
                )))}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <CreateSessionModal
          setIsModalOpen={setIsModalOpen}
          currentUser={currentUser ?? null}
          handleCreateSession={handleCreateSession}
          newSession={newSession}
          setNewSession={setNewSession}
          subjects={subjects}
        />
      )}
    </div>
  );
};

export default StudySessions;
