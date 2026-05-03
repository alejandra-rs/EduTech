import { Student } from '../models/student.model';

// Minimal interfaces for MSAL to avoid a hard dependency on @azure/msal-browser
interface MsalTokenRequest {
  scopes: string[];
  account: MsalAccount;
  authority: string;
}

interface MsalInstance {
  acquireTokenSilent(request: MsalTokenRequest): Promise<{ accessToken: string }>;
}

interface MsalAccount {
  name?: string;
  username: string;
  tenantId?: string;
}

export const getUserByEmail = async (email: string): Promise<Student | null> => {
  try {
    const response = await fetch(`/api/students/?email=${email}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    if (data.length > 1) console.error(`Se encontraron múltiples usuarios con el email ${email}`);
    return data[0] || null;
  } catch (error) {
    console.error("Error al obtener el usuario por email:", error);
    return null;
  }
};

export const getUserPhoto = async (instance: MsalInstance, account: MsalAccount): Promise<string | null> => {
  try {
    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["User.Read"],
      account,
      authority: `https://login.microsoftonline.com/${account.tenantId ?? 'common'}`,
    });

    const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
    });

    if (!photoResponse.ok) return null;

    const blob = await photoResponse.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error al obtener la foto de Microsoft:", error);
    return null;
  }
};

export const postUser = async (instance: MsalInstance, account: MsalAccount): Promise<Student> => {
  try {
    const nameParts = account.name ? account.name.split(" ") : ["Sin", "Nombre"];
    const profilePic = await getUserPhoto(instance, account);

    const formData = new FormData();
    formData.append("first_name", nameParts[0]);
    formData.append("last_name", nameParts.slice(1).join(" "));
    formData.append("email", account.username);

    if (profilePic) {
      const res = await fetch(profilePic);
      const blob = await res.blob();
      const safeEmail = account.username.replace(/[^a-zA-Z0-9]/g, '_');
      formData.append("picture", blob, `profile_${safeEmail}.jpg`);
    }

    const response = await fetch(`/api/students/post/`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Error al crear el usuario");
    return await response.json() as Student;
  } catch (error) {
    console.error("Error en postUser:", error);
    throw error;
  }
};

export const syncUser = async (instance: MsalInstance, account: MsalAccount): Promise<void> => {
  try {
    const existing = await getUserByEmail(account.username);
    if (!existing) await postUser(instance, account);
  } catch (error) {
    console.error("Error en syncUser:", error);
    throw error;
  }
};

export const checkIsAdmin = async (userId: string) => {
  try {
    const response = await fetch(`/api/students/${userId}/is-admin/`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.is_admin === true;
  } catch (error) {
    console.error("Error en checkIsAdmin:", error);
    return false;
  }
};