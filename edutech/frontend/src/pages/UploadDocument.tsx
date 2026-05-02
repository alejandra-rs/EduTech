import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../services/useCurrentUser";
import UploadDropzone from "../components/forms-components/UploadDropzone";
import Input from "../components/Input";
import SuccessToast from "../components/SuccessToast";
import { uploadPDFDraft, updateDraft } from "../services/connections-documents";

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

  // --- NUEVOS ESTADOS PARA EL WEBSOCKET ---
  const [documentStatus, setDocumentStatus] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  // Limpieza del socket cuando el usuario sale de la página
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const handleConfirm = async () => {
    if (!file || !subjectId || !userData?.id) return;

    const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
    const defaultDesc = `Borrador del documento ${file.name}`;

    setTitle(defaultTitle);
    setDescription(defaultDesc);

    try {
      const data = await uploadPDFDraft(
        subjectId,
        userData.id,
        defaultTitle,
        defaultDesc,
        file
      );
      
      setDraftId(data.post_id);
      setIsConfirmed(true);


      //TODO meter en connections
      if (data.attachment_id) {
        const wsUrl = `ws://127.0.0.1:8000/ws/documents/${data.attachment_id}/`;
        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
          const wsData = JSON.parse(event.data);
          setDocumentStatus(wsData.message); 
        };

        socket.onclose = () => console.log("WebSocket desconectado");
        socketRef.current = socket;
      }

    } catch (error) {
      console.error("Fallo al subir el borrador:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftId) return;

    try {
      await updateDraft(draftId, title, description, 'PDF', [], true); 
      setPublished(true);
    } catch (error) {
      console.error("Fallo al publicar el documento:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 md:p-8 bg-white min-h-screen relative">
      
      {published && (
        <SuccessToast
          message="¡Publicación exitosa!"
          onClose={() => navigate(`/${id}/${subjectId}/post`)}
        />
      )}

      <div 
        className={`mt-8 flex flex-col lg:flex-row gap-8 transition-all duration-700 ease-in-out ${
          isConfirmed ? "w-full justify-start" : "w-full max-w-2xl justify-center"
        }`}
      >
        
        <div 
          className={`flex flex-col shrink-0 transition-all duration-700 ease-in-out ${
            isConfirmed ? "w-full lg:w-[40%] xl:w-[35%] h-[500px]" : "w-full h-[450px]"
          }`}
        >
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

          <div className={`transition-all duration-300 overflow-hidden ${isConfirmed ? 'max-h-0 opacity-0 mt-0' : 'max-h-24 opacity-100 mt-8'}`}>
            <button 
              onClick={handleConfirm}
              disabled={!file}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
            >
              Confirmar documento
            </button>
          </div>
        </div>

        <form 
          onSubmit={handleUpload}
          className={`flex flex-col space-y-6 transition-all duration-700 ease-in-out overflow-hidden ${
            isConfirmed ? "flex-1 opacity-100 max-h-[800px] pl-0 lg:pl-4" : "w-0 opacity-0 max-h-0 lg:max-h-full"
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
            rows={8}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <div className="mt-4 w-full flex flex-col items-center">
            {/* ESTADO EN VERDE JUSTO ENCIMA DEL BOTÓN */}
            {documentStatus && (
              <p className="text-green-600 font-semibold mb-2 animate-pulse text-sm uppercase tracking-wider">
                {documentStatus}
              </p>
            )}
            
            <button 
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="w-full bg-[#2d2d2d] hover:bg-black text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] shadow-lg disabled:bg-gray-400 transition-colors"
            >
              Publicar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}