const BASE_URL = "http://127.0.0.1:8000";

export const getStudySessions = async ({ courseIds = [], studentId = null, starred = false } = {}) => {
  try {
    const params = new URLSearchParams();
    courseIds.forEach((id) => params.append("courses", id));
    if (studentId) params.append("student_id", studentId);
    if (starred) params.append("starred", "true");

    const response = await fetch(`${BASE_URL}/courses/study-sessions/?${params}`);
    if (!response.ok) throw new Error("Error al obtener las sesiones de estudio");
    return await response.json();
  } catch (error) {
    console.error("Error en getStudySessions:", error);
    throw error;
  }
};

export const createStudySession = async (courseId, creatorId, title, description, scheduledAt) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/study-sessions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course: courseId,
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
    return await response.json();
  } catch (error) {
    console.error("Error en createStudySession:", error);
    throw error;
  }
};

export const deleteStudySession = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la sesión de estudio");
  } catch (error) {
    console.error("Error en deleteStudySession:", error);
    throw error;
  }
};

export const starStudySession = async (sessionId, studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/star/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId }),
    });
    if (!response.ok) throw new Error("Error al unirse a la sesión de estudio");
  } catch (error) {
    console.error("Error en starStudySession:", error);
    throw error;
  }
};

export const unstarStudySession = async (sessionId, studentId) => {
  try {
    const params = new URLSearchParams({ student_id: studentId });
    const response = await fetch(
      `${BASE_URL}/courses/study-sessions/${sessionId}/star/?${params}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Error al abandonar la sesión de estudio");
  } catch (error) {
    console.error("Error en unstarStudySession:", error);
    throw error;
  }
};

export const getStudySessionComments = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/comments/`);
    if (!response.ok) throw new Error("Error al obtener los comentarios de la sesión");
    return await response.json();
  } catch (error) {
    console.error("Error en getStudySessionComments:", error);
    throw error;
  }
};

export const addStudySessionComment = async (sessionId, studentId, message) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/study-sessions/${sessionId}/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, message }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw Object.assign(new Error("Error al añadir comentario"), { status: response.status, data });
    }
    return await response.json();
  } catch (error) {
    console.error("Error en addStudySessionComment:", error);
    throw error;
  }
};
