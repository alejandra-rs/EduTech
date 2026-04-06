const BASE_URL = "http://localhost:8000";

export const getYears = async () => {
  try {
    const response = await fetch(`${BASE_URL}/courses/years`);
    if (!response.ok) throw new Error("Error al obtener los años");
    return await response.json();
  } catch (error) {
    console.error("Error en getYears:", error);
    throw error;
  }
};

export const getCourses = async (yearId, semester) => {
  let fetchUrl = `${BASE_URL}/courses?year.year_id=${yearId}`;
  if (semester) {
    fetchUrl += `&semester=${semester}`;
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

export const postDocument = async (courseId, userId, title, description, docType, file) => {
  try {
    const formData = new FormData();
  
    formData.append("course_id", courseId);
    formData.append("user_id", userId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("post_type", docType);
    formData.append("file", file);
  
    const response = await fetch(`${BASE_URL}/documents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error("Error al publicar el documento");
    return await response.json();

  } catch (error) {
    console.error("Error en postDocument:", error);
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
    const response = await fetch(`${BASE_URL}/courses/sub/`, { 
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

export const initialLike = async (userId, postId) => {
  return await fetch(`${BASE_URL}/documents/likes/?user=${userId}&post=${postId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener el estado del like");
      return response.json();
    })
    .catch(error => {
      console.error("Error en initialLike:", error);
      throw error;
    });
};

export const addLike = async (userId, postId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId }) 
    });
    if (!response.ok) throw new Error("Error al dar like");
    return await response.json(); 
  } catch (error) {
    console.error("Error en addLike:", error);
    throw error;
  }
};

export const removeLike = async (likeId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/likes/${likeId}`, {
      method: "DELETE" 
    });
    if (!response.ok) throw new Error("Error al quitar el like");
    return await response.json();
  } catch (error) {
    console.error("Error en removeLike:", error);
    throw error;
  }
};
export const initialDislike = async (userId, postId) => {
  return await fetch(`${BASE_URL}/documents/dislikes/?user=${userId}&post=${postId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener el estado del dislike");
      return response.json();
    })
    .catch(error => {
      console.error("Error en initialDisLike:", error);
      throw error;
    });
};

export const addDislike = async (userId, postId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/dislikes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId }) 
    });
    if (!response.ok) throw new Error("Error al dar dislike");
    return await response.json(); 
  } catch (error) {
    console.error("Error en addDislike:", error);
    throw error;
  }
};

export const removeDislike = async (dislikeId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/dislikes/${dislikeId}`, {
      method: "DELETE" 
    });
    if (!response.ok) throw new Error("Error al quitar el dislike");
    return await response.json();
  } catch (error) {
    console.error("Error en removeDislike:", error);
    throw error;
  }
};

export const getComments = async (documentId) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/comments/?post=${documentId}`);
    if (!response.ok) throw new Error("Error al obtener los comentarios");
    return await response.json();
  } catch (error) {
    console.error("Error en getComments:", error);
    throw error;
  } 
};