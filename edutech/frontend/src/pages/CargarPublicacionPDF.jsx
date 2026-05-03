import VisorPDF from "../components/VisorPDF";
import Input from "../components/Input";
import { TitlePage } from "../components/TitlePage";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { postDocument } from '@services/connections-documents';
import { useCurrentUser } from "@services/useCurrentUser";
import SuccessToast from "../components/SuccessToast";

export default function CargarPublicacionPDF() {
  const { userData } = useCurrentUser();
  const navigate = useNavigate();
  const { id, subjectId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const [published, setPublished] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleBack = () => navigate(`/${id}/${subjectId}/post`);

  const validateAndSetFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("Solo se permiten archivos PDF.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    if (file.size > 600 * 1024) {
      setFileError(`El archivo supera los 600 KB (${(file.size / 1024).toFixed(0)} KB).`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setFileError("");
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("Por favor selecciona un archivo PDF.");
      return;
    }
    await postDocument(subjectId, userData.id, title, description, "PDF", selectedFile);
    setPublished(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {published && (
        <SuccessToast
          message="¡Publicación exitosa!"
          onClose={() => navigate(`/${id}/${subjectId}/post`)}
        />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="w-full shrink-0 bg-transparent">
          <TitlePage PageName="Cargar Publicación" onBack={handleBack} />
        </div>
        <main className="flex-1 flex flex-col lg:flex-row gap-8 px-4 md:px-8 lg:px-12 pt-4 pb-12 overflow-y-auto items-start">
          <div className="w-full lg:w-[23%] xl:w-[28%] aspect-[1/1.4142] shrink-0">
            <VisorPDF pdfUrl={previewUrl} />
          </div>
          <div className="flex-1 w-full pl-0 lg:pl-8">
            <form className="space-y-6 w-full" onSubmit={handlePublish}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subir archivo
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragOver
                        ? "border-zinc-500 bg-zinc-50"
                        : "border-gray-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {selectedFile ? (
                      <p className="text-sm text-gray-700 font-medium">{selectedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">
                          Arrastra tu PDF aquí o{" "}
                          <span className="text-zinc-700 font-semibold underline">selecciona un archivo</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Solo PDF · Máximo 600 KB</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => validateAndSetFile(e.target.files[0])}
                  />
                  {fileError && (
                    <p className="text-sm text-red-500 mt-1">{fileError}</p>
                  )}
                </div>
                <Input
                  label="Título"
                  placeholder="Introduce el título de la publicación"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  label="Descripción"
                  placeholder="Escribe una breve descripción..."
                  rows={8}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="pt-4 mb-20">
                <button
                  type="submit"
                  className="w-full bg-[#2d2d2d] hover:bg-black text-white text-sm py-4 rounded-lg transition-all duration-200 flex justify-center items-center font-bold uppercase tracking-[0.2em] shadow-lg"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
