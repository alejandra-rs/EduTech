import {
  StudySession,
  StudySessionComment,
  CreateStudySessionPayload,
  GetStudySessionsParams,
} from "../models/studysessions/studysession.model";
import { apiFetchJson, JSON_HEADERS } from "./api";

const BASE = "/api/study-sessions";

type RawSession = Omit<StudySession, "scheduled_at" | "created_at"> & {
  scheduled_at: string;
  created_at: string;
};

type RawComment = Omit<StudySessionComment, "user" | "created_at"> & {
  student: StudySessionComment["user"];
  created_at: string;
};

function parseSessionDates(raw: RawSession): StudySession {
  return { ...raw, scheduled_at: new Date(raw.scheduled_at), created_at: new Date(raw.created_at) };
}

function parseCommentShape({ student, ...rest }: RawComment): StudySessionComment {
  return { ...rest, user: student, created_at: new Date(rest.created_at) };
}

function buildSessionQueryParams({ courseIds = [], starred = false }: GetStudySessionsParams): URLSearchParams {
  const params = new URLSearchParams();
  const hasDivulgativa = courseIds.includes("divulgativa");
  const realIds = courseIds.filter((id) => id !== "divulgativa");

  if (hasDivulgativa && realIds.length > 0) {
    params.append("include_no_course", "true");
    realIds.forEach((id) => params.append("courses", id.toString()));
  }
  else if (hasDivulgativa) params.append("no_course", "true");
  else realIds.forEach((id) => params.append("courses", id.toString()));

  if (starred) params.append("starred", "true");
  return params;
}

export const getStudySessions = async (params: GetStudySessionsParams = {}): Promise<StudySession[]> => {
  const query = buildSessionQueryParams(params);
  const rawData = await apiFetchJson<RawSession[]>(`${BASE}/?${query}`);
  return rawData.map(parseSessionDates);
};

export const getStudySession = async (sessionId: number): Promise<StudySession> => {
  const rawData = await apiFetchJson<RawSession>(`${BASE}/${sessionId}/`);
  return parseSessionDates(rawData);
};

export const createStudySession = async (payload: CreateStudySessionPayload): Promise<StudySession> => {
  const rawData = await apiFetchJson<RawSession>(`${BASE}/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      course: payload.courseId ?? null,
      title: payload.title,
      description: payload.description,
      scheduled_at: payload.scheduledAt,
      twitch_link: payload.twitchLink,
    }),
  });
  return parseSessionDates(rawData);
};

export const deleteStudySession = (sessionId: number): Promise<void> =>
  apiFetchJson(`${BASE}/${sessionId}/`, { method: "DELETE" });

export const starStudySession = (sessionId: number): Promise<void> =>
  apiFetchJson(`${BASE}/${sessionId}/star/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({}),
  });

export const unstarStudySession = (sessionId: number): Promise<void> =>
  apiFetchJson(`${BASE}/${sessionId}/star/`, { method: "DELETE" });

export const getStudySessionComments = async (sessionId: number): Promise<StudySessionComment[]> => {
  const rawData = await apiFetchJson<RawComment[]>(`${BASE}/${sessionId}/comments/`);
  return rawData.map(parseCommentShape);
};

export const addStudySessionComment = async (sessionId: number, message: string): Promise<StudySessionComment> => {
  const rawData = await apiFetchJson<RawComment>(`${BASE}/${sessionId}/comments/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ message }),
  });
  return parseCommentShape(rawData);
};
