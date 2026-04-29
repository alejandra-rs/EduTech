// src/services/connections-course.ts
import { Course, Subscription } from '../models/course.model';

const BASE_URL = "http://127.0.0.1:8000";

export const getCourses = async (yearId?: number): Promise<Course[]> => {
  try {
    const url = yearId 
        ? `${BASE_URL}/api/courses/?year=${yearId}`
        : `${BASE_URL}/api/courses/`;
        
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error obteniendo asignaturas");
    
    return await response.json() as Course[];
  } catch (error) {
    console.error("Error en getCourses:", error);
    return [];
  }
};

export const getCourse = async (courseId: string | number): Promise<Course | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/courses/${courseId}/`);
    if (!response.ok) throw new Error("Error obteniendo la asignatura");
    
    return await response.json() as Course;
  } catch (error) {
    console.error(`Error en getCourse con id ${courseId}:`, error);
    return null;
  }
};

export const subscribeToCourse = async (subscriptionData: Subscription): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error al suscribirse:", error);
    return false;
  }
};