const BASE_URL = 'http://localhost:8000';

export const getYears = async () => {
  try {
    const response = await fetch(`${BASE_URL}/years`);
    if (!response.ok) throw new Error('Error al obtener los años');
    return await response.json();
  } catch (error) {
    console.error('Error en getYears:', error);
    throw error;
  }
};

export const getCourses = async (yearId, quarter) => {
  let fetchUrl = `${BASE_URL}/courses?year_id=${yearId}`;
  if (quarter) {
    fetchUrl += `&quarter=${quarter}`;
  }
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Error al obtener las asignaturas');
    return await response.json();
  } catch (error) {
    console.error('Error en getSubjects:', error);
    throw error;
  }
};

export const getPosts = async (courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts?course_id=${courseId}`);
    if (!response.ok) throw new Error('Error al obtener los posts');
    return await response.json();
  } catch (error) {
    console.error('Error en getPosts:', error);
    throw error;
  } 
};

export const getSuscritions = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions?user_id=${userId}`);
    if (!response.ok) throw new Error('Error al obtener las suscripciones');
    return await response.json();
  } catch (error) {
    console.error('Error en getSuscritions:', error);
    throw error;
  }
};
