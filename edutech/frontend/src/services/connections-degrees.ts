import { Degree, DegreeInfo, University, Year } from "../models/courses/course.model";
import { Student } from "../models/student/student.model";

export async function getUniversities(): Promise<University[]>  {
    let fetchUrl = `/api/courses/universities/`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener las universidades");
        return await response.json();
    } catch (error) {
        console.error("Error en getUniversities :", error);
        throw error;
    }
}

export async function getYearById(yearId: number): Promise<Year> {
    let fetchUrl = `/api/courses/years/${yearId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener el año");
        return await response.json();
    } catch (error) {
        console.error("Error en getYearById :", error);
        throw error;
    }
}

export async function getDegrees(universityId: number): Promise<Degree[]> {
    let fetchUrl = `/api/courses/degree/?university=${universityId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener las carreras");
        return await response.json();
    } catch (error) {
        console.error("Error en getDegrees :", error);
        throw error;
    }
}

export async function getDegreesByUserId(userId: number): Promise<Student> {
    let fetchUrl = `/api/students/${userId}/`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener la carrera del usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en getDegreesByUserId :", error);
        throw error;
    }
}

export async function saveUserDegree(userId: number, degreeId: number | number[]): Promise<Student> {
    let fetchUrl = `/api/students/${userId}/`;
    try {
        const response = await fetch(fetchUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ degree: Array.isArray(degreeId) ? degreeId : [degreeId] }),
        });
        if (!response.ok) throw new Error("Error al guardar la carrera del usuario");
        return await response.json();
    } catch (error) {
        console.error("Error en saveUserDegree :", error);
        throw error;
    }
}

export async function getDegreeName(degreeId: number): Promise<string> {
    let fetchUrl = `/api/courses/degree/?id=${degreeId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener el nombre de la carrera");
        const data = await response.json();
        return data[0].name;
    } catch (error) {
        console.error("Error en getDegreeName :", error);
        throw error;
    }
}

export async function getDegreeInfo(degreeId: number): Promise<DegreeInfo> {
    let fetchUrl = `/api/courses/degree/?id=${degreeId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener la carrera");
        const data = await response.json();
        return { name: data[0].name, universityName: data[0].university_name ?? null };
    } catch (error) {
        console.error("Error en getDegreeInfo :", error);
        throw error;
    }
}
