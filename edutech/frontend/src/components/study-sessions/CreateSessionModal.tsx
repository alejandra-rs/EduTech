import { XMarkIcon } from "@heroicons/react/24/solid";
import { SubjectDropdown } from "./SubjectDropdown";
import Input from "../Input";
import type { Student } from "../../models/student/student.model";
import type { Course } from "../../models/courses/course.model";

export interface NewSessionData {
  title: string;
  courseId: string;
  description: string;
  scheduledAt: string;
}

export interface CreateSessionModalProps {
  setIsModalOpen: (open: boolean) => void;
  currentUser: Student | null;
  handleCreateSession: (e: React.FormEvent<HTMLFormElement>) => void;
  newSession: NewSessionData;
  setNewSession: (session: NewSessionData) => void;
  subjects: Course[];
}

export const CreateSessionModal = ({ setIsModalOpen, handleCreateSession, newSession, setNewSession, subjects }: CreateSessionModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
    <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
      <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-300 hover:text-black">
        <XMarkIcon className="w-6 h-6" />
      </button>
      <h3 className="text-3xl font-bold text-gray-900 mb-5">Nueva Sesión</h3>
      <form onSubmit={handleCreateSession} className="space-y-4">
        <SubjectDropdown
          label="Asignatura"
          value={newSession.courseId}
          onChange={(v) => setNewSession({ ...newSession, courseId: Array.isArray(v) ? v[0] ?? "" : v })}
          subjects={subjects}
          placeholder="Seleccionar asignatura..."
        />
        <Input
          label="Título"
          placeholder="Indica un título para la sesión"
          required
          value={newSession.title}
          onChange={(e: React.ChangeEvent) => setNewSession({ ...newSession, title: (e.target as HTMLInputElement).value })}
        />
        <Input
          label="Descripción"
          placeholder="Añade una breve descripción..."
          textarea autoResize
          value={newSession.description}
          onChange={(e: React.ChangeEvent) => setNewSession({ ...newSession, description: (e.target as HTMLTextAreaElement).value })}
        />
        <Input
          label="Fecha y Hora"
          required type="datetime-local"
          value={newSession.scheduledAt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSession({ ...newSession, scheduledAt: e.target.value })}
        />
        <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">
          Crear Sesión
        </button>
      </form>
    </div>
  </div>
);

export default CreateSessionModal;
