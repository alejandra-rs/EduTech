import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../services/useCurrentUser";
import UploadDropzone from "../components/forms-components/UploadDropzone";
import StageList from "../components/forms-components/StageList";
import ProgressBar from "../components/forms-components/ProgressBar";
import Input from "../components/Input";
import SuccessToast from "../components/SuccessToast";
import { TitlePage } from "../components/TitlePage";
import {
  uploadPDFDraft,
  updateDraft,
  connectToDocumentStatus,
} from "../services/connections-documents";
import { ProcessingStatus } from "../components/ProcessingToast";

const STAGES: { key: ProcessingStatus; label: string }[] = [
  { key: "uploading",        label: "Subiendo fichero…" },
  { key: "extrayendo_txt",   label: "Extrayendo texto del PDF…" },
  { key: "reconociendo_img", label: "Analizando imágenes con IA…" },
  { key: "vectorizando",     label: "Vectorizando contenido…" },
  { key: "etiquetando",      label: "Etiquetando fragmentos…" },
  { key: "completed",        label: "¡Listo para IA!" },
];
const ORDER = STAGES.map((s) => s.key);

export default function UploadDocument() {
  const navigate = useNavigate();
  const { id, subjectId } = useParams();
  const { userData } = useCurrentUser();

  const [file, setFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [processingError, setProcessingError] = useState<string | undefined>();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => { socketRef.current?.close(); };
  }, []);

  const handleConfirm = async () => {
    if (!file || !subjectId || !userData?.id) return;

    const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
    const defaultDesc = `Borrador del documento ${file.name}`;
    setTitle(defaultTitle);
    setDescription(defaultDesc);
    setProcessingStatus("uploading");

    try {
      const data = await uploadPDFDraft(subjectId, userData.id, defaultTitle, defaultDesc, file);
      setDraftId(data.post_id);
      setIsConfirmed(true);

      if (data.attachment_id) {
        socketRef.current = connectToDocumentStatus(data.attachment_id, (wsData) => {
          if (wsData.status === "error") setProcessingError(wsData.message);
          setProcessingStatus(wsData.status as ProcessingStatus);
          if (wsData.status === "completed") socketRef.current?.close();
        });
      }
    } catch (error) {
      console.error("Fallo al subir el borrador:", error);
      setProcessingError("No se pudo subir el archivo. Inténtalo de nuevo.");
      setProcessingStatus("error");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftId) return;
    try {
      await updateDraft(draftId, title, description, "PDF", [], true);
      setPublished(true);
    } catch (error) {
      console.error("Fallo al publicar el documento:", error);
    }
  };

  const currentIdx = !processingStatus || processingStatus === "error" ? -1 : ORDER.indexOf(processingStatus);

  return (
    <div className="flex flex-col items-center w-full mx-auto p-4 md:p-8 bg-white min-h-screen relative">
      <div className="w-full shrink-0">
        <TitlePage PageName="Cargar Publicación" onBack={() => navigate(`/${id}/${subjectId}/post`)} />
      </div>

      {published && (
        <SuccessToast message="¡Publicación exitosa!" onClose={() => navigate(`/${id}/${subjectId}/post`)} />
      )}

      <div className={`mt-8 flex flex-col lg:flex-row gap-8 transition-all duration-700 ease-in-out ${
        isConfirmed ? "w-full" : "w-full max-w-2xl"
      }`}>
        
        <div className={`flex flex-col shrink-0 gap-4 transition-all duration-700 ease-in-out ${
          isConfirmed ? "w-full lg:w-[40%] xl:w-[35%]" : "w-full"
        }`}>
          <div className={`transition-all duration-700 ease-in-out ${isConfirmed ? "h-[500px]" : "h-[400px]"}`}>
            <UploadDropzone
              allowedType="pdf"
              maxSizeKB={600}
              selectedFile={file}
              onFileSelect={(selected) => {
                setFile(selected);
                if (!selected) setIsConfirmed(false);
              }}
              isConfirmed={isConfirmed}
            />
          </div>
          {file && !isConfirmed && (
          <div className="transition-all duration-300 opacity-100">
            <button
              onClick={handleConfirm}
              disabled={!file}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
              Confirmar documento
            </button>
          </div>
          )
        }
        </div>

        <form
          onSubmit={handleUpload}
          className={`flex flex-col space-y-6 transition-all duration-700 ease-in-out overflow-hidden ${
            isConfirmed ? "flex-1 opacity-100 max-h-[900px]" : "w-0 opacity-0 max-h-0"
          }`}
        >
          <Input
            label="Título"
            value={title}
            placeholder="Introduce el título de la publicación"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Descripción"
            value={description}
            placeholder="Escribe una breve descripción..."
            onChange={(e) => setDescription(e.target.value)}
          />

          {processingStatus && (
            <div className={`rounded-xl border overflow-hidden ${
              processingStatus === "error"
                ? "bg-red-50 border-red-200"
                : processingStatus === "completed"
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest px-4 pt-3 ${
                processingStatus === "error" ? "text-red-500" : processingStatus === "completed" ? "text-green-600" : "text-gray-400"
              }`}>
                {processingStatus === "error" ? "Error" : "Procesando documento"}
              </p>
              <StageList
                stages={STAGES}
                currentStage={processingStatus}
                errorStage="error"
                errorMessage={processingError}
              />
              <ProgressBar currentIdx={currentIdx} total={ORDER.length} isError={processingStatus === "error"} />
            </div>
          )}

          <button
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className="w-full bg-[#2d2d2d] hover:bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}
