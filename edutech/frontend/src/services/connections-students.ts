// src/services/connections-user.ts
import { Student } from '../models/student.model';

const BASE_URL = "http://127.0.0.1:8000";

export const getUserByEmail = async (email: string): Promise<Student | null> => {
  try {
    // Ajusta esta URL a tu endpoint real de Django
    const response = await fetch(`${BASE_URL}/api/users/student/?email=${email}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Si tu API devuelve un array cuando filtras por email, sería data[0]
    // Si devuelve un objeto único, sería solo data.
    return data as Student; 
    
  } catch (error) {
    console.error("Error al obtener el usuario por email:", error);
    return null; // Devolvemos null para que el frontend sepa que falló
  }
};