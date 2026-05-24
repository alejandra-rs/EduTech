import type { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { Student } from "../models/student/student.model";
import { apiFetch, apiFetchJson } from "./api";

const parseNameParts = (account: AccountInfo): string[] =>
  account.name ? account.name.split(" ") : ["Sin", "Nombre"];

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

export const getUserByEmail = async (email: string): Promise<Student | null> => {
  try {
    const data = await apiFetchJson<Student[]>(`/api/students/?email=${email}`);
    if (data.length > 1) console.error(`Se encontraron múltiples usuarios con el email ${email}`);
    return data[0] || null;
  } catch (error) {
    console.error("Error al obtener el usuario por email:", error);
    return null;
  }
};

export const getUserPhoto = async (instance: IPublicClientApplication, account: AccountInfo): Promise<string | null> => {
  try {
    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["User.Read"],
      account,
      authority: `https://login.microsoftonline.com/${account.tenantId ?? "common"}`,
    });
    const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
    });
    if (!photoResponse.ok) return null;
    return blobToDataUrl(await photoResponse.blob());
  } catch (error) {
    console.error("Error al obtener la foto de Microsoft:", error);
    return null;
  }
};

export const postUser = async (instance: IPublicClientApplication, account: AccountInfo): Promise<Student> => {
  try {
    const nameParts = parseNameParts(account);
    const profilePic = await getUserPhoto(instance, account);

    const formData = new FormData();
    formData.append("first_name", nameParts[0]);
    formData.append("last_name", nameParts.slice(1).join(" "));
    formData.append("email", account.username);

    if (profilePic) {
      const blob = await (await fetch(profilePic)).blob();
      const safeEmail = account.username.replace(/[^a-zA-Z0-9]/g, "_");
      formData.append("picture", blob, `profile_${safeEmail}.jpg`);
    }

    return await apiFetchJson(`/api/students/post/`, { method: "POST", body: formData });
  } catch (error) {
    console.error("Error en postUser:", error);
    throw error;
  }
};

export const syncUser = async (instance: IPublicClientApplication, account: AccountInfo): Promise<void> => {
  try {
    const existing = await getUserByEmail(account.username);
    if (!existing) await postUser(instance, account);
  } catch (error) {
    console.error("Error en syncUser:", error);
    throw error;
  }
};

export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const data = await apiFetchJson<{ is_admin: boolean }>(`/api/students/me/is-admin/`);
    return data.is_admin === true;
  } catch {
    return false;
  }
};

export const deleteUserAccount = (): Promise<boolean> =>
  apiFetch(`/api/students/me/`, { method: "DELETE" })
    .then(r => r.ok)
    .catch(() => false);
