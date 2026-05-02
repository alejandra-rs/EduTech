const BASE_URL = "http://127.0.0.1:8000";

export const getStudySessions = async ({ courseIds = [], studentId = null, starred = false } = {}) => {
  const params = new URLSearchParams();

  const hasDivulgativa = courseIds.includes("divulgativa");
  const realIds = courseIds.filter((id) => id !== "divulgativa");

  if (hasDivulgativa && realIds.length > 0) {
    params.append("include_no_course", "true");
    realIds.forEach((id) => params.append("courses", id));
  } else if (hasDivulgativa) {
    params.append("no_course", "true");
  } else {
    realIds.forEach((id) => params.append("courses", id));
  }

  if (studentId) params.append("student_id", studentId);
  if (starred) params.append("starred", "true");

  const response = await fetch(`${BASE_URL}/courses/study-sessions/?${params}`);
  if (!response.ok) throw new Error("Error al obtener las sesiones de estudio");
  return response.json();
};

export const getStudySession = async (sessionId, studentId = null) => {
  const params = studentId ? `?student_id=${studentId}` : "";
  const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/${params}`);
  if (!response.ok) throw new Error("Error al obtener la sesión");
  return response.json();
};

export const createStudySession = async ({ courseId, creatorId, title, description, scheduledAt }) => {
  const response = await fetch(`${BASE_URL}/courses/study-sessions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      course: courseId ?? null,
      creator: creatorId,
      title,
      description,
      scheduled_at: scheduledAt,
    }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error("Error al crear la sesión"), { status: response.status, data });
  }
  return response.json();
};

export const deleteStudySession = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar la sesión de estudio");
};

export const starStudySession = async (sessionId, studentId) => {
  const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/star/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId }),
  });
  if (!response.ok) throw new Error("Error al unirse a la sesión de estudio");
};

export const unstarStudySession = async (sessionId, studentId) => {
  const params = new URLSearchParams({ student_id: studentId });
  const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/star/?${params}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al abandonar la sesión de estudio");
};

export const getStudySessionComments = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/comments/`);
  if (!response.ok) throw new Error("Error al obtener los comentarios de la sesión");
  return response.json();
};

export const addStudySessionComment = async (sessionId, studentId, message) => {
  const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, message }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Object.assign(new Error("Error al añadir comentario"), { status: response.status, data });
  }
  return response.json();
};
