const BASE_URL = "http://127.0.0.1:8000";

export const getReportReasons = async () => {
  try {
    const response = await fetch(`${BASE_URL}/documents/reports/reasons/`);
    if (!response.ok) throw new Error("Error al obtener los motivos");
    return await response.json();
  } catch (error) {
    console.error("Error en getReportReasons:", error);
    throw error;
  }
};

export const createReport = async (postId, userId, reasonId, description) => {
  try {
    console.log(postId, userId, reasonId, description);
    const response = await fetch(`${BASE_URL}/documents/reports/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, user_id: userId, reason_id: reasonId, description }),
    });
    if (!response.ok) throw new Error("Error al enviar el reporte");
    return await response.json();
  } catch (error) {
    console.error("Error en createReport:", error);
    throw error;
  }
};

export const getReports = async (adminId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/reports/?admin_id=${adminId}`);
    if (!response.ok) throw new Error("Error al obtener los reportes");
    return await response.json();
  } catch (error) {
    console.error("Error en getReports:", error);
    throw error;
  }
};

export const rejectPostReports = async (postId, adminId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/documents/reports/post/${postId}/?admin_id=${adminId}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Error al descartar los reportes");
    return await response.json();
  } catch (error) {
    console.error("Error en rejectPostReports:", error);
    throw error;
  }
};

export const checkUserReport = async (userId, postId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/reports/check/?user_id=${userId}&post_id=${postId}`);
    if (!response.ok) throw new Error("Error al verificar reporte");
    return await response.json();
  } catch (error) {
    console.error("Error en checkUserReport:", error);
    throw error;
  }
};

export const createCommentReport = async (commentId, userId, reasonId, description) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/reports/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId, user_id: userId, reason_id: reasonId, description }),
    });
    if (!response.ok) throw new Error("Error al enviar el reporte");
    return await response.json();
  } catch (error) {
    console.error("Error en createCommentReport:", error);
    throw error;
  }
};

export const resolveReport = async (postId, message, adminId, image = null) => {
  try {
    const body = new FormData();
    body.append("message", message);
    body.append("admin_id", adminId);
    if (image) body.append("image", image);
    const response = await fetch(`${BASE_URL}/documents/reports/resolve/${postId}/`, {
      method: "POST",
      body,
    });
    if (!response.ok) throw new Error("Error al resolver el reporte");
    return await response.json();
  } catch (error) {
    console.error("Error en resolveReport:", error);
    throw error;
  }
};
