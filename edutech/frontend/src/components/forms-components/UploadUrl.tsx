import { useState } from "react";
import Input from "../components/Input";
import UrlValidatorInput from "./UrlValidatorInput";
import UrlPreview from "./UrlPreview";

export default function UploadUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleConfirmUrl = (validUrl: string) => {
    setUrl(validUrl);
    setIsConfirmed(true);
  };

  const handleUpload = () => {
    console.log("Subiendo URL:", { url, title, description });
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
            isConfirmed 
              ? "w-full lg:w-[40%] xl:w-[35%] h-[400px]" 
              : "w-full h-[250px] bg-white border border-gray-200 p-8 rounded-xl shadow-sm justify-center"
          }`}
        >
          {!isConfirmed ? (
             <UrlValidatorInput onConfirm={handleConfirmUrl} />
          ) : (
             <UrlPreview url={url!} />
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

          {isConfirmed && (
            <UrlValidatorInput 
              onConfirm={() => {}} 
              isConfirmed={true} 
              initialUrl={url!} 
            />
          )}

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