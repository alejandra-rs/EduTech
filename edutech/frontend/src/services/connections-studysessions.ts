import { StudySession, StudySessionComment } from "../models/courses/course.model";
import { CreateStudySessionPayload, GetStudySessionsParams } from "../models/studysession/studysession.model";
import { apiFetch } from "./api";



export const getStudySessions = async ({ 
  courseIds = [], 
  studentId = null, 
  starred = false 
}: GetStudySessionsParams = {}): Promise<StudySession[]> => {
  
  const params = new URLSearchParams();

  const hasDivulgativa = courseIds.includes("divulgativa");
  const realIds = courseIds.filter((id) => id !== "divulgativa");

  if (hasDivulgativa && realIds.length > 0) {
    params.append("include_no_course", "true");
    realIds.forEach((id) => params.append("courses", id.toString()));
  } else if (hasDivulgativa) {
    params.append("no_course", "true");
  } else {
    realIds.forEach((id) => params.append("courses", id.toString()));
  }

  if (studentId) params.append("student_id", studentId.toString());
  if (starred) params.append("starred", "true");

  const response = await apiFetch(`/api/courses/study-sessions/?${params}`);
  if (!response.ok) throw new Error("Error al obtener las sesiones de estudio");
  
  const rawData = await response.json();
  
  
  return rawData.map((session: any) => ({
    ...session,
    scheduled_at: new Date(session.scheduled_at),
    created_at: new Date(session.created_at)
  })) as StudySession[];
};

export const getStudySession = async (sessionId: number, studentId: number | null = null): Promise<StudySession> => {
  const params = studentId ? `?student_id=${studentId}` : "";
  const response = await apiFetch(`/api/courses/study-sessions/${sessionId}/${params}`);
  if (!response.ok) throw new Error("Error al obtener la sesión");
  
  const rawData = await response.json();
  return {
    ...rawData,
    scheduled_at: new Date(rawData.scheduled_at),
    created_at: new Date(rawData.created_at)
  } as StudySession;
};



export const createStudySession = async (payload: CreateStudySessionPayload): Promise<StudySession> => {
  const response = await apiFetch(`/api/courses/study-sessions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      
      course_id: payload.courseId ?? null, 
      creator_id: payload.creatorId,
      title: payload.title,
      description: payload.description,
      scheduled_at: payload.scheduledAt, 
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error("Error al crear la sesión"), { status: response.status, data });
  }
  
  const rawData = await response.json();
  return {
    ...rawData,
    scheduled_at: new Date(rawData.scheduled_at),
    created_at: new Date(rawData.created_at)
  } as StudySession;
};

export const deleteStudySession = async (sessionId: number): Promise<void> => {
  const response = await apiFetch(`/api/courses/study-sessions/${sessionId}/`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar la sesión de estudio");
};



export const starStudySession = async (sessionId: number, studentId: number): Promise<void> => {
  const response = await apiFetch(`/api/courses/study-sessions/${sessionId}/star/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId }),
  });
  if (!response.ok) throw new Error("Error al unirse a la sesión de estudio");
};

export const unstarStudySession = async (sessionId: number, studentId: number): Promise<void> => {
  const params = new URLSearchParams({ student_id: studentId.toString() });
  const response = await apiFetch(`/api/courses/study-sessions/${sessionId}/star/?${params}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al abandonar la sesión de estudio");
};



export const getStudySessionComments = async (sessionId: number): Promise<StudySessionComment[]> => {
  const response = await apiFetch(`/api/courses/study-sessions/${sessionId}/comments/`);
  if (!response.ok) throw new Error("Error al obtener los comentarios de la sesión");
  
  const rawData = await response.json();
  return rawData.map((comment: any) => ({
    ...comment,
    created_at: new Date(comment.created_at)
  })) as StudySessionComment[];
};

export const addStudySessionComment = async (sessionId: number, studentId: number, message: string): Promise<StudySessionComment> => {
  const response = await apiFetch(`/api/courses/study-sessions/${sessionId}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, message }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error("Error al añadir comentario"), { status: response.status, data });
  }
  
  const rawData = await response.json();
  return {
    ...rawData,
    created_at: new Date(rawData.created_at)
  } as StudySessionComment;
};