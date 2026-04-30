import { useState } from "react";
import UploadDropzone from "../components/forms-components/UploadDropzone";
import Input from "../components/Input";

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    if (file) setIsConfirmed(true);
  };

  const handleUpload = () => {
    console.log("Subiendo archivo:", { file: file?.name, title, description });
  };


  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
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
            {!isConfirmed && (
                <div className="max-h-24 opacity-100 mt-8">
                    <button 
                        onClick={handleConfirm}
                        disabled={!file}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                    >
                        Confirmar documento
                    </button>
                </div>
            )}
        </div>

        <div 
          className={`flex flex-col space-y-6 transition-all duration-700 ease-in-out overflow-hidden ${
            isConfirmed ? "flex-1 opacity-100 max-h-[800px] pl-0 lg:pl-4" : "w-0 opacity-0 max-h-0 lg:max-h-full"
          }`}
        >
          <Input
            label="Título"
            placeholder="Introduce el título de la publicación"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Descripción"
            textarea
            placeholder="Escribe una breve descripción..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <button 
            onClick={handleUpload}
            disabled={!title.trim() || !description.trim()}
            className="mt-4 w-full bg-[#2d2d2d] hover:bg-black text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] shadow-lg disabled:bg-gray-400 transition-colors"
          >
            Publicar
          </button>
        </div>

      </div>
    </div>
  );
}