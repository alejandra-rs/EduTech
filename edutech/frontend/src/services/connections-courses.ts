import { Course, SubscriptionResponse, UserSubscription, Year } from '../models/courses/course.model';
import { apiFetchJson, apiFetchVoid, JSON_HEADERS } from './api';

export const getYears = (): Promise<Year[]> =>
  apiFetchJson(`/api/courses/years/`, { method: "GET", headers: JSON_HEADERS });

export const getCourses = async (yearId?: number, semester?: number): Promise<Course[]> => {
  const params = new URLSearchParams();
  if (yearId) params.append("year", yearId.toString());
  if (semester) params.append("semester", semester.toString());
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetchJson(`/api/courses/${query}`);
};

export const getCourse = (courseId: string | number): Promise<Course | null> =>
  apiFetchJson<Course>(`/api/courses/${courseId}/`).catch(() => null);

export const getSubscriptions = (): Promise<UserSubscription[]> =>
  apiFetchJson(`/api/courses/sub/`);

export const checkSubscription = async (courseId: number): Promise<number | null> => {
  try {
    const data = await apiFetchJson<{ id?: number }>(`/api/courses/sub/?course=${courseId}`);
    return data.id ?? null;
  } catch {
    return null;
  }
};

export const subscribeToCourse = (subscriptionData: { course: number }): Promise<SubscriptionResponse | null> =>
  apiFetchJson<SubscriptionResponse>(`/api/courses/sub/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(subscriptionData),
  })
    .then((response) => (response && typeof response.id === 'number' ? response : null))
    .catch(() => null);

export const unsubscribe = (subscriptionId: number): Promise<boolean> =>
  apiFetchVoid(`/api/courses/sub/${subscriptionId}`, { method: "DELETE" })
    .then(() => true)
    .catch(() => false);
