import { CommentReport, ReportReason } from "../../models/documents/interactions/report.model";
import { apiFetch } from "../api";

export const getReportReasons = async (): Promise<ReportReason[]> => {
  try {
    const response = await apiFetch(`/api/documents/reports/reasons/`);
    if (!response.ok) throw new Error("Error al obtener los motivos");
    return await response.json() as ReportReason[];
  } catch (error) {
    console.error("Error en getReportReasons:", error);
    throw error;
  }
};

export const createReport = async (postId: number, userId: number, reasonId: number, description: string): Promise<Report> => {
  try {
    const response = await apiFetch(`/api/documents/reports/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, user_id: userId, reason_id: reasonId, description }),
    });
    if (!response.ok) throw new Error("Error al enviar el reporte");
    
    const rawData = await response.json();
    return { ...rawData, created_at: new Date(rawData.created_at) } as Report;
  } catch (error) {
    console.error("Error en createReport:", error);
    throw error;
  }
};

export const getReports = async (adminId: number): Promise<Report[]> => {
  try {
    
    const response = await apiFetch(`/api/documents/reports/?admin_id=${adminId}`);
    if (!response.ok) throw new Error("Error al obtener los reportes");
    
    const rawData = await response.json();
    return rawData.map((item: any) => ({
      ...item,
      created_at: new Date(item.created_at),
      resolution: item.resolution 
        ? { ...item.resolution, created_at: new Date(item.resolution.created_at) }
        : undefined
    })) as Report[];
  } catch (error) {
    console.error("Error en getReports:", error);
    throw error;
  }
};

export const rejectPostReports = async (postId: number, adminId: number): Promise<{ detail: string }> => {
  try {
    const response = await apiFetch(`/api/documents/reports/post/${postId}/?admin_id=${adminId}`, { 
      method: "DELETE" 
    });
    if (!response.ok) throw new Error("Error al descartar los reportes");
    return await response.json();
  } catch (error) {
    console.error("Error en rejectPostReports:", error);
    throw error;
  }
};


export const checkUserReport = async (userId: number, postId: number): Promise<{ reported: boolean }> => {
  try {
    const response = await apiFetch(`/api/documents/reports/check/?user_id=${userId}&post_id=${postId}`);
    if (!response.ok) throw new Error("Error al verificar reporte");
    return await response.json();
  } catch (error) {
    console.error("Error en checkUserReport:", error);
    throw error;
  }
};

export const createCommentReport = async (commentId: number, userId: number, reasonId: number, description: string): Promise<CommentReport> => {
  try {
    const response = await apiFetch(`/api/documents/reports/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId, user_id: userId, reason_id: reasonId, description }),
    });
    if (!response.ok) throw new Error("Error al enviar el reporte");
    
    const rawData = await response.json();
    return { ...rawData, created_at: new Date(rawData.created_at) } as CommentReport;
  } catch (error) {
    console.error("Error en createCommentReport:", error);
    throw error;
  }
};


export const resolveReport = async (postId: number, message: string, adminId: number, image?: File | null): Promise<{ detail: string }> => {
  try {
    const body = new FormData();
    body.append("message", message);
    body.append("admin_id", adminId.toString());
    if (image) body.append("image", image);

    const response = await apiFetch(`/api/documents/reports/resolve/${postId}/`, {
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