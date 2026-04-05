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
    const response = await fetch(`${BASE_URL}/couses/${courseId}`);
    if (!response.ok) throw new Error("Error al obtener los años");
    return await response.json();
  } catch (error) {
    console.error("Error en getYears:", error);
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


export const syncUser = async (instance, dataMSL) => {
  try {
    const email = dataMSL.username;
    const response = await fetch(`${BASE_URL}/students?email=${email}`);
    const data = await response.json();

    if (!response.ok) throw new Error("Error al verificar el usuario");
    if (response.status === 404 || data.length === 0) {
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

    const newUser = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" "),
      email: account.username,
      picture: profilePic
    };

    const response = await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    if (!response.ok) throw new Error("Error al crear el usuario");
    return await response.json();
  } catch (error) {
    console.error("Error en syncUser:", error);
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

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error en getUserByEmail:", error);
    return null;
  }
};

export const getUserId = async (dataAccount) => {
  try {
    const data = await getUserByEmail(dataAccount.username);
    if (!data) throw new Error("Usuario no encontrado");
    return data.id;
  } catch (error) {
    console.error("Error en getUserId:", error);
    throw error;
  }
};


