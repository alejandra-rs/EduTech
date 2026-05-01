export const uploadPDFDraft = async (
  courseId: string | number,
  userId: string | number,
  title: string,
  description: string,
  file: File
): Promise<{ post_id: number; attachment_id: number; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", courseId.toString());
    formData.append("student", userId.toString());
    formData.append("file", file);

    const response = await fetch(`/api/documents/upload-draft/`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Error al iniciar la vectorización del documento");
    return await response.json();
  } catch (error) {
    console.error("Error en uploadPDFDraft:", error);
    throw error;
  }
};