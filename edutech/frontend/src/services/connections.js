const BASE_URL = "http://127.0.0.1:8000";

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
  let fetchUrl = `${BASE_URL}/courses?year=${yearId}`;
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

export const getLinkDescarga = (postId) => { return `${BASE_URL}/documents/download/pdf/${postId}` };

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

export const getFilteredPosts = async (courseId, title) => {
  try {
    const url = `${BASE_URL}/documents/?search_title=${title}${courseId ? `&course=${courseId}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener los posts filtrados");
    return await response.json();
  } catch (error) {
    console.error("Error en getFilteredPosts:", error);
    throw error;
  }
}

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
  
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", courseId);
    formData.append("student", userId);
    formData.append("file", file);
  
    const response = await fetch(`${BASE_URL}/documents/upload/${docType.toLowerCase()}/`, {
      method: "POST",
      body: formData
    });
    if (!response.ok) throw new Error("Error al publicar el documento");
    return await response.json();

  } catch (error) {
    console.error("Error en postDocument:", error);
    throw error;
  }
};

export const checkSubscription = async (userId, courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/sub/?user=${userId}&course=${courseId}`);
    if (!response.ok) throw new Error("Error al verificar la suscripción");
    const data = await response.json();
    return data.id ? data.id : null; 
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


export const syncUser = async (instance, dataMSL) => {
  try {
    const data = await getUserByEmail(dataMSL.username);
    if (!data || data.length === 0) {
      await postUser(instance, dataMSL);
    }
  } catch (error) {
    console.error("Error en syncUser:", error);
    throw error;
  };
}

export const postUser = async (instance, account) => {
  try {
    const nameParts = account.name ? account.name.split(" ") : ["Sin", "Nombre"];
    const profilePic = await getUserPhoto(instance, account);

    let formData = new FormData();
    formData.append("first_name", nameParts[0]);
    formData.append("last_name", nameParts.slice(1).join(" "));
    formData.append("email", account.username);
    if (profilePic) {
      const res = await fetch(profilePic);
      const blob = await res.blob();
      const safeEmail = account.username.replace(/[^a-zA-Z0-9]/g, '_');
      formData.append("picture", blob, `profile_${safeEmail}.jpg`);
    }

    const response = await fetch(`${BASE_URL}/students/post/`, {
      method: "POST",
      body: formData
    });
    if (!response.ok) throw new Error("Error al crear el usuario");
    return await response.json();
  } catch (error) {
    console.error("Error en postUser:", error);
    throw error;
  }
}

export const getUserPhoto = async (instance, account) => {
  try {
    const request = {
      scopes: ["User.Read"],
      account: account,
      authority: `https://login.microsoftonline.com/${account.tenantId || 'common'}`
    };

    const response = await instance.acquireTokenSilent(request);

    const photoUrl = "https://graph.microsoft.com/v1.0/me/photo/$value";
    const photoResponse = await fetch(photoUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${response.accessToken}`
      }
    });

    if (photoResponse.ok) {
      const blob = await photoResponse.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    return null;
  } catch (error) {
    console.error("Error al obtener la foto de Microsoft:", error);
    return null;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/students?email=${email}`);
    if (!response.ok) throw new Error("Error al obtener el usuario");
    const data = await response.json();
    return data.length > 0 ? data[0] : data;
  } catch (error) {
    console.error("Error en getUserByEmail:", error);
    return null;
  }
};

export const getLikes = async (userId, postId) => {
  return await fetch(`${BASE_URL}/documents/likes/?user=${userId}&post=${postId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener el estado del like");
      return response.json();
    })
    .catch(error => {
      console.error("Error en getLikes:", error);
      throw error;
    });
};

export const addLike = async (userId, postId) => {
  try {
    const dislikes = await getDislikes(userId, postId)
    if (dislikes.id !== -1) await removeDislike(dislikes.id);
    const response = await fetch(`${BASE_URL}/documents/likes/`, {
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
export const getDislikes = async (userId, postId) => {
  return await fetch(`${BASE_URL}/documents/dislikes/?user=${userId}&post=${postId}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener el estado del dislike");
      return response.json();
    })
    .catch(error => {
      console.error("Error en getDislikes:", error);
      throw error;
    });
};

export const addDislike = async (userId, postId) => {
  try {
    const likes = await getLikes(userId, postId)
    if (likes.id !== -1) await removeLike(likes.id);
    const response = await fetch(`${BASE_URL}/documents/dislikes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, post: postId })
    });
    if (!response.ok) throw new Error("Error al dar dislike");
    return await response.json();
  } catch (error) {
    console.error("Error en addDislike:", error);
    throw error;
  };
}

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

export const postComment = async (userId, postId, message) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/comments/?user=${userId}&post=${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: userId,
        post: postId,
        message: message,
        created_at: new Date().toISOString()
      })
    });
    if (!response.ok) throw new Error("Error al agregar el comentario");
    return await response.json();
  } catch (error) {
    console.error("Error en postComment:", error);
    throw error;
  }
};

export const postQuiz = async (courseId, userId, title, description, questions) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/upload/quiz/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        description: description,
        course: courseId,
        student: userId,
        questions: questions.map(question => ({
          title: question.title,
          answers: question.answers.map(answer => ({ text: answer.text, is_correct: answer.isCorrect })),
        })),
      }),
    });
    if (!response.ok) throw new Error("Error al publicar el cuestionario");
    return await response.json();
  } catch (error) {
    console.error("Error en postQuiz:", error);
    throw error;
  }
};

export const postFlashCardDeck = async (courseId, userId, title, description, cards) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/upload/flashcards/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        description: description,
        course: courseId,
        student: userId,
        cards: cards.map(card => ({ question: card.question, answer: card.answer })),
      }),
    });
    if (!response.ok) throw new Error("Error al publicar las flashcards");
    return await response.json();
  } catch (error) {
    console.error("Error en postFlashCardDeck:", error);
    throw error;
  }
};

export const checkQuizAnswers = async (postId, responses) => {
  try {
    const response = await fetch(`${BASE_URL}/documents/${postId}/quiz/check/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses }),
    });
    if (!response.ok) throw new Error("Error al corregir el cuestionario");
    return await response.json();
  } catch (error) {
    console.error("Error en checkQuizAnswers:", error);
    throw error;
  }
};

