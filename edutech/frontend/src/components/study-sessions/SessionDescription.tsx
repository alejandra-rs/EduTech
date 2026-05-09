import type { StudySession } from '../../models/courses/course.model';

export interface SessionDescriptionProps {
  session: StudySession;
}

export function SessionDescription({ session }: SessionDescriptionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-500 italic ml-1">Descripción:</h3>
      <div className="border border-gray-200 p-4 rounded-lg text-gray-800 leading-relaxed break-all whitespace-normal text-md">
        {session.description || "No hay descripción disponible para esta sesión."}
      </div>
    </section>
  );
}

export default SessionDescription;
