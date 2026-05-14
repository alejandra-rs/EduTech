import type {
  IPublicClientApplication,
  AccountInfo,
} from "@azure/msal-browser";
import { Student } from "../models/student/student.model";
import { apiFetch } from "./api";

export const getUserByEmail = async (
  email: string,
): Promise<Student | null> => {
  try {
    const response = await apiFetch(`/api/students/?email=${email}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    if (data.length > 1)
      console.error(`Se encontraron múltiples usuarios con el email ${email}`);
    return data[0] || null;
  } catch (error) {
    console.error("Error al obtener el usuario por email:", error);
    return null;
  }
};

export const getUserPhoto = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
): Promise<string | null> => {
  try {
    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["User.Read"],
      account,
      authority: `https://login.microsoftonline.com/${account.tenantId ?? "common"}`,
    });

    const photoResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/photo/$value",
      {
        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
      },
    );

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

export const postUser = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
): Promise<Student> => {
  try {
    const nameParts = account.name
      ? account.name.split(" ")
      : ["Sin", "Nombre"];
    const profilePic = await getUserPhoto(instance, account);

    const formData = new FormData();
    formData.append("first_name", nameParts[0]);
    formData.append("last_name", nameParts.slice(1).join(" "));
    formData.append("email", account.username);

    if (profilePic) {
      const res = await fetch(profilePic);
      const blob = await res.blob();
      const safeEmail = account.username.replace(/[^a-zA-Z0-9]/g, "_");
      formData.append("picture", blob, `profile_${safeEmail}.jpg`);
    }

    const response = await apiFetch(`/api/students/post/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Error al crear el usuario");
    return (await response.json()) as Student;
  } catch (error) {
    console.error("Error en postUser:", error);
    throw error;
  }
};

export const syncUser = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
): Promise<void> => {
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
    const response = await apiFetch(`/api/students/${userId}/is-admin/`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.is_admin === true;
  } catch (error) {
    console.error("Error en checkIsAdmin:", error);
    return false;
  }
};

export const deleteUserAccount = async (userId: number) => {
  try {
    const response = await apiFetch(`/api/students/${userId}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la cuenta");
    return true;
  } catch (error) {
    console.error("Error en deleteUserAccount:", error);
    return false;
  }
};
