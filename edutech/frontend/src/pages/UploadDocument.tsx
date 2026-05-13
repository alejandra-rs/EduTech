import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../services/useCurrentUser";
import UploadDropzone from "../components/forms-components/UploadDropzone";
import StageList from "../components/forms-components/StageList";
import ProgressBar from "../components/forms-components/ProgressBar";
import Input from "../components/Input";
import SuccessToast from "../components/SuccessToast";
import { TitlePage } from "../components/TitlePage";
import { uploadPDFDraft, updateDraft } from "../services/connections-documents";
import { connectToDocumentStatus, generateDocumentDescription, validatePDF } from "../services/connections-ia"
import { PDF_STATES, PDF_STAGES, PDF_STAGES_MAP } from "../models/documents/states.model";

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

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const [processingStatus, setProcessingStatus] = useState<PDF_STATES>("pending");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => { socketRef.current?.close(); };
  }, []);

  const handleConfirm = async () => {
    if (!file || !subjectId || !userData?.id) return;

    const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
    const defaultDesc = `Descripción del documento ${file.name}`;
    setTitle(defaultTitle);
    setDescription(defaultDesc);
    setProcessingStatus("uploading");

    try {
      
      const data = await uploadPDFDraft({ post_type: 'PDF', courseId: Number(subjectId), studentId: userData.id, title: defaultTitle, description: defaultDesc, file });
      setDraftId(data.post_id);
      const status = await validatePDF(data.post_id)
      console.log("enviando a validar")
      setIsConfirmed(status.status);

      if (data.attachment_id) {
        socketRef.current = connectToDocumentStatus(data.attachment_id, (status) => {
          setProcessingStatus(status);
          if (status === "completed" || status === "error") {
            socketRef.current?.close();
          }
        });
      }
    } catch (error) {
      setProcessingStatus("error");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftId) return;
    try {
      await updateDraft({ draftId, post_type: 'PDF', courseId: Number(subjectId), studentId: userData!.id, title, description, file: file! });
      setPublished(true);
    } catch (error) {
      console.error("Fallo al publicar el documento:", error);
    }
  };

  const handleGenerateDescription = async () => {
    if (!draftId) return;
    setIsGeneratingDesc(true);
    try {
      const generatedText = await generateDocumentDescription(draftId);
      setDescription(generatedText);
    } catch (error) {
      console.error("Fallo al generar la descripción con IA:", error);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const currentIdx = !processingStatus || processingStatus === "error" 
    ? -1 
    : PDF_STAGES.findIndex((stage) => stage.key === processingStatus);

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />
          <div className="flex flex-col">
            <Input
              label="Descripción"
              value={description}
              placeholder="Escribe una breve descripción..."
              textarea
              row={4}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGeneratingDesc || !draftId}
              className="self-end mt-2 flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 disabled:text-gray-400 font-semibold transition-colors"
            >
              <span>✨</span>
              {isGeneratingDesc ? "Generando resumen..." : "Autocompletar con IA"}
            </button>
          </div>

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
              <StageList<PDF_STATES>
                stages={PDF_STAGES}
                currentStage={processingStatus}
                errorStage={PDF_STAGES_MAP.error}
              />
              <ProgressBar currentIdx={currentIdx} total={PDF_STAGES.length} isError={processingStatus === "error"} />
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
