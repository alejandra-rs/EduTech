import { CommentReport, Report, ReportReason } from "../../models/documents/interactions/report.model";
import { apiFetchJson, JSON_HEADERS } from "../api";

function parseReportDates(item: any): Report {
  return {
    ...item,
    created_at: new Date(item.created_at),
    resolution: item.resolution
      ? { ...item.resolution, created_at: new Date(item.resolution.created_at) }
      : undefined,
  };
}

function parseTimestamp<T extends { created_at: string }>(raw: T): T & { created_at: Date } {
  return { ...raw, created_at: new Date(raw.created_at) };
}

export const getReportReasons = (): Promise<ReportReason[]> =>
  apiFetchJson(`/api/documents/reports/reasons/`);

export const createReport = async (postId: number, reasonId: number, description: string): Promise<Report> => {
  const raw = await apiFetchJson<any>(`/api/documents/reports/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ post_id: postId, reason_id: reasonId, description }),
  });
  return parseReportDates(raw);
};

export const getReports = async (adminId: number): Promise<Report[]> => {
  const rawData = await apiFetchJson<any[]>(`/api/documents/reports/?admin_id=${adminId}`);
  return rawData.map(parseReportDates);
};

export const rejectPostReports = (postId: number, adminId: number): Promise<{ detail: string }> =>
  apiFetchJson(`/api/documents/reports/post/${postId}/?admin_id=${adminId}`, { method: "DELETE" });

export const checkUserReport = (postId: number): Promise<{ reported: boolean }> =>
  apiFetchJson(`/api/documents/reports/check/?post_id=${postId}`);

export const createCommentReport = async (commentId: number, reasonId: number, description: string): Promise<CommentReport> => {
  const raw = await apiFetchJson<any>(`/api/documents/reports/comments/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ comment_id: commentId, reason_id: reasonId, description }),
  });
  return parseTimestamp(raw) as CommentReport;
};

export const resolveReport = async (postId: number, message: string, adminId: number, image?: File | null): Promise<{ detail: string }> => {
  const body = new FormData();
  body.append("message", message);
  body.append("admin_id", adminId.toString());
  if (image) body.append("image", image);
  return apiFetchJson(`/api/documents/reports/resolve/${postId}/`, { method: "POST", body });
};
