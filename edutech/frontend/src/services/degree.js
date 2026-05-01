const BASE_URL = "http://127.0.0.1:8000";


export const getUniversities = async () => {
    let fetchUrl = `${BASE_URL}/courses/universities/`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener las universidades");
        return await response.json();
    } catch (error) {
        console.error("Error en getUniversities :", error);
        throw error;
    }
};

export const getYearById = async (yearId) => {
    let fetchUrl = `${BASE_URL}/courses/years/${yearId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener el año");
        return await response.json();
    } catch (error) {
        console.error("Error en getYearById :", error);
        throw error;
    }
};

export const getDegrees = async (universityId) => {
    let fetchUrl = `${BASE_URL}/courses/degree?university=${universityId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener las carreras");
        return await response.json();
    } catch (error) {
        console.error("Error en getDegrees :", error);
        throw error;
    }
};

export const saveUserDegree = async (userId, degreeId) => {
    let fetchUrl = `${BASE_URL}/students/${userId}/`;
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

export const getDegreeName = async (degreeId) => {
    let fetchUrl = `${BASE_URL}/courses/degree?id=${degreeId}`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Error al obtener el nombre de la carrera");
        const data = await response.json();
        return data[0].name; 
    } catch (error) {
        console.error("Error en getDegreeName :", error);
        throw error;
    }
};