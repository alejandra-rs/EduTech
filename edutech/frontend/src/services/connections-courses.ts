import { Course, Subscription, Year } from '../models/course.model';

export const getYears = async (userId: number): Promise<Year[]> => {
  try {
    const response = await fetch(`/api/courses/years?user=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener los años");
    return await response.json() as Year[];
  } catch (error) {
    console.error("Error en getYears:", error);
    return [];
  }
};

export const getCourses = async (yearId?: number, semester?: number): Promise<Course[]> => {
  try {
    const params = new URLSearchParams();
    if (yearId) params.append("year", yearId.toString());
    if (semester) params.append("semester", semester.toString());
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(`/api/courses/${query}`);
    if (!response.ok) throw new Error("Error obteniendo asignaturas");
    return await response.json() as Course[];
  } catch (error) {
    console.error("Error en getCourses:", error);
    return [];
  }
};

export const getCourse = async (courseId: string | number): Promise<Course | null> => {
  try {
    const response = await fetch(`/api/courses/${courseId}/`);
    if (!response.ok) throw new Error("Error obteniendo la asignatura");
    return await response.json() as Course;
  } catch (error) {
    console.error(`Error en getCourse con id ${courseId}:`, error);
    return null;
  }
};

export const checkSubscription = async (userId: number, courseId: number): Promise<number | null> => {
  try {
    const response = await fetch(`/api/courses/sub/?user=${userId}&course=${courseId}`);
    if (!response.ok) throw new Error("Error al verificar la suscripción");
    const data = await response.json();
    return data.id ?? null;
  } catch (error) {
    console.error("Error en checkSubscription:", error);
    return null;
  }
};

export const subscribeToCourse = async (subscriptionData: Subscription): Promise<boolean> => {
  try {
    const response = await fetch(`/api/subscriptions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscriptionData),
    });
    return response.ok;
  } catch (error) {
    console.error("Error al suscribirse:", error);
    return false;
  }
};

export const unsubscribe = async (subscriptionId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/courses/sub/${subscriptionId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al darse de baja del curso");
    return true;
  } catch (error) {
    console.error("Error en unsubscribe:", error);
    return false;
  }
};
