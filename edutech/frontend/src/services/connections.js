const BASE_URL = "http://localhost:8000";

export const getYears = async () => {
  try {
    const response = await fetch(`${BASE_URL}/years`);
    if (!response.ok) throw new Error("Error al obtener los años");
    return await response.json();
  } catch (error) {
    console.error("Error en getYears:", error);
    throw error;
  }
};

export const getCourses = async (yearId, quarter) => {
  let fetchUrl = `${BASE_URL}/courses?year.year_id=${yearId}`;
  if (quarter) {
    fetchUrl += `&quarter=${quarter}`;
  }
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error("Error al obtener las asignaturas");
    return await response.json();
  } catch (error) {
    console.error("Error en getSubjects:", error);
    throw error;
  }
};

export const getCourse = async (courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/`); 
    if (!response.ok) throw new Error("Error al obtener el curso");
    return await response.json();
  } catch (error) {
    console.error("Error en getCourse:", error);
    throw error;
  }
}



export const getPosts = async (courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents?course=${courseId}`);
    if (!response.ok) throw new Error("Error al obtener los posts");
    return await response.json();
  } catch (error) {
    console.error("Error en getPosts:", error);
    throw error;
  }
};

export const getDocument = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/${postId}`);
    if (!response.ok) throw new Error("Error al obtener el documento");
    return await response.json();
  } catch (error) {
    console.error("Error en getDocument:", error);
    throw error;
  }
};

export const getUserId = async () => {
  return 1;
};

export const checkSubscription = async (userId, courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/sub/?user=${userId}&course=${courseId}`);
    if (!response.ok) throw new Error("Error al verificar la suscripción");
    const data = await response.json();
    
    return data.length > 0 ? data[0].id : null; 
  } catch (error) {
    console.error("Error en checkSubscription:", error);
    throw error;
  }
};

export const subscribeToCourse = async (userId, courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/sub`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, course: courseId })
    });
    if (!response.ok) throw new Error("Error al suscribirse al curso");
    
    return await response.json(); 
  } catch (error) {
    console.error("Error en subscribeToCourse:", error);
    throw error;
  }
};

export const unsubscribe = async (subscriptionId) => {
  try {
    const deleteResponse = await fetch(`${BASE_URL}/courses/sub/${subscriptionId}`, {
      method: "DELETE" 
    });
    if (!deleteResponse.ok) throw new Error("Error al darse de baja del curso");
    return await deleteResponse.json();
  } catch (error) {
    console.error("Error en unsubscribe:", error);
    throw error;
  }
};

